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
        })
        .then(res=>res.json())
        .then(result=>{
            console.log(result)
            setData(result.result)
        })
     },[])

     const unlikePost = (id)=>{
        fetch('/unlike',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
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
  const [buttonPopup, setButtonPopup] = useState(false);
     

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
                            <img src={item.itemPost.photo} alt = "" />
                            
                            <div class="cart_info">
                                <div class="cart_name">{item.itemPost.title}</div>
                                <div class="cart_price">{item.itemPost.body}</div>
                            </div>
                            <div class="cart_quantity">{item.amount}</div>
                            <div class="cart_returnPrice">$433.3</div>
                        </div>
                    )
                })
               } 

            </div>
        </div>

        <div class="cart_right">
            <a href = "./Payment">
                <button class="cart_buttonCheckout">Thanh toán bằng thẻ ngân hàng</button>
            </a>
            <div class="cart_return">
                <div class="cart_row">
                    <div>Tổng tiền</div>
                    <div class="cart_totalPrice">110000 VND</div>
                </div>
                <div class="cart_row">
                    <div>Phí vận chuyển</div>
                    <div class="cart_transportation">0 VND</div>
                </div>
                <div class="cart_row">
                    <div>Tổng cộng</div>
                    <div class="cart_totalPrice">110000 VND</div>
                </div>
            </div>
            <button class="cart_buttonCheckout" onClick={() => setButtonPopup(true)}>Thanh toán bằng tiền mặt</button>
            <Popforcart trigger={buttonPopup} setTrigger={setButtonPopup}/>


        </div>
    </div>
    </div>
  )
}

export default Cart
