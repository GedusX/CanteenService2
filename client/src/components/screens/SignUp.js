import React ,{useState} from 'react'
import {Link} from 'react-router-dom'
import M from 'materialize-css'
import {useNavigate} from 'react-router-dom'
import IconButton from "@material-ui/core/IconButton";
// import InputLabel from "@material-ui/core/InputLabel";
import Visibility from "@material-ui/icons/Visibility";
import InputAdornment from "@material-ui/core/InputAdornment";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Input from "@material-ui/core/Input";
const SignIn=()=> {

const [name, setName] = useState("")
const [password, setPassword] = useState({
  value:"",
  showPassword:false
})
const [confirmPassword,setConfirmPassword] = useState({
  value:"",
  showPassword:false
})

const [email, setEmail] = useState("")
const [address,setAddress] = useState("")
const [sector,setSector] = useState("")
const [phoneno,setPhoneno] = useState("")
const [city,setCity] = useState("")

let navigate =useNavigate();

const PostData =()=>{
  if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
   M.toast({html: "Email không hợp lệ", classes:"#d32f2f red darken-2"})
   return
  }  
  if(confirmPassword.value != password.value){
    M.toast({html: "Mật khẩu không trùng khớp", classes:"#d32f2f red darken-2"})
    return
   } 
  fetch("http://localhost:3000/signup",{
    method:"post",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({
      name,
      password: password.value,
      email,
      address,
      sector,
      city,
      phoneno,
          
    })
  }).then(res=>res.json())
  .then(data=>{
   if(data.error){
    M.toast({html: data.error, classes:"#d32f2f red darken-2"})
    }else{
    M.toast({html: data.message, classes:"#43a047 green darken-1"})
    navigate("/signin");
  }
  }).catch(err=>{
    console.log(err) 
  })

}


  return (
    <div className="mycard">
     <div className="card auth-card input-field">
        <h4> ĐĂNG KÍ TÀI KHOẢN </h4>
        <Input 
          type="text" placeholder="Tên"
          disableUnderline
          style={{ width: '100%' }}
          value={name}
          onChange={(e)=>setName(e.target.value)} />

        <Input 
          type="text" placeholder="Email" 
          disableUnderline
          style={{ width: '100%' }}
          value={email}
          onChange={(e)=>setEmail(e.target.value)}/>

        <Input
                placeholder="Mật khẩu"
                disableUnderline
                style={{ width: '100%' }}
                type={
                    password.showPassword
                        ? "text"
                        : "password"
                }
                onChange={(e) =>
                  setPassword({
                    ...password,
                    value : e.target.value
                })
                }
                value={password.value}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            onClick={ (e) =>
                              setPassword({
                                ...password,
                                showPassword: !password.showPassword
                            })
                            }
                        >
                            {password.showPassword ? (
                                <Visibility />
                            ) : (
                                <VisibilityOff />
                            )}
                        </IconButton>
                    </InputAdornment>
                }
            />

            <Input
                placeholder="Nhập lại mật khẩu"
                disableUnderline
                style={{ width: '100%' }}
                type={
                    confirmPassword.showPassword
                        ? "text"
                        : "password"
                }
                onChange={(e) =>
                  setConfirmPassword({
                    ...confirmPassword,
                    value : e.target.value
                })
                }
                value={confirmPassword.value}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            onClick={ (e) =>
                              setConfirmPassword({
                                ...confirmPassword,
                                showPassword: !confirmPassword.showPassword
                            })
                            }
                        >
                            {confirmPassword.showPassword ? (
                                <Visibility />
                            ) : (
                                <VisibilityOff />
                            )}
                        </IconButton>
                    </InputAdornment>
                }
            />
        <Input 
          disableUnderline
          style={{ width: '100%' }} 
          type="text" placeholder="Địa chỉ"
          value={address}
          onChange={(e)=>setAddress(e.target.value)} 
        />

        <Input
          disableUnderline
          style={{ width: '100%' }} 
          type="text" placeholder="Tỉnh" 
          value={sector}
          onChange={(e)=>setSector(e.target.value)}/>

        <Input 
          disableUnderline
          style={{ width: '100%' }}
          type="text" placeholder="Thành phố"
          value={city}
          onChange={(e)=>setCity(e.target.value)}/>
        <Input
          disableUnderline
          style={{ width: '100%' }} 
          type="number" placeholder="Số điện thoại"
          value={phoneno}
          onChange={(e)=>setPhoneno(e.target.value)}
         />
        <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
        onClick={()=>PostData()}
        >Đăng kí
        </button>
        <h5><Link to="/signin">Đã có tài khoản?</Link></h5>
      </div>
    </div>
  )
}

export default SignIn