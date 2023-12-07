import React,{useState,useContext} from 'react'
import {Link } from 'react-router-dom'
import './Signinpart.css'
import M from 'materialize-css'
import {useNavigate} from 'react-router-dom'
import { UserContext } from '../../App'
import forlogin from '../Image/forlogin.png'
const SignIn=()=>  {
  const {state,dispatch}=useContext(UserContext)
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  let navigate =useNavigate();

  const PostData =()=>{
  if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
    M.toast({html: "Invalid Email", classes:"#d32f2f red darken-2"})
    return
  }  
  fetch("http://localhost:3000/signin",{
    method:"post",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({
     
      password,
      email
    })
  }).then(res=>res.json())
  .then(data=>{
    console.log(data)
   if(data.error){
    M.toast({html: data.error, classes:"#d32f2f red darken-2"})
    }else{
      localStorage.setItem("jwt",data.token)
      localStorage.setItem("user",JSON.stringify(data.user))
      dispatch({type:"USER",payload:data.user})
      M.toast({html: "Signed In success", classes:"#43a047 green darken-1"})
    navigate("/");
  }
  })
  .catch(err=>{
    console.log(err) 
  })
  }

  return (
    // <div class = "card_contain">
    //   <div class ="card_signin">
    //     <div class ="card_siginform">
    //         <h2>Nothing</h2>
    //         <input type="text" placeholder="email" 
    //         value={email}
    //         onChange={(e)=>setEmail(e.target.value)}/>

    //         <input type="password" placeholder="password"
    //         value={password}
    //         onChange={(e)=>setPassword(e.target.value)} />
    //         <button class="button_signin"
    //         onClick={()=>PostData()}
    //         >Đăng nhập
    //         </button>
    //         <h5><Link to="/inputemail">Quên mật khẩu</Link></h5>
    //         <h5><Link to="/signup">Không có tài khoản?</Link></h5>
    //     </div>
    //     <div class = "card_right">
    //       <img src = "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSswTTBymHhslxZ0yYIMykIDvXAzkbttZTcpSCrSxArlI3VsQ6r" alt = ""/>
    //     </div>
    //   </div>
    // </div>
    <div class="card_container">
      <div class="card_checkoutLayout">
          <div class="card_right">
              <h1>Đăng nhập</h1>
              <div class="card_form">

                  <div class="card_group">
                      <label for="name">Email</label>
                      <input type="text" placeholder="email" 
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}/>
                  </div>

                  <div class="card_group">
                      <label for="phone">Mật khẩu</label>
                      <input type="password" placeholder="password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)} />
                  </div>

                  <div class = "card_forgotpass">
                    <input type="checkbox" class="checkbox1"/><span>Ghi nhớ tôi</span>

                    <Link to="/forgotpass">
                      <span style = {{float:"right"}}>Quên mật khẩu</span>
                    </Link>
                  </div>
                  <button class = "card_button" onClick={()=>PostData()}>
                    Đăng nhập
                  </button>
                  <div class = "sign_up">
                    Bạn chưa có tài khoản? 
                    <Link to="/signup">
                      <span style = {{color: 'blue'}}> Đăng kí</span>
                    </Link>
                  </div>

              </div>
        </div>
        <div class="card_returncard">
            <img src = {forlogin} alt = ""/>
        </div>
      </div>

    </div>

  )
}


export default SignIn