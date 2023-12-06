const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin  = require('../middleware/requireLogin')
// const cart  = require('../middleware/cart')
// const { default: Cart } = require('../../client/src/components/screens/Cart')
const Post =  mongoose.model("Post")
const User = mongoose.model("User")
const Cart = mongoose.model("Cart")
const CartItem = mongoose.model("CartItem")



router.get('/user/:id',requireLogin,(req,res)=>{
    User.findOne({_id:req.params.id})
    .select("-password")
    .then(user=>{
         Post.find({postedBy:req.params.id})
         .populate("postedBy","_id name")
         .exec((err,posts)=>{
             if(err){
                 return res.status(422).json({error:err})
             }
             res.json({user,posts})
         })
    }).catch(err=>{
        return res.status(404).json({error:"User not found"})
    })
})

router.put('/follow',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.followId,{
        $push:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
      User.findByIdAndUpdate(req.user._id,{
          $push:{following:req.body.followId}
          
      },{new:true}).select("-password").then(result=>{
          res.json(result)
      }).catch(err=>{
          return res.status(422).json({error:err})
      })

    }
    )
})
router.put('/unfollow',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
      User.findByIdAndUpdate(req.user._id,{
          $pull:{following:req.body.unfollowId}
          
      },{new:true}).select("-password").then(result=>{
          res.json(result)
      }).catch(err=>{
          return res.status(422).json({error:err})
      })

    }
    )
})


router.put('/updatepic',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{$set:{pic:req.body.pic}},{new:true},
        (err,result)=>{
         if(err){
             return res.status(422).json({error:"pic canot post"})
         }
         res.json(result)
    })
})



// router.post('/search-users',(req,res)=>{
//     let userPattern = new RegExp("^"+req.body.query)
//     User.find({email:{$regex:userPattern}})
//     .select("_id email")
//     .then(user=>{
//         res.json({user})
//     }).catch(err=>{
//         console.log(err)
//     })

// })

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
//     User.findByIdAndUpdate(req.body.userId,{
//     },{
//         new:true
//     }).exec((err,result)=>{
//         if(err){
//             return res.status(422).json('not working')
//         }else{
//             //  
//             console.log('result')
//         }
//     })
//   })
router.put('/removeCart',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.userId,{
        $pull:{addCart:req.post._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            //  
            console.log(result)
        }
    })
  })



module.exports = router