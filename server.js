const express = require('express')
require('./dbConnect')
const app = express()
app.use(express.json())
const path = require('path')
const userRouter = require('./routes/usersRoute')
const organizationsRouter = require('./routes/organizationRoute')


app.use('/api/users/' , userRouter)
app.use('/api' , organizationsRouter)

const port = process.env.PORT || 5000

if(process.env.NODE_ENV === 'production')
{
     app.use('/' , express.static('client/build'))

     app.get('*' , (req, res)=>{
         res.sendFile(path.resolve(__dirname, 'client/build/index.html'))
     })
}



app.listen(port, () => console.log(`Node JS Server started at port ${port}!`))