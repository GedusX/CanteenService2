import React,{useEffect,useState,useContext} from 'react'
import {UserContext} from '../../App'
import './Profile.css'
import { Outlet, Link,useNavigate } from "react-router-dom";

const Profile  = ()=>{

    const [isEditing, setIsEditing] = useState(false);

    const handleEditClick = () => {
      setIsEditing(true);
    };
  
    const handleCancelClick = () => {
      setIsEditing(false);
    };
  
    const handleSaveClick = () => {
      setIsEditing(false);
    };

    const [mypics,setPics] = useState([])
    const {state,dispatch} = useContext(UserContext)
    console.log(state)
    const [image,setImage] = useState("")
    useEffect(()=>{
       fetch('/changeinfo',{
           headers:{
               "Authorization":"Bearer "+localStorage.getItem("jwt")
           }
       }).then(res=>res.json())
       .then(result=>{
           console.log(result)
           setPics(result.mypost)
       })
    },[])

  return (
<>
    <h4 class="yourInfo">
        Thông tin người dùng
    </h4>
    <div class="form-container">
        <form>
            <div>
                <div class="font-weight: bold">Họ và tên</div>
                <input type="text" id="name" name="name" Value={state ? state.name : "loading" } disabled={!isEditing} />
            </div>
            <div>
                <div class="font-weight: bold">Số điện thoại</div>
                <input type="number" id="phoneno" name="phoneno" Value={state ? state.phoneno : "loading"}  disabled={!isEditing}/>
            </div>
            <div>
                <div class="font-weight: bold">Email</div>
                <input type="email" id="email" name="email" Value={state ? state.email : "loading"}  disabled={!isEditing}/>
            </div>
        </form>
    </div>
    <div class="changepasswordblock">
        <a  href  = "./changepassword">
            <div class="changePassword">Thay đổi mật khẩu</div>
        </a>
    </div>    
    <div class="Info">
    {isEditing ? (
        <div className="">
        <button
            type="button"
            class="cancelInfo"
            onClick={handleCancelClick}
        >
            Huỷ
        </button>
        <button
            type="button"
            class="saveInfo"
            onClick={handleSaveClick}
        >
            Lưu
        </button>
        </div>
    ) : (
        <button
        type="button"
        class="changeInfo"
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