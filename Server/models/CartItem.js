const mongoose=require('mongoose')
const {ObjectId}=mongoose.Schema.Types
const cartItemSchema =new mongoose.Schema({
    itemPost:{
        type:ObjectId,
        ref:"Post"
    },
    amount:{
        type:Number,
        required:true
    },
    cartBy: {
        type: ObjectId,
        ref: "Cart"
      }
})
mongoose.model("CartItem",cartItemSchema)