import React,{useEffect,useState,useContext} from 'react'
import {UserContext} from '../../App'
import './profile.css'
import { Outlet, Link,useNavigate } from "react-router-dom";
import M from 'materialize-css'


const Profile  = ()=>{
    const {state,dispatch} = useContext(UserContext)
    const [name, setName] = useState(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).name : "loading");
    const [email, setEmail] = useState(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).email : "loading");
    const [phoneno, setPhoneno] = useState(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).phoneno : "loading");
    const [pic, setPic] = useState(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).pic : "https://cvhrma.org/wp-content/uploads/2015/07/default-profile-photo.jpg");

    const [initialValues, setInitialValues] = useState({ name: '', email: '', phoneno: '' });

    const handleSaveClick = () => {
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "Email không hợp lệ", classes:"#d32f2f red darken-2"})
            return
        }
        if (email === initialValues.email) {
            M.toast({html: "Địa chỉ Email mới trùng với địa chỉ Email hiện tại.", classes: "#d32f2f red darken-2"});
            return;
        }
        if(!/^\d{10}$/.test(phoneno)) {
            M.toast({html: "Số điện thoại phải có 10 chữ số.", classes:"#d32f2f red darken-2"})
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
                console.log(result)
                if (result.user){
                    console.log("UserFound")
                    localStorage.setItem("user",JSON.stringify(result.user))
                    dispatch({type:"UPDATE",payload:result.user})
                    setInitialValues({ name: result.user.name, email: result.user.email, phoneno: result.user.phoneno });
                    M.toast({html: "Thay đổi thông tin thành công", classes: "#43a047 green darken-1"});
                }else if (result.err){
                    M.toast({html: result.err, classes: "#43a047 red darken-1"});
                    setTimeout(() => {
                        window.location.reload();
                    }, 3000);
                }
             })
             .catch(err=>{
                console.log(err)
             })
      };
    const [isEditing, setIsEditing] = useState(false);

    const handleEditClick = () => {
      setIsEditing(true);
      setInitialValues({ name, email, phoneno });
    };
  
    const handleCancelClick = () => {
      setIsEditing(false);
      console.log(state);
      setName(initialValues.name);
      setEmail(initialValues.email);
      setPhoneno(initialValues.phoneno);
      setPic(initialValues.pic);
    // setName((prevName) => initialValues.name);
    // setEmail((prevEmail) => initialValues.email);
    // setPhoneno((prevPhoneno) => initialValues.phoneno);

        window.location.reload();
    };
    const [image,setImage] = useState("")

    useEffect(() => {
        const userInfo = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : state;
        if (userInfo) {
            setName(userInfo.name);
            setEmail(userInfo.email);
            setPhoneno(userInfo.phoneno);
            setPic(userInfo.pic)
            setInitialValues({ name: userInfo.name, email: userInfo.email, phoneno: userInfo.phoneno });
        }
    }, [state]);

  return (
<>

    <h4 className="yourInfo">
        Thông tin người dùng
    </h4>
    <div style={{maxWidth:"550px", margin:"0px auto" }}>
    <div style={{
      display:"flex",
      justifyContent:"space-around",
      margin:"18px 0px",
      borderBottom:"1px solid grey"

    }}>
      <div>
        <img  alt="" style={{width:"200px",height:'200px',borderRadius:"100px"}}
        src={pic} />
      </div>
      </div>
      </div>
    <div className="form-container">
            <div>
                <div className="font-weight: bold">Họ và tên</div>
                <input type="text" id="name" name="name" defaultValue={name} onBlur={(e)=> setName(e.target.value)} readOnly={!isEditing} className={!isEditing ? "input-normal" : "" }/>
            </div>
            <div>
                <div className="font-weight: bold">Số điện thoại</div>
                <input type="text" id="phoneno" name="phoneno" defaultValue={phoneno} onBlur={(e)=> setPhoneno(e.target.value)} readOnly={!isEditing} className={!isEditing ? "input-normal" : ""}/>
            </div>
            <div>
                <div className="font-weight: bold">Email</div>
                <input type="email" id="email" name="email" defaultValue={email} onBlur={(e)=> setEmail(e.target.value)} readOnly={!isEditing} className={!isEditing ? "input-normal" : ""}/>
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
