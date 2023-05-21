import PaymentService from "../services/paymentService/paymentService"

class PaymentController {
    constructor() {
        this.paymentService = new PaymentService()
    }
    async createPayment(req, res) {
        try {
            const { cuitAmount } = req.body;
            if (!cuitAmount) {
                return res.status(400).json({message: 'Debe indicar el numero de cuits que desea suscribir'})
            }
            const mercadopagoResponse = await this.paymentService.createSubscription(cuitAmount, res.locals.user)
            res.status(200).json({message: 'Pago creado', paymentId: mercadopagoResponse.response.id, link: mercadopagoResponse.response.init_point})
        } catch (err) {
            res.status(400).json({message: err.message})
        }
    }
    async pauseSuscription(req, res) {
        try {
            await this.paymentService.pauseSuscription(res.locals.user)
            res.status(204).json({message: 'suscripcion pausada'})
        } catch (err) {
            res.status(400).json({message: err.message})
        }
    }
}

export default PaymentController