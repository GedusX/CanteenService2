const express = require('express')
const app=express()
const mongoose =require('mongoose')
const PORT =4000
const {MONGOURI}=require("./Key")



mongoose.connect(MONGOURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
mongoose.connection.on('connected',()=>{
    console.log("connected to mongo")
})
mongoose.connection.on('error',(err)=>{
    console.log("error connecting",err)
})

require('./models/User')
require('./models/Food')
require('./models/Cart')
require('./models/CartItem')
require('./models/Court')


app.use(express.json())
app.use(require('./routes/Auth'))
app.use(require('./routes/Food'))
app.use(require('./routes/User'))
app.use(require('./routes/Cart'))



if(process.env.Node_ENV=='production'){

    const path =require('path')

    app.get('/',(req,res)=>{

    app.use(express.static(path.resolve(__dirname,"client","build")))
     res.sendFile(path.resolve(__dirname,"client","build","index.html"))
    })
}

app.listen(PORT,()=>{
    console.log("Server is running on",PORT);
})