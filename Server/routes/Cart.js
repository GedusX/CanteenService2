const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin  = require('../middleware/requireLogin')
const Cart = mongoose.model("Cart")
const CartItem = mongoose.model("CartItem")

function getInUseCartId(req){


}
function getAllCartId(req){


}
 

router.get('/mycart',requireLogin,(req,res)=>{
  var cart_id = req.user.addCart  
  console.log(10) 
  if (cart_id.length === 0){
      const newCart = new Cart({
          inUse:true,
      });
      newCart.save((err, savedCart) => {
          if (err) {
            return res.status(500).json({ error: err });
          }
          User.findByIdAndUpdate(
          req.user._id,
          {
              $push: { addCart: savedCart._id },
          },
          {
              new: true
          },
          (err, updatedUser) => {
              if (err) {
              return res.status(500).json({ error: err });
              }
              cart_id = savedCart._id;
          }
          );
      });
  }

  CartItem.find({cartBy:cart_id[0]})
  .populate('itemPost')
  .then(result=>{
    console.log(result)
    res.json({result})
  })
  .catch(err=>{
    console.log(err)
  })

})


router.put('/addToCart',requireLogin,(req,res)=>{
  var cart_id = req.user.addCart   
  if (cart_id.length === 0){
      const newCart = new Cart({
          inUse:true,
      });
      newCart.save((err, savedCart) => {
          if (err) {
            return res.status(500).json({ error: err });
          }
          User.findByIdAndUpdate(
          req.user._id,
          {
              $push: { addCart: savedCart._id },
          },
          {
              new: true
          },
          (err, updatedUser) => {
              if (err) {
              return res.status(500).json({ error: err });
              }
              cart_id = savedCart._id;
          }
          );
      });
  }
  CartItem.countDocuments({ itemPost: req.body.postId, cartBy: cart_id[0]})
  .then(count => {
      if (count > 0) {
        // Item already exists in the cart
        return CartItem.findOne({ itemPost: req.body.postId, cartBy: cart_id[0] });
      } else {
        // Item doesn't exist, create a new CartItem
        if (req.body.amount!=0){
          const newItem = new CartItem({
              itemPost: req.body.postId,
              amount: req.body.amount ? req.body.amount : 1,
              cartBy: cart_id[0],
          });
          return newItem.save()
              .then(savedItem => {
              // Update the Cart with the new item
              return Cart.findByIdAndUpdate(
                  cart_id[0],
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
          if (req.body.amount == 0){
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
      } else if (req.body.amount == 0) {
          res.status(200).json({ message: 'The amount can not be 0'}); 
      } else {
      console.log(result);
      res.status(200).json({ message: 'Item added to cart successfully' });
      }
    })
});

  




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


// router.post('/createpost',requireLogin,(req,res)=>{
//     const {title,body,pic} = req.body 
//     if(!title || !body || !pic){
//       return  res.status(422).json({error:"Plase add all the fields"})
//     }
//     req.user.password = undefined
//     const post = new Post({
//         title,
//         body,
//         photo:pic,
//         postedBy:req.user
//     })
//     post.save().then(result=>{
//         res.json({post:result})
//     })
//     .catch(err=>{
//         console.log(err)
//     })
// })

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