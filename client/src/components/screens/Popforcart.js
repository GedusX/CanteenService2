import React from 'react'
import './Cart.css'
const Popforcart=(props) => {
    return (props.trigger) ? (
        <div className="cart_popup">
            <h2>Vui lòng đến quầy để thanh toán đơn hàng</h2>
            <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
            <button type = "button" className = "cart_ok" onClick={()=> props.setTrigger(false)}>OK</button>{props.children}
        </div>
    ) : "" ; 
}

export default Popforcart