const mongoose=require('mongoose')
const {ObjectId}=mongoose.Schema.Types
const cartSchema =new mongoose.Schema({
    itemPost:{
        type:ObjectId,
        ref:"CartItem"
    },
    inUse:{
        type:Boolean,
        required:true
    }
})
mongoose.model("Cart",cartSchema)