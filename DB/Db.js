const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/pg_23', {
    useNewUrlParser : true
})


const db = mongoose.connection;

db.on('error' , ()=>{
    console.log("Something Went Wrong During Connection")
})

db.once('open', ()=>{
    console.log('Succesfully Connected With mongoDB')
})


module.exports =  db;