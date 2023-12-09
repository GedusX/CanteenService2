const mongoose = require('mongoose')
module.exports = (req,next)=>{
    const {cart} = req.headers
    // const token = authorization.replace("Bearer ","")
    const carts=((payload)=>{
       
        const {_id} = payload
        Food.findById(_id).then(fooddata=>{
            req.user = fooddata
            next()
        })
        
        
    })
}