import React,{useEffect,useState,useContext} from 'react'
import {UserContext} from '../../App'
import './profile.css'
import { Outlet, Link,useNavigate } from "react-router-dom";
import M from 'materialize-css'


const Profile  = ()=>{
    const {state,dispatch} = useContext(UserContext)
    const [name,setName] = useState(state?state.name:"loading")
    const [email,setEmail]= useState(state?state.email:"loading")
    const [phoneno,setPhoneno] = useState(state?state.phoneno:"loading")

    const handleSaveClick = () => {
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "Email không hợp lệ", classes:"#d32f2f red darken-2"})
            return
        }  
        setIsEditing(false);
        fetch('/changeinfo',{
                  method:"put",
                  headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                  },
                  body:JSON.stringify({
                      name,
                      email,
                      phoneno
                  })
             })
             .then(res=>res.json())
             .then(result=>{ 
                localStorage.setItem("user",JSON.stringify(result.user))
                dispatch({type:"UPDATE",payload:result.user})
             })
      };
    const [isEditing, setIsEditing] = useState(false);

    const handleEditClick = () => {
      setIsEditing(true);
    };
  
    const handleCancelClick = () => {
      setIsEditing(false);
      console.log(state);
      setName(state?state.name:"loading");
      setEmail(state?state.email:"loading");
      setPhoneno(state?state.phoneno:"loading");
    };
    const [mypics,setPics] = useState([])
    const [image,setImage] = useState("")

  return (
<>
    <h4 className="yourInfo">
        Thông tin người dùng
    </h4>
    <div className="form-container">
        
            <div>
                <div className="font-weight: bold">Họ và tên</div>
                <input type="text" id="name" name="name" defaultValue={name} onBlur={(e)=> setName(e.target.value)} disabled={!isEditing} />
            </div>
            <div>
                <div className="font-weight: bold">Số điện thoại</div>
                <input type="text" id="phoneno" name="phoneno" defaultValue={phoneno} onBlur={(e)=> setPhoneno(e.target.value)} disabled={!isEditing}/>
            </div>
            <div>
                <div className="font-weight: bold">Email</div>
                <input type="email" id="email" name="email" defaultValue={email} onBlur={(e)=> setEmail(e.target.value)} disabled={!isEditing}/>
            </div>
       
    </div>
    <div className="changepasswordblock">
        <a  href  = "./changepassword">
            <div className="changePassword">Thay đổi mật khẩu</div>
        </a>
    </div>    
    <div className="Info">
    {isEditing ? (
        <div className="">
        <button
            type="button"
            className="cancelInfo"
            onClick={handleCancelClick}
        >
            Huỷ
        </button>
        <button
            type="button"
            className="saveInfo"
            onClick={handleSaveClick}
        >
            Lưu
        </button>
        </div>
    ) : (
        <button
        type="button"
        className="changeInfo"
        onClick={handleEditClick}
        >
        Thay đổi thông tin
        </button>
        
    )}
    </div>
</>
  )
}
export default Profile