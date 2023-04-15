import BalanceService from '../../services/balanceService.js';
import errors from 'common-errors'
import CuitService from '../../services/cuitService';

class BalanceController {
    static async batchBalanceCreate(req, res) {
        try {
            const { balances } = req.body;
            const { id } = req.params
            const existentCuit = CuitService.one(res.locals.user.organization, id)
            if(!existentCuit) {
                throw errors.NotFoundError('Cuit not registered in user organization')
            }
            await BalanceService.batchCreation(balances, id)
            return res.status(200).json({message: 'Balance successfully added'})
        } catch (err) {
            if(err instanceof errors.NotFoundError) {
                return res.status(404).json({message: err.message})
            }
            if(err instanceof errors.AlreadyInUseError) {
                return res.status(400).json({message: err.message})
            }
            console.log(err)
            return res.status(500).json({message: 'Could not add balance to cuit'})
        }
    }
    static async getAllBalances(req, res) {
        try {
            const { id } = req.params
            const existentCuit = CuitService.one(res.locals.user.organization, id)
            if(!existentCuit) {
                throw errors.NotFoundError('Cuit not registered in user organization')
            }
            const balances = await BalanceService.getCurrentYearBalances(id)
            return res.status(200).json(balances)
        } catch (err) {
            if(err instanceof errors.NotFoundError) {
                return res.status(404).json({message: err.message})
            }
            console.log(err)
            return res.status(500).json({message: 'Could not get cuit balance'})
        }
    }
}

export default BalanceController