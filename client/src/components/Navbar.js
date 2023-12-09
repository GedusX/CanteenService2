import React,{useContext,useState} from 'react'
import { Outlet, Link,useNavigate } from "react-router-dom";
import { UserContext} from '../App'
import M from 'materialize-css'
import './Navbar.css'
const Navbar=()=> {
    const [search,setSearch] = useState('')
    const {state,dispatch} = useContext(UserContext)
    const navigate=useNavigate();
  const renderList=()=>{
    if(state){
    return[
      <li key='3'><Link to="/cart"><i className="material-icons blue-text text-darken-2 modal-trigger">shopping_cart</i></Link></li>,
      <li key='2'><Link to="/profile"><i className="material-icons blue-text text-darken-2 modal-trigger">person</i></Link></li>,
      <li key='9' className='text'>Xin chào, {localStorage.getItem('jwt')===null?"Guest":JSON.parse(localStorage.getItem('user')).name}</li>,
      <li key='4'>
        <button className="btn #c62828 red darken-3 layout"
        style={{marginLeft:"20px",marginRight:"20px"}}
         onClick={()=>{
           localStorage.clear()
            dispatch({type:"CLEAR"})
           navigate('/signin')
         }}
         >ĐĂNG XUẤT
         </button>
       </li>
    ]
    }
    else
    {
 
      return[
        <li key='5'><Link to="/signin">SignIn</Link></li>,
        <li key='6'><Link to="/signup">SignUp</Link></li>
       
      ]
    }
  }
 
  return (
    <>
    {localStorage.getItem("jwt")!==null?(
    <nav>
    <div className="nav-wrapper white " >
      <Link to={state?"/home":"signin"} className="brand-logo left"><img className = 'logo' src='https://upload.wikimedia.org/wikipedia/commons/f/f0/HCMCUT.svg'></img></Link>
      <ul id="nav-mobile" className="right">
       {renderList()}
      </ul>
    </div>
 
  </nav>):undefined}
  <Outlet />
    </>
  )
}
export default Navbar