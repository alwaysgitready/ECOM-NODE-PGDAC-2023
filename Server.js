const express  =  require('express');
const bodyParser    = require('body-parser')
const app   = express()
const PORT  = 9800;
const db  = require('./DB/Db')
const Routes =  require('./Routes/UserRoutes')

const cors = require('cors')


app.use(cors())


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended  : true}))




app.use('/' ,  Routes)













app.listen(PORT   ,  ()=>{
    console.log(`Server is runnig on PORT : ${PORT}`)
})








