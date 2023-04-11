import balanceModel from '../models/invoicer/Balance';

class BalanceService {
    static async getCurrentYearBalances(cuitId) {
        const lastYear = new Date()
        lastYear.setFullYear(new Date().getFullYear() - 1)
        const balances = await balanceModel.find({cuit: cuitId, date: {$gte: lastYear.getTime()}})
        return balances.map((balance)=> balance.toJSON())
    }
    static async create(balance) {
        const createdBalance = await balanceModel.create(balance)
        return createdBalance
    }
    static async batchCreation(balances, cuitId) {
        try {
            const formatedBalances = balances.map((balance) => ({
                date: balance.date,
                amount: balance.amount,
                cuit: cuitId
            }))
            await balanceModel.insertMany(formatedBalances)
        } catch (err) {
            console.log('Could not create cuit balances',err.message)
            throw err
        }
    }
}

export default BalanceService