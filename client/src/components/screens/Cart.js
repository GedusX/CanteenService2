import React from 'react'
import {useState,useEffect,useContext}from 'react'
import {UserContext} from '../../App'
import {Link} from 'react-router-dom'
import './Cart.css'
import Popup from './Popup.js';

import M from 'materialize-css'
import Popforcart from './Popforcart.js'

const Cart = () => {
     const [data,setData]=useState([])
     const {state,dispatch}=useContext(UserContext)
     useEffect(()=>{
        fetch('/mycart',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            setData(result.result)
        })
     },[])
     const addToCart = (id,amt)=>{
        fetch('/addToCart',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                postId:id,
                amount:amt
            })
        }).then(res=>res.json())
        .then(result=>{
          M.toast({html: result.message, classes:"#43a047 green darken-1"})
        }).catch(err=>{
          console.log(err)
      })
      }
     const unlikePost = (id)=>{
        fetch('/unlike',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                foodId:id
            })
        }).then(res=>res.json())
        .then(result=>{
          //   console.log(result)
          const newData = (data=>{
              if(data._id==result._id){
                  return result
              }else{
                  return data
                  
              }
          })
          setData(newData)
          console.log(data)
          M.toast({html: "Remove from Cart", className:"#43a047 green darken-1"})
        }).catch(err=>{
          console.log(err)
      })
  }
    const submitCart = () => {
            fetch('/submitcart',{
                method:"post",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
            }).then(res=>res.json())
            .then(result=>{
            console.log(result)
                M.toast({html: result.message, classes:"#43a047 green darken-1"})
            }).catch(err=>{
                console.log(err)
                M.toast({html: err, className:"#43a047 green darken-1"})
        })
    }
  const [buttonPopup, setButtonPopup] = useState(false);
  const [total, settotal] = useState(0);
  const sum = data.map((order)=>order.amount*order.itemPost?.body).reduce((prev, curr) => prev +  curr, 0)

  return (
//     <>
//       <div className="small-container cart-page">
//            <table>
//                <tr>
//                    <th>Product</th>
//                    <th>Quantity</th>
//                    <th>Subtotal</th>
//                </tr>
               
               
//                  {
//                      data.map(item=>{
//                         return(<tr >
//                    <td >
//                         <div className="cart-info" key={item._id}>
//                            <img src={item.photo} alt=""/>
//                        <div>
//                            <p>{item.title}</p>
//                            <small>&#8377;{item.body}</small><br/>
//                            <a href="" onClick={()=>{unlikePost(data._id)}}>Remove</a>
//                        </div>
//                         </div>
                       
                       
//                    </td>
//                    <td><input type="number" defaultValue="1"/></td>
//                    <td>&#8377;{item.body}</td></tr>
//                     )
//                 })
//                } 
                   
             
//           </table>
 
          
           
//           <div className="total-price">
//      <table >
//                    <tr>
//                        <td>Subtotal</td>
//                        <td> 
//                        {`₹${data.reduce(
//                   (acc, item) => acc + parseInt(item.body) ,
//                   0
//                 )}`}</td>
//                    </tr>
//                    <tr>
//                     <td>Tax</td>
//                     <td>&#8377;30.00 </td>
//                 </tr>
//                 <tr>
//                     <td>Total</td>
//                     <td>{`₹${data.reduce(
//                   (acc, item) => acc + parseInt(item.body)+30 ,
//                   0
//                 )}`} </td>
//                 </tr>
//                </table>
              
//            </div>
           
           
//            <button className="btn waves-effect #e65100 orange darken-4 btn-large" type="submit" name="action" 
//           onClick={()=>{
//             M.toast({html: 'Order Placed , Cash on Delivery'})
//           }}>
//           {/* onClick={M.toast({html: 'Order Placed , Cash on Delivery'})} */}
           
//            Check Out    </button>
          
//   {/* <main> 
//            <button  className="btn waves-effect #e65100 orange darken-4 btn-large" type="submit" name="action"  >
//            Check Out    </button> </main>
           
 
//        */}
           
//       </div> 

    
//     </>
    <div class="cart_container">
    <div class="cart_checkoutLayout">
        
        <div class="cart_returnCart">
            <a href="/" > Tiếp tục mua sắm</a>
            <h1>Giỏ hàng</h1>
            <div class="cart_list">
                {
                    data.map(item=>{
                        return(
                        <div class="cart_item">
                            <img src={item.itemPost?.photo} alt = "" />
                            <div class="cart_info">
                                <div class="cart_name">{item.itemPost?.title}</div>
                                <div class="cart_price">{item.itemPost?.body}</div>
                            </div>
                            
                            <input class="cart_quantity" placeholder={item.amount}
                                type="number"
                                onBlur={(e)=>addToCart(item.itemPost?._id,e.target.value)}
                            >

                            </input>
                            
                            
                            <div class="cart_returnPrice">{item.amount* item.itemPost?.body}</div>
                        </div>
                    )
                    })

               } 

            </div>
        </div>

        <div class="cart_right_forcart">
            

            <div class="cart_return">
                <div class="cart_row">
                    <div>Tổng tiền</div>
                    <div class="cart_totalPrice">{sum} VND</div>
                </div>
                <div class="cart_row">
                    <div>Phí vận chuyển</div>
                    <div class="cart_transportation">0 VND</div>
                </div>
                <div class="cart_row">
                    <div>Tổng cộng</div>
                    <div class="cart_totalPrice">{sum} VND</div>
                </div>
            </div>
            {sum>0?(
            <a href = "./Payment">
                <button class="cart_buttonCheckout">THANH TOÁN</button>
            </a>):undefined}


        </div>
    </div>
    </div>
  )
}

export default Cart
