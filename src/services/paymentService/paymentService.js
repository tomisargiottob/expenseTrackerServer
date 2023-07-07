import mercadopago from './mercadopago'
import CuitModel from '../../models/invoicer/Cuit'
import OrganizationModel from '../../models/Organization'
import errors from 'common-errors'
import { differenceInDays} from 'date-fns'

const cuitPrices = {
    5: process.env.PRICING_BASIC,
    10: process.env.PRICING_STANDARD,
    1000: process.env.PRICING_ADVANCED,
}

class PaymentService {
    constructor() {
        this.service = mercadopago
    }
    async createSubscription(amount, user) {
        const cuits = await CuitModel.count({organization: user.organization})
        const organization = await OrganizationModel.findById(user.organization)
        if(cuits > amount) {
            throw new errors.ValidationError('Se tienen mas cuits registrados de los que se desea suscribir, por favor modifique la cantidad o elimine los cuits que no desea mantener')
        }
        const pricingBand = Object.keys(cuitPrices).find((cuits) => amount < cuits)
        const selectedPrice = cuitPrices[pricingBand]
        const preference = {
            payer_email: user.email,
            reason: `Suscripcion de ${amount} cuits`,
            external_reference: "",
            back_url: "https://www.app.facturama.com.ar/",
            auto_recurring: {
              frequency: 1,
              frequency_type: "months",
              transaction_amount: amount * selectedPrice,
              currency_id: "ARS"
            }
        };
        let paymentUrl;
        if(!organization.suscriptionId) {
            paymentUrl = await mercadopago.preapproval.create(preference)
        } else {
            const oldSuscriptions = await mercadopago.preapproval.get(organization.suscriptionId)
            if(!oldSuscriptions || ['cancelled', 'paused'].includes(oldSuscriptions.response.status)) {
                paymentUrl = await mercadopago.preapproval.create(preference)
            } else {
                paymentUrl = await mercadopago.preapproval.update({id: organization.suscriptionId,auto_recurring: preference.auto_recurring, reason: preference.reason})
            }
        }
        await OrganizationModel.updateOne({_id: organization._id},{suscriptionId: paymentUrl.response.id, maxCuits: amount})
        return paymentUrl
    }
    async pauseSuscription(user) {
        const organization = await OrganizationModel.findById(user.organization)
        await mercadopago.preapproval.update({id: organization.suscriptionId, status: 'paused'})
    }
    async getSuscriptionData(organizationId) {
        const organization = await OrganizationModel.findById(organizationId)
        const organizationStatus = {
            maxCuits: organization.maxCuits,
            paymentRequired: false,
        }
        if(differenceInDays(new Date(), organization.createdAt) < 15 || organization.freeAccount) {
            return organizationStatus
        }
        if(!organization.suscriptionId) {
            organizationStatus.paymentRequired = true
            return organizationStatus
        }
        const currentSuscription = await mercadopago.preapproval.get(organization.suscriptionId)
        if (currentSuscription.response.status !== 'authorized') {
            organizationStatus.paymentRequired = true
            return organizationStatus
        }
        return organizationStatus
    }
}

export default PaymentService