const express  =  require('express');
const bodyParser    = require('body-parser')
const app   = express()
const PORT  = 9800;
const db  = require('./DB/Db')
const UserRoutes =  require('./Routes/UserRoutes')
const AdminRoutes =  require('./Routes/AdminRoutes')
const AdminRegister   = require('./Config/RegisterAdmin')

const cors = require('cors')


app.use(cors())


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended  : true}))




app.use('/user' ,  UserRoutes)
app.use('/admin' ,  AdminRoutes)













app.listen(PORT   ,  ()=>{
    console.log(`Server is runnig on PORT : ${PORT}`)
})








