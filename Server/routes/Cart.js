const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin  = require('../middleware/requireLogin')
const Cart = mongoose.model("Cart")
const CartItem = mongoose.model("CartItem")
const User = mongoose.model("User")

async function getInUseCartId(req) {
  try {
    const result = await User.findById(req.user._id).populate("addCart");
    const cartList = result.addCart;
    const isUseCart = cartList.find((cart) => cart.inUse === true);

    if (isUseCart === undefined) {
      const newCart = new Cart({
        inUse: true,
      });

      await newCart.save();

      await User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { addCart: newCart._id },
        },
        {
          new: true,
        }
      ).exec();

      // console.log("New cart created");
      return newCart._id;
    } else {
      // console.log("No cart created");
      return isUseCart._id;
    }
  } catch (error) {
    console.error(error);
  }
}

router.get('/mycart', requireLogin, async (req, res) => {
  try {
    const cart_id = await getInUseCartId(req);
   
    CartItem.find({ cartBy: cart_id })
    .populate('itemPost')
    .then(result=>{
      //console.log(result)
      return res.json({result});
    })
  } catch (err) {
      console.log(err);
      return res.status(400).json({ err: 'Error' });
  }
});

router.put('/quickaddToCart',requireLogin, async (req,res)=>{
  var cart_id = await getInUseCartId(req)  
  console.log(req.body.foodId)
  CartItem.countDocuments({ itemPost: req.body.foodId, cartBy: cart_id})
  .then(count => {
      console.log(count)
      if (count > 0) {
        // Item already exists in the cart
        return CartItem.findOne({ itemPost: req.body.foodId, cartBy: cart_id});
      } else {
        // Item doesn't exist, create a new CartItem
        if (req.body.amount>0){
          const newItem = new CartItem({
              itemPost: req.body.foodId,
              amount: req.body.amount ? req.body.amount : 1,
              cartBy: cart_id,
          });
          return newItem.save()
              .then(savedItem => {
              // Update the Cart with the new item
              return Cart.findByIdAndUpdate(
                  cart_id,
                  {
                  $push: { itemPost: savedItem._id },
                  },
                  {
                  new: true,
                  }
              ).exec();
              });
        }
      }
    })
    .then(result => {
      if (result && result.amount) {
        CartItem.findByIdAndUpdate(result._id,{
          $set:{amount : req.body.amount + result.amount}
      }).exec().then(()=>{
        res.status(200).json({ message: `Item amount increased by ${req.body.amount}` });
      });  
      } else {
        res.status(200).json({ message: 'Item added to cart successfully' });
      }
    })
});


router.put('/addToCart',requireLogin, async (req,res)=>{
  var cart_id = await getInUseCartId(req)  
  console.log(req.body.foodId)
  CartItem.countDocuments({ itemPost: req.body.foodId, cartBy: cart_id})
  .then(count => {
      console.log(count)
      if (count > 0) {
        // Item already exists in the cart
        return CartItem.findOne({ itemPost: req.body.foodId, cartBy: cart_id});
      } else {
        // Item doesn't exist, create a new CartItem
        if (req.body.amount>0){
          const newItem = new CartItem({
              itemPost: req.body.foodId,
              amount: req.body.amount ? req.body.amount : 1,
              cartBy: cart_id,
          });
          return newItem.save()
              .then(savedItem => {
              // Update the Cart with the new item
              return Cart.findByIdAndUpdate(
                  cart_id,
                  {
                  $push: { itemPost: savedItem._id },
                  },
                  {
                  new: true,
                  }
              ).exec();
              });
        }
      }
    })
    .then(result => {
      if (result && result.amount) {
          if (req.body.amount <= 0){
              Cart.findByIdAndUpdate(result.cartBy,{
                  $pull:{itemPost: result._id}
              }).exec();
              CartItem.findByIdAndDelete(result._id).exec();
              res.status(200).json({ message: 'Item remove'});
          }else if (result.amount != req.body.amount){
              CartItem.findByIdAndUpdate(result._id,{
                  $set:{amount : req.body.amount}
              }).exec();
              res.status(200).json({ message: 'Item amount change' });
          } else{
              res.status(200).json({ message: 'This item is already exist'});
          }
      } else if (req.body.amount <= 0) {
          res.status(200).json({ message: 'The amount can not be less or equal 0'}); 
      } else {
      //console.log(result);
      res.status(200).json({ message: 'Item added to cart successfully' });
      }
    })
});


router.post("/submitcart",requireLogin, async (req,res)=>{
  const cartId = await getInUseCartId(req)
  if (req.user.addCart.includes(cartId)){
    const cart = await Cart.findById(cartId);

    if (!cart) {
      return res.status(404).json({ err: 'Cart not found' });
    }

    console.log(cart);

    if (cart.itemPost === undefined || cart.itemPost.length === 0) {
     
      return res.status(400).json({ err: 'There is no item in this cart' });
    } else {
      cart.inUse = false;
      await cart.save(); // Save the changes to the cart
      return res.status(200).json({ message: 'Cart Submitted' });
    }
  }
})


router.post("/shipping",requireLogin,(req,res)=>{

  const {address,sector,city,phoneno  }=req.body
  if(!address ||!sector||!city||!phoneno){
      return res.status(422).json({error:"Please add all the fields"})
  }
     req.user.password=undefined
  const post=new Cart({
    address,
    sector,
    city,
    phoneno,
    postedBy:req.user
  })
  post.save().then(result=>{
      res.json({post:result})

  })
  .catch(err=>{
      console.log(err)
  })
})


router.post('/shippinginfo',(req,res)=>{
  const {address,sector,city,phoneno  }=req.body
  if(!address ||!sector||!city||!phoneno){
    return res.status(422).json({error:"Please add all the Credential"})
  }
  // req.user.password=undefined

      const cart=new Cart({
        address,
        sector,
        city,
        phoneno,
        // postedBy:req.user
       })
       cart.save()
       .then(cart=>{
            res.json({message:"saved successfully"})
       })
       .catch(err=>{
           console.log(err)
       })
})



  module.exports = router