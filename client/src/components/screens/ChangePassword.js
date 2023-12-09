
import './ChangePassword.css'
import React,{useState,useContext} from 'react'
import {UserContext} from '../../App'
import M from 'materialize-css'

const ChangePassword=() => {
    const {state,dispatch} = useContext(UserContext)
    const [oldPassword,setOldPassword]  = useState("")
    const [newPassword,setNewPassword]  = useState("")
    const [confirmPassword,setConfirmPassword]  = useState("")

    const changeNewPassword = async (e) => {
        try {
            let returnedData;
            const response = await fetch('/verify-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: state.email,
                    password: oldPassword,
                }),
            });
            const data = await response.json();
            returnedData = data.isValidPassword;
            console.log(returnedData);
            if (returnedData === 0) {
                M.toast({html: "SAI MẬT KHẨU HIỆN TẠI", classes:"#d32f2f red darken-2"});
                return;
            }
            if (newPassword !== confirmPassword) {
                M.toast({html: "XÁC NHẬN MẬT KHẨU MỚI SAI", classes:"#d32f2f red darken-2"});
                return;
            }
            if (oldPassword === newPassword) {
                M.toast({html: "MẬT KHẨU HIỆN TẠI TRÙNG VỚI MẬT KHẨU MỚI", classes:"#d32f2f red darken-2"});
                return;
            }
            try{
              const changePassResponse = await fetch('/changepass', {
                  method: "put",
                  headers: {
                      "Content-Type": "application/json",
                      "Authorization": "Bearer " + localStorage.getItem("jwt")
                  },
                  body: JSON.stringify({
                      password: newPassword
                  })
              });
              M.toast({html: "ĐỔI MẬT KHẨU THÀNH CÔNG", classes:"#43a047 green darken-1"});
            }catch (error){
              M.toast({html: "XẢY RA LỖI", classes:"#d32f2f red darken-2"});
            }
          } catch (error) {
            M.toast({html: "XẢY RA LỖI", classes:"#d32f2f red darken-2"});
          }
    }
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
