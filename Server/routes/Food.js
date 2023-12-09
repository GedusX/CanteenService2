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
            foodObject.numLike = food.likes.length;
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
router.post('/createfood',requireLogin,(req,res)=>{
    const {title,price,pic} = req.body 
    if(!title || !price || !pic){
      return  res.status(422).json({error:"Plase add all the fields"})
    }
    req.user.password = undefined
    const post = new Food({
        title,
        price,
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
router.get("/myfood",requireLogin,(req,res)=>{
    Food.find({likes:req.user._id})
    .populate("BelongTo","_id name")
    .populate("comments.postedBy","_id name")
    
    .then(myfood=>{
        res.json({myfood})
        console.log({myfood})
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
            console.log(result)
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
        //console.log(foodinfo)
        res.json({foodinfo})
    })
    .catch(err=>{
        return res.status(404).json({error:"User not found"})
    })
})




//Court Owner
router.delete('/deletefood/:foodId',requireLogin,(req,res)=>{
    Food.findOne({_id:req.params.foodId})
    .populate("belongTo","_id")
    .exec((err,food)=>{
        if(err || !food){
            return res.status(422).json({error:err})
        }
        if(food.belongTo._id.toString() === req.user._id.toString()){
                food.remove()
              .then(result=>{
                  res.json(result)
              }).catch(err=>{
                  console.log(err)
              })
        }
    })
})

module.exports =router