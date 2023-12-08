
import './changePassword.css'
import React,{useState,useContext} from 'react'

import M from 'materialize-css'
// import {useNavigate} from 'react-router-dom'
// import { UserContext } from '../../App'

const ChangePassword=() => {

    const [oldPassword,setOldPassword]  = useState("")
    const [newPassword,setNewPassword]  = useState("")
    const [confirmPassword,setConfirmPassword]  = useState("")

    const changeNewPassword = () => {
        if(newPassword != confirmPassword){
            M.toast({html: "Mật khẩu mới không trùng với xác nhận mật khẩu mới", classes:"#d32f2f red darken-2"})
            return
           } 
        fetch("/changepass",{
            method:"put",
            headers:{
              "Content-Type":"application/json",
              "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
              oldPassword,
              newPassword,
            })
          })
          .then(res=>res.json())
          .then(result=>{
            if(result.error){
                M.toast({html: "Thay đổi mật khẩu thất bại", classes:"#d32f2f red darken-2"})
            }else if (result.message) {
                M.toast({html: "Thay đổi mật khẩu thành công", classes: "#43a047 green darken-1"});
                //setButtonPopup(true);
              }
          })
        //   .catch((err) => {
        //     console.error("Error:", err);
        //   });
    }

    const [buttonPopup, setButtonPopup] = useState(false);

    return (
       <div className="changepass_container">
       <div className="changepass_Layout">
           <div className="changepass_right">
               <h1>Thay đổi mật khẩu</h1>
               <div className="changepass_form">
 
                   <div className="changepass_group">
                       <label for="password">Mật khẩu hiện tại</label>
                       <input type="password" placeholder="Your Password"  onBlur={(e) => setOldPassword(e.target.value)}/>
                   </div>
                   <div className="changepass_group">
                       <label for="password">Mật khẩu mới</label>
                       <input type="password" placeholder="New Password" onBlur={(e) => setNewPassword(e.target.value)}/>
                   </div>
                   <div className="changepass_group">
                       <label for="password">Xác nhận mật khẩu mới</label>
                       <input type="password" placeholder="Confirm Password" onBlur={(e) => setConfirmPassword(e.target.value)}/>
                   </div>
                   <button
                      onClick={() => changeNewPassword()}
                      className="changepass_button"
                    >
                      Đổi mật khẩu
                    </button>
                   
               </div>
               
         </div>
       
       </div>
 
     </div>
     
    )
}

export default ChangePassword
