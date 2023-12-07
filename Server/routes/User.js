const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin  = require('../middleware/requireLogin')
// const cart  = require('../middleware/cart')
// const { default: Cart } = require('../../client/src/components/screens/Cart')
const bcrypt=require("bcryptjs")
const Post =  mongoose.model("Post")
const User = mongoose.model("User")



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
router.put('/forgetpass',(req,res) => {
    const { email, password } = req.body;
    // Hash the new password before updating
    bcrypt.hash(password, 12, (hashErr, hash) => {
        if (hashErr) {
            console.log(hashErr);
            return res.status(500).json({ error: 'Password hashing failed' });
        }
        User.findOneAndUpdate(
            { email: email },
            { $set: { password: hash } },
            { new: true } // to return the updated document
        )
        .then(updatedUser => {
            if (!updatedUser) {
                return res.status(404).json({ error: 'User not found' });
            }
            console.log(`Password updated for ${email}`);
            res.status(204).json({ message: 'Resource updated successfully' });
        })
        .catch(updateErr => {
            console.log(updateErr);
            res.status(500).json({ error: 'Update failed' });
        });
    });
});


router.put('/changepass',requireLogin,(req,res) => {
    const {password} = req.body;
    // Hash the new password before updating
    bcrypt.hash(password, 12, (hashErr, hash) => {
        if (hashErr) {
            console.log(hashErr);
            return res.status(500).json({ error: 'Password hashing failed' });
        }
        User.findByIdAndUpdate (req.user._id,
            { $set: { password: hash } },
            { new: true } // to return the updated document
        )
        .then(updatedUser => {
            if (!updatedUser) {
                return res.status(404).json({ error: 'User not found' });
            }
            console.log(`Password updated for user ${req.user._id}`);
            res.status(204).json({ message: 'Resource updated successfully' });
        })
        .catch(updateErr => {
            console.log(updateErr);
            res.status(500).json({ error: 'Update failed' });
        });
    });
});



router.put('/changeinfo',requireLogin,(req,res) => {
    console.log(req.body)
    const {name,email,phoneno} = req.body;
    const updateObject = {};
    if (email !== null) {
        updateObject.email = email;
    }
    if (name !== null) {
        updateObject.name = name;
    }
    if (phoneno !== null) {
        updateObject.phoneno = phoneno;
    }
    User.findByIdAndUpdate(req.user._id,
        { $set: updateObject},
        { new: true } // to return the updated document
    )
    .then(updatedUser => {
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        console.log(`Change infomation for ${req.user._id}`);
        console.log(updatedUser)
        const {_id,name,email,followers,following,pic,phoneno} = updatedUser
        res.json({user:{_id,name,email,followers,following,pic,phoneno}})
    })
    .catch(updateErr => {
        console.log(updateErr);
        res.status(500).json({ error: 'Update failed' });
    });
});


module.exports = router