const mongoose=require('mongoose')
const {ObjectId}=mongoose.Schema.Types
const foodSchema =new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    desc:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        required:true
    },
    likes:[{type:ObjectId,ref:"User"}],
    //comments: []
    toCart:[{type:ObjectId,ref:"User"}],
    comments:[{
        text:String,
        postedBy:{type:ObjectId,ref:"User"}
    }],
    desc:{
        type:String,
        required:true
    },
    belongTo:{
        type:ObjectId,
        ref:"Court"
    }

})

mongoose.model("Food",foodSchema)