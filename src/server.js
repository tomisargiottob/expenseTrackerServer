import express from 'express'
import './dbConnect'
const app = express()
app.use(express.json())
import userRouter from './routes/usersRoute'
import organizationsRouter from './routes/organizationRoute'
import cors from 'cors';

app.use(cors())
app.use('/api/users/' , userRouter)
app.use('/api' , organizationsRouter)
app.get('/',(req,res) => {
  try {
    res.status(200).json({ message: 'Bienvenido al api de Facturama'})
  } catch (err) {
    res.status(500).json({ message: 'El servidor no responde'})
  }
})

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Node JS Server started at port ${port}!`))