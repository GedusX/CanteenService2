
import Recover from './Recover.js'
import './Signinpart.css'
import React,{useState,useContext} from 'react'

import M from 'materialize-css'
// import {useNavigate} from 'react-router-dom'
// import { UserContext } from '../../App'

const Forgotpass=() => {

    const [password,setPassword]  = useState("")
    const [confirmPassword,setConfirmPassword]  = useState("")
    const [email,setEmail] = useState("")
    const ForgetPassword = () => {
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "Invalid Email", classes:"#d32f2f red darken-2"})
            return
           }
        if(confirmPassword != password){
            M.toast({html: "Mật khẩu không trùng khớp", classes:"#d32f2f red darken-2"})
            return
           } 
        fetch("/forgetpass",{
            method:"put",
            headers:{
              "Content-Type":"application/json"
            },
            body:JSON.stringify({
              password,
              email,
            })
          })
          .then(res=>res.json())
          .then(data=>{
            console.log(data)
            if(data.error){
                M.toast({html: data.error, classes:"#d32f2f red darken-2"})
            }else if (data.message) {
                M.toast({ html: data.message, classes: "#43a047 green darken-1" });
                setButtonPopup(true);
              }
          })
        //   .catch((err) => {
        //     console.error("Error:", err);
        //   });
    }

    const [buttonPopup, setButtonPopup] = useState(false);

    return (
       <div className="forgotpass_container">
       <div className="forgotpass_checkoutLayout">
           <div className="forgotpass_right">
               <h1>Quên mật khẩu</h1>
               <div className="forgotpass_form">
 
                   <div className="forgotpass_group">
                       <label for="email">Email</label>
                       <input type="text" placeholder="Email" onBlur={(e) => setEmail(e.target.value)}/>
                   </div>
 
                   <div className="forgotpass_group">
                       <label for="password">Mật khẩu</label>
                       <input type="password" placeholder="Password"  onBlur={(e) => setPassword(e.target.value)}/>
                   </div>
                   <div className="forgotpass_group">
                       <label for="password">Nhập lại mật khẩu</label>
                       <input type="password" placeholder="Password" onBlur={(e) => setConfirmPassword(e.target.value)}/>
                   </div>
                   <button
                      onClick={() => ForgetPassword()}
                      className="forgotpass_button"
                    >
                      Đổi mật khẩu
                    </button>
                    <Recover trigger={buttonPopup} setTrigger={setButtonPopup}/>
                    <a href='./SignIn'>
                      <p style = {{color:'blue', textAlign:'center'}}>Quay lại đăng nhập</p>
                    </a>
               </div>
         </div>
       
       </div>
 
     </div>
    )
}

export default Forgotpass