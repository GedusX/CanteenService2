import React from 'react'
import './Cart.css'
const Popup=(props) => {
    return (props.trigger) ? (
        <div className="cart_popup">
            <img src = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Flat_tick_icon.svg/2048px-Flat_tick_icon.svg.png" alt = ""/>
            <h2>Thành công!</h2>
            <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
            <button type = "button" className = "cart_ok" onClick={()=> props.setTrigger(false)}>OK</button>{props.children}
        </div>
    ) : "" ; 
}

export default Popup