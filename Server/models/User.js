const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    resetToken:String,
    expireToken:Date,
    pic:{
     type:String,
     default:"https://hcmut.edu.vn/img/nhanDienThuongHieu/01_logobachkhoasang.png"
    },
    addCart:[{type:ObjectId,ref:"Cart"}],
    address:{
        type:String,
        required:true
    },
    sector:{
        type:String,
        required:true 
    },
    city:{
        type:String,
        required:true
    },
    phoneno:{
        type:String,
        required:true
    }
})

mongoose.model("User",userSchema)