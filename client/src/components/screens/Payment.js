import React,{useState, useEffect, useContext} from 'react'
import M from 'materialize-css'

// import {UserContext} from '../../App'
import './Cart.css'
import Popup from './Popup.js';
import NumberInputBasic from './NIB.js';
const Payment = () => {

    const [data,setData]=useState([])
    // const {state,dispatch}=useContext(UserContext)
    // const [cardno,setCardno] = useState("")
    // const [time,setTime] = useState("")
    // const [cv,setCv] = useState("")
    const [buttonPopup, setButtonPopup] = useState(false);
    const [payMode, setPayMode] = useState(0)
    const [getMode, setGetMode] = useState(0)
    const [table, setTable] = useState(1)
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
   
   const TablePanel = () =>{
    <div className="cart_popup">
            <img src = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Flat_tick_icon.svg/2048px-Flat_tick_icon.svg.png" alt = ""/>
            <h2>Thành công!</h2>
            <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
        </div>
   }
   const TogglePaymode = (mode) =>{
    setPayMode(mode)
   }
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
        <div className='overlay'></div>
      <div class="cart_checkoutLayout">
          
          <div class="cart_returnCart">
              <a href="/" > Quay Lại</a>
              <h1>XÁC NHẬN THANH TOÁN</h1>
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
          <center>
          <h1>Hình thức thanh toán</h1>
          <button className={payMode<3?"option_buttonCheckoutdark":"option_buttonCheckout"} disabled = {payMode<3} onClick={()=>TogglePaymode(0)}>Thanh toán không tiền mặt</button>
          <button className={payMode===4?"option_buttonCheckoutdark":"option_buttonCheckout"} disabled = {payMode===4} onClick={()=>TogglePaymode(4)}>Thanh toán tiền mặt</button>
          </center>
          {payMode<3?(<>
              <div class="payment_method">
                      <label for = "name">Loại thẻ</label>
                      
                      <div class="ppm">
                          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg" alt = "" className= {payMode===0?"black":""} disabled = {payMode===0} onClick={()=>TogglePaymode(0)}/>
                          <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt = "" className= {payMode===1?"black":""} disabled = {payMode===1} onClick={()=>TogglePaymode(1)}/>
                          <img src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" alt="" className= {payMode===2?"black":""} disabled = {payMode===2} onClick={()=>TogglePaymode(2)}/>
                          <label> Coming Soon</label>
                      </div>
              </div>
              {payMode<2?(<><div class="cart_form">

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

</div></>):null}
              </>):null}
            <div>
                {payMode<3?(<><center>
                <button className={getMode===0?"option_buttonCheckoutdark":"option_buttonCheckout"} disabled = {getMode===0} onClick={()=>setGetMode(0)}>Nhận tại bàn</button>
                <button className={getMode===1?"option_buttonCheckoutdark":"option_buttonCheckout"} disabled = {getMode===1} onClick={()=>setGetMode(1)}>Nhận tại quầy</button>

                </center></>):null}
                {getMode===0?(<>
                <div className='table_input'><NumberInputBasic
                        class = "table_input"
                        placeholder="Type a number…"
                        min = {1}
                        max = {50}
                        onChange={(event, val) => setTable(val)}/>
                        </div>

                </>):(<>
                    <h5> Nhận tại quầy: Đến từng quầy hàng và nhận món</h5>
                    </>)}
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
