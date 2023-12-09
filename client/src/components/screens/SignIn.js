import React,{useState,useContext, useEffect} from 'react'
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
  useEffect(()=>{
    if (localStorage.getItem('jwt')===null){

    }
    else{
      navigate('/home')
    }
  })
  const PostData =()=>{
  if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
    M.toast({html: "Invalid Email", classNamees:"#d32f2f red darken-2"})
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
    M.toast({html: data.error, classNamees:"#d32f2f red darken-2"})
    }else{
      localStorage.setItem("jwt",data.token)
      localStorage.setItem("user",JSON.stringify(data.user))
      dispatch({type:"USER",payload:data.user})
      M.toast({html: "Signed In success", classNamees:"#43a047 green darken-1"})
    navigate("/home");
  }
  })
  .catch(err=>{
    console.log(err) 
  })
  }
  const [checked, setChecked] = useState(false);
  return (
    // <div className = "card_contain">
    //   <div className ="card_signin">
    //     <div className ="card_siginform">
    //         <h2>Nothing</h2>
    //         <input type="text" placeholder="email" 
    //         value={email}
    //         onChange={(e)=>setEmail(e.target.value)}/>

    //         <input type="password" placeholder="password"
    //         value={password}
    //         onChange={(e)=>setPassword(e.target.value)} />
    //         <button className="button_signin"
    //         onClick={()=>PostData()}
    //         >Đăng nhập
    //         </button>
    //         <h5><Link to="/inputemail">Quên mật khẩu</Link></h5>
    //         <h5><Link to="/signup">Không có tài khoản?</Link></h5>
    //     </div>
    //     <div className = "card_right">
    //       <img src = "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSswTTBymHhslxZ0yYIMykIDvXAzkbttZTcpSCrSxArlI3VsQ6r" alt = ""/>
    //     </div>
    //   </div>
    // </div>
    <div className="card_container">
      <div className="card_checkoutLayout">
          <div className="card_right">
              <h1>Đăng nhập</h1>
              <div className="card_form">

                  <div className="card_group">
                      <label htmlFor="name">Email</label>
                      <input type="text" placeholder="email" 
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}/>
                  </div>

                  <div className="card_group">
                      <label htmlFor="phone">Mật khẩu</label>
                      <input type="password" placeholder="password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)} />
                  </div>

                  <div className = "card_forgotpass">
                    {/* <input type="checkbox" className="checkbox1" id = "mycheckbox" checked={checked} onChange={() => {setChecked(!checked);}}/><span>Ghi nhớ tôi</span>
                    <label for="mycheckbox"></label> */}
                    <input type="checkbox" /><span>Ghi nhớ tôi</span>



                    <Link to="/forgotpass">
                      <span style = {{float:"right"}}>Quên mật khẩu</span>
                    </Link>
                  </div>
                  <button className = "card_button" onClick={()=>PostData()}>
                    Đăng nhập
                  </button>
                  <div className = "sign_up">
                    Bạn chưa có tài khoản? 
                    <Link to="/signup">
                      <span style = {{color: 'blue'}}> Đăng kí</span>
                    </Link>
                  </div>

              </div>
        </div>
        <div className="card_returncard">
            <img src = {forlogin} alt = ""/>
        </div>
      </div>

    </div>

  )
}


export default SignIn