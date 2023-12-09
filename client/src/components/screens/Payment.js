import React,{useState, useEffect} from 'react'
import M from 'materialize-css'

// import {UserContext} from '../../App'
import './Cart.css'
import Popup from './Popup.js';
import NumberInputBasic from './NIB.js';

import Button from '@mui/material/Button';


const Payment = () => {

    const [data,setData]=useState([])
    const [buttonPopup, setButtonPopup] = useState(false);
    const [panelPopup, setPanelPopup] = useState(false);
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
   
   const TablePanel = (props) =>{
    const buttons = Array.from({ length: 40 }, (_, i) => i + 1);
    return (props.trigger)?(<div className="table_panel">
            <h2>Vui lòng chọn bàn!</h2>
            <div className = "table_grid"> {buttons.map((button, index) => (
        <Button variant="contained" size = "medium" key={index} onClick={() => {setTable(index); props.setTrigger(false)}}>{index}</Button>
      ))}</div>
           
        </div>):""
   }
   const TogglePaymode = (mode) =>{
    setPayMode(mode)
   }

  const initialvalues = {name:"", cardno:"",expdate:"",cvv:""}
  const [formValues, setFormValues] = useState(initialvalues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const handleChange = (e) =>{
  	const{ name, value} = e.target;
		setFormValues({...formValues, [name]:value});
		//console.log(formValues);
  }

  const handleSubmit = (e) =>{
    e.preventDefault();
    setFormErrors(validate(formValues));
    setIsSubmit(true);
  }
	const validate = (values) =>{
		const errors = {}    
		if(!values.name){
				errors.name = "Nhập tên chủ thẻ!";
		}

		if(!values.cardno){
			errors.cardno = "Vui lòng nhập số thẻ";
		} else if (!/^\d+$/.test(values.cardno)){
			errors.cardno = "Số thẻ không đúng định dạng";
		} else if (values.cardno.length < 8 || values.cardno.length > 15 ){
			errors.cardno = "Số thẻ phải nằm trong khoảng 8-15 chữ số";
		}
		
		if(!values.expdate){
			errors.expdate = "Vui lòng cung cấp thông tin";
		} else if (!/^(\d{2})-(\d{2})-(\d{4})$/.test(values.expdate)){
			errors.expdate = "Ngày phải đúng định dạng dd-mm-yyyy";
		}

		if(!values.cvv){
			errors.cvv = "Vui lòng cung cấp thông tin";
		} else if (!/^\d+$/.test(values.cvv)){
			errors.cvv = "Số CVV không đúng định dạng";
		} else if (values.cvv.length !== 3 ){
			errors.cvv = "Số CVV không đúng định dạng";
		}
		return errors;
}

  useEffect(()=>{
    if (Object.keys(formErrors).length === 0 && isSubmit) {
			setButtonPopup(true)
    } else {
			setIsSubmit(false);
		}
  },[formErrors,isSubmit]) 

  const sum = data.map((order)=>order.amount*order.itemPost.body).reduce((prev, curr) => prev +  curr, 0)
  return (
    
    <div class="cart_container">
    <TablePanel trigger={panelPopup} setTrigger={setPanelPopup}/>

      <div class="cart_checkoutLayout">
          
          <div class="cart_returnCart">
              <a href="./Cart" > Quay Lại</a>
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
          <form onSubmit={handleSubmit}>
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
    <input type="text"
					 name="name"
					id="name" 
					value={formValues.name}
					onChange={handleChange}
					/>
		{formErrors.name?<p  style={{marginLeft:"20px",
																 marginTop:"0px",
																 color:"#ff4545"}}
																 > *{formErrors.name}</p>:null}
</div>

<div class="cart_group">
    <label for="cardno">Số thẻ</label>
    <input type="text" 
						name="cardno" 
						id="cardno" 
						value={formValues.cardno}
						onChange={handleChange}
						/>
						{formErrors.cardno?<p  style={{marginLeft:"10px", 
																		marginTop:"0px",
																		color:"#ff4545"}}
																		> *{formErrors.cardno}</p>:null}
</div>

<div class="cart_group">
    <label for="expdate">Ngày hết hạn</label>
    <input type="text" 
					name="expdate" 
					id="expdate" 
					value={formValues.expdate}
					onChange={handleChange}
					/>
		{formErrors.expdate?<p style={{marginLeft:"10px", 
																	marginTop:"0px",
																	color:"#ff4545"}}
																	> *{formErrors.expdate}</p>:null}
</div>
<div class="cart_group">
    <label for="cvv">CVV</label>
    <input type="text"
					name="cvv" 
					id="cvv" 
					value={formValues.cvv}
					onChange={handleChange}
					 />
		{formErrors.cvv?<p style={{marginLeft:"10px", 
															marginTop:"0px",
															color:"#ff4545"}}
															> *{formErrors.cvv}</p>:null}
</div>

</div></>):null}
              </>):null}
            <div>
                {payMode<3?(<><center>
                <button className={getMode===0?"option_buttonCheckoutdark":"option_buttonCheckout"} disabled = {getMode===0} onClick={()=>setGetMode(0)}>Nhận tại bàn</button>
                <button className={getMode===1?"option_buttonCheckoutdark":"option_buttonCheckout"} disabled = {getMode===1} onClick={()=>setGetMode(1)}>Nhận tại quầy</button>

                </center></>):null}
                {getMode===0?(<>
                <center>
                    <div className='normal_text'> Nhận món ở</div>
                    <Button variant="contained" size = "medium" onClick={() => {setPanelPopup(true)}}>{table}</Button>
                </center>

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
              <button class="cart_buttonCheckout"  type="submit">Thanh toán</button>
              <Popup trigger={buttonPopup} setTrigger={setButtonPopup}/>

          </div>
          </form>
    </div>
    </div>

  )
}

export default Payment
