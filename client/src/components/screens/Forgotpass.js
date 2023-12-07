
import Recover from './Recover.js'
import './Signinpart.css'
import React,{useState,useContext} from 'react'

// import M from 'materialize-css'
// import {useNavigate} from 'react-router-dom'
// import { UserContext } from '../../App'

const Forgotpass=() => {

    const [buttonPopup, setButtonPopup] = useState(false);
    return (
       <div class="forgotpass_container">
       <div class="forgotpass_checkoutLayout">
           <div class="forgotpass_right">
               <h1>Quên mật khẩu</h1>
               <div class="forgotpass_form">
 
                   <div class="forgotpass_group">
                       <label for="email">Email</label>
                       <input type="text" placeholder="email"/>
                   </div>
 
                   <div class="forgotpass_group">
                       <label for="password">Mật khẩu</label>
                       <input type="password" placeholder="password"/>
                   </div>
                   <div class="forgotpass_group">
                       <label for="password">Nhập lại mật khẩu</label>
                       <input type="password" placeholder="password"/>
                   </div>
                   <button
                      onClick={() => setButtonPopup(true)}
                      class="forgotpass_button"
                    >
                      Đổi mật khẩu
                    </button>
                    <Recover trigger={buttonPopup} setTrigger={setButtonPopup}/>
                        

                  
 
               </div>
         </div>
       
       </div>
 
     </div>
    )
}

export default Forgotpass