import React from "react";
import './Signinpart.css'

const Recovered=(props) => {
  return (props.trigger) ? (
    <div className="cart_popup">
    <img src = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Flat_tick_icon.svg/2048px-Flat_tick_icon.svg.png" alt = ""/>
    <h2>Đổi mật khẩu thành công!</h2>
    <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
    <a href = "./SignIn">
    <button type = "button" className = "cart_ok" onClick={()=> props.setTrigger(false)}>
      OK
    </button>{props.children}
    </a>
    </div>

  ) : "";
}
export default Recovered