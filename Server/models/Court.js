const mongoose=require('mongoose')
const {ObjectId}=mongoose.Schema.Types
const courtSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    pos:{
        type:String,
        required:true
    },
    owner:{
        type:String,
        required:true
    },
    revenue: {
        type: Number
    },


})

mongoose.model("Court",courtSchema)