import express from 'express'
import './dbConnect'
const app = express()
app.use(express.json())
import userRouter from './routes/usersRoute'
import organizationsRouter from './routes/organizationRoute'
import cors from 'cors';

app.use(
  cors({
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    exposedHeaders: ['Total-Count', 'Total-Pages', 'Authorization'],
  }),
)
app.use('/api/users/' , userRouter)
app.use('/api' , organizationsRouter)

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Node JS Server started at port ${port}!`))