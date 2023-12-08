const express =require('express')
const router =express.Router()
const mongoose=require('mongoose')
const requireLogin=require("../middleware/requireLogin")
const Food = mongoose.model("Food")

router.get("/allfood",requireLogin,(req,res)=>{
    Food.find()
    .populate("belongTo","_id name")
    //.populate("comments.postedBy","_id name")
    .then(foods=>{
        const foodsWithIsLike = foods.map(food => {
            const foodObject = food.toObject(); // Convert to plain JavaScript object
            foodObject.isLike = food.likes.includes(req.user._id); // Add isLike field
            return foodObject;
        });
        //console.log(postsWithIsLike)
        res.json({ foods: foodsWithIsLike });
    })
    .catch(err=>{
        console.log(err)
    })
})

//CourtOwner
router.get("/getsubpost",requireLogin,(req,res)=>{
    Post.find({postedBy:{$in:req.user.following}})
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})

//CourtOwner
router.post('/createpost',requireLogin,(req,res)=>{
    const {title,body,pic} = req.body 
    if(!title || !body || !pic){
      return  res.status(422).json({error:"Plase add all the fields"})
    }
    req.user.password = undefined
    const post = new Post({
        title,
        body,
        photo:pic,
        postedBy:req.user
    })
    post.save().then(result=>{
        res.json({post:result})
    })
    .catch(err=>{
        console.log(err)
    })
})

//CourtOwner
router.get("/mypost",requireLogin,(req,res)=>{
    Post.find({likes:req.user._id})
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    
    .then(mypost=>{
        res.json({mypost})
        console.log({mypost})
    })
    .catch(err=>{
        console.log(err)
    })
})



router.put('/like',requireLogin,(req,res)=>{
    Food.findByIdAndUpdate(req.body.foodId,{
        $push:{likes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})
router.put('/unlike',requireLogin,(req,res)=>{
    Food.findByIdAndUpdate(req.body.foodId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})
router.put('/comment',requireLogin,(req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    }
    Food.findByIdAndUpdate(req.body.foodId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name")
    .populate("belongTo","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.post('/search-foods',(req,res)=>{
    let userPattern = new RegExp("^"+req.body.query)
    Food.find({title:{$regex:userPattern}})
    .select("_id title body photo comments")
    .then(user=>{
        res.json({user})
    }).catch(err=>{
        console.log(err)
    })

})

router.get('/products/:id',requireLogin,(req,res)=>{
    Food.findOne({_id:req.params.id})
    .populate("belongTo","_id name")
    .populate("comments.postedBy","name pic")
    .then(foodinfo=>{
        console.log(foodinfo)
        res.json({foodinfo})
    })
    .catch(err=>{
        return res.status(404).json({error:"User not found"})
    })
})




//Court Owner
router.delete('/deletepost/:postId',requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
              post.remove()
              .then(result=>{
                  res.json(result)
              }).catch(err=>{
                  console.log(err)
              })
        }
    })
})

module.exports =router