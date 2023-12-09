import React,{useEffect,useState,useContext} from 'react'
import {UserContext} from '../../App'
import M from 'materialize-css'
import "./Changepassword.css"

const Changepassword = () => {
    const {state,dispatch} = useContext(UserContext)
    const [input1, setstate1] = useState("");
    const [input2, setstate2] = useState("");
    const [input3, setstate3] = useState("");
    const handleInputChange1 = (e) => {
        setstate1(e.target.value);
    };
    const handleInputChange2 = (e) => {
        setstate2(e.target.value);
    };
    const handleInputChange3 = (e) => {
        setstate3(e.target.value);
    };
    const handleClick = async (e) => {
        try {
            let returnedData;
            const response = await fetch('/verify-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: state.email,
                    password: input1,
                }),
            });
            const data = await response.json();
            returnedData = data.isValidPassword;
            console.log(returnedData);
            if (returnedData === 0) {
                M.toast({html: "MẬT KHẨU SAI", classes:"#d32f2f red darken-2"});
                return;
            }
            if (input2 !== input3) {
                M.toast({html: "XÁC NHẬN LẠI MẬT KHẨU", classes:"#d32f2f red darken-2"});
                return;
            }
            const changePassResponse = await fetch('/changepass', {
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    password: input2
                })
            });
            M.toast({html: "ĐỔI MẬT KHẨU THÀNH CÔNG", classes:"#43a047 green darken-1"});
        } catch (error) {
            M.toast({html: "XẢY RA LỖI", classes:"#d32f2f red darken-2"});
        }
    };
    
    return (
    <>
    <h1 className="title">
        ĐỔI MẬT KHẨU
    </h1>
    <div className='change_pass'>
        <div>
            <label>Mật khẩu hiện tại</label>
            <input type="text" onChange={(e) => handleInputChange1(e)} />
        </div>
        <div>
            <label>Mật khẩu mới</label>
            <input type="text" onChange={(e) => handleInputChange2(e)} />
        </div>
        <div>
            <label>Xác nhận mật khẩu mới</label>
            <input type="text" onChange={(e) => handleInputChange3(e)} />
        </div>
        <button type="button" class="btn btn-primary" onClick={handleClick}>
            Xác nhận
        </button>
    </div>
    </>
    )
}

export default Changepassword
