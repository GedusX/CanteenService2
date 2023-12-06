import React,{useState, useEffect, useContext} from 'react'
import M from 'materialize-css'
// import {UserContext} from '../../App'
import './Cart.css'
import Popup from './Popup.js';
const Payment = () => {

    const [data,setData]=useState([])
    // const {state,dispatch}=useContext(UserContext)
    // const [cardno,setCardno] = useState("")
    // const [time,setTime] = useState("")
    // const [cv,setCv] = useState("")
    const [buttonPopup, setButtonPopup] = useState(false);
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
  const sum = data.map((order)=>order.amount*order.itemPost.body).reduce((prev, curr) => prev +  curr, 0)
  return (
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
                              <div class="cart_returnPrice">{item.itemPost.body*item.amount}</div>
                          </div>
                      )
                  })
                } 

              </div>
          </div>

          <div class="cart_right">
              <h1>Thông tin thẻ</h1>
              <div class="payment_method">
                      <label for = "name">Loại thẻ</label>
                      <div class="ppm">
                          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg" alt = "" />
                          <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt = "" />
                          <img src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" alt=""/>
                          <label>Thêm</label>
                      </div>
              </div>
              <div class="cart_form">

                  <div class="cart_group">
                      <label for="name">Tên chủ thẻ</label>
                      <input type="text" name="name" id="name" />
                  </div>

                  <div class="cart_group">
                      <label for="phone">Số thẻ</label>
                      <input type="text" name="phone" id="phone" />
                  </div>

                  <div class="cart_group">
                      <label for="address">Ngày hết hạn</label>
                      <input type="text" name="address" id="address" />
                  </div>
                  <div class="cart_group">
                      <label for="address">CVV</label>
                      <input type="text" name="address" id="address" />
                  </div>

              </div>
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
              <button class="cart_buttonCheckout" onClick={() => setButtonPopup(true)}>Thanh toán</button>
              <Popup trigger={buttonPopup} setTrigger={setButtonPopup}/>


        </div>
    </div>
    </div>
  )
}

export default Payment
