import React ,{createContext,useReducer,useContext, useEffect} from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter, Route, Routes, useLocation} from "react-router-dom";
import Home from "./components/screens/Home";
import SignIn from "./components/screens/SignIn";
import SignUp from "./components/screens/SignUp";
import Profile from "./components/screens/Profile";
import CreatePost from "./components/screens/CreatePost";
import Product from "./components/screens/Product";
import Offer from "./components/screens/Offer";
import  Cart from "./components/screens/Cart";
import Footer from "./components/screens/Footer";
import ProductDescription from "./components/screens/ProductDescription";
// import ShippingInfo from "./components/screens/ShippingInfo";
import Payment from "./components/screens/Payment";

import MainCom from "./components/screens/MainCom";
import UserProfile from "./components/screens/UserProfile";
import {useNavigate} from 'react-router-dom'
import {reducer,initialState} from './reducers/userReducer'
import Forgotpass from "./components/screens/Forgotpass";


export const UserContext =createContext()



const Routing=()=>{
  const navigate = useNavigate();
  const location=useLocation();

    const {state,dispatch}=useContext(UserContext)
    // eslint-disable-next-line
 useEffect(()=>{
const user =JSON.parse(localStorage.getItem("user")) 
 console.log(user)
  if(user){
    dispatch({type:"USER",payload:user})
      }
      else{
        if(!location.pathname.startsWith('/reset'))
        navigate("/signin")
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
 },[])
  
}

const CheckLogin=()=>{
  const navigate = useNavigate();
  const location=useLocation();
  if (localStorage.getItem('jwt')===null){
    navigate('/signin')
  }
  else{
    navigate('/home')
  }
}

function App() {
  const[state,dispatch]=useReducer(reducer,initialState)
  return (
    <UserContext.Provider value={{state,dispatch}}> 
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<><Navbar /><Routing/></>}>
            <Route index element={<><MainCom/><Product /><Footer /></>} />
            <Route path="home" element={<><MainCom/><Product /><Footer /></>} />
            <Route path="signin" element={<><SignIn   /></>} />
            <Route path="signup" element={<><SignUp /></>} />
            <Route exact path="profile" element={<><Profile /></>} />
            <Route path="productdescription/:postid" element={<><ProductDescription /></>} />
            <Route path="createpost" element={<><CreatePost /></>} />
            <Route path="product" element={<><Product /><Footer /></>} />
            <Route path="offer" element={<><Offer /></>} />
            <Route path="Footer" element={<><Footer /></>} />
            <Route path="cart" element={<><Cart /></>} />
            <Route path="forgotpass" element={<><Forgotpass/></>} />
            
             {/* <Route path="shippinginfo" element={<><ShippingInfo/></>} /> */}
            {
              <Route path="payment" element={<><Payment/></>} />
            }
            

            


            <Route path="profile/:userid" element={<><UserProfile /></>} />

          </Route>
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;









