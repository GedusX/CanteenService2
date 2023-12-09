import React from 'react'
import {useState,useEffect,useContext}from 'react'
import {UserContext} from '../../App'
import {Link} from 'react-router-dom'
import './Cart.css'
import Popup from './Popup.js';
import M from 'materialize-css'
import Popforcart from './Popforcart.js'
import { Unstable_NumberInput as BaseNumberInput } from '@mui/base/Unstable_NumberInput';
import { styled } from '@mui/system';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

const Cart = () => {
     const [data,setData]=useState([])
     const {state,dispatch}=useContext(UserContext)
     useEffect(()=>{
        fetch('/mycart',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            setData(result.result)
        })
     },[])
     const addToCart = (id,amt)=>{
        fetch('/addToCart',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                foodId:id,
                amount:amt
            })
        }).then(res=>res.json())
        .then(result=>{
          M.toast({html: result.message, classes:"#43a047 green darken-1"})
          fetch('/mycart',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            setData(result.result)
        })
        }).catch(err=>{
          console.log(err)
      })
      }
     const unlikePost = (id)=>{
        fetch('/unlike',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                foodId:id
            })
        }).then(res=>res.json())
        .then(result=>{
          //   console.log(result)
          const newData = (data=>{
              if(data._id==result._id){
                  return result
              }else{
                  return data
                  
              }
          })
          setData(newData)
          console.log(data)
          M.toast({html: "Remove from Cart", className:"#43a047 green darken-1"})
        }).catch(err=>{
          console.log(err)
      })
  }
  const NumberInput = React.forwardRef(function CustomNumberInput(props, ref) {
    return (
      <BaseNumberInput
        slots={{
          root: StyledInputRoot,
          input: StyledInput,
          incrementButton: StyledButton,
          decrementButton: StyledButton,
        }}
        slotProps={{
          incrementButton: {
            children: <AddIcon fontSize="small" />,
            className: 'increment',
          },
          decrementButton: {
            children: <RemoveIcon fontSize="small" />,
          },
        }}
        {...props}
        ref={ref}
      />
    );
  });
  
function QuantityInput(props) {
    return <NumberInput aria-label="Quantity Input" min={0} max={99} value = {props.item.amount} onChange={(event, newValue) => {addToCart(props.item.itemPost._id,newValue)}}/>;
  }
  
  const blue = {
    100: '#daecff',
    200: '#b6daff',
    300: '#66b2ff',
    400: '#3399ff',
    500: '#007fff',
    600: '#0072e5',
    700: '#0059B2',
    800: '#004c99',
  };
  
  const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
  };
  
  const StyledInputRoot = styled('div')(
    ({ theme }) => `
    font-family: 'IBM Plex Sans', sans-serif;
    font-weight: 400;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[500]};
    display: flex;
    margin: 30px
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
  `,
  );
  
  const StyledInput = styled('input')(
    ({ theme }) => `
    font-size: 0.875rem;
    font-family: inherit;
    font-weight: 400;
    line-height: 1.375;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    box-shadow: 0px 2px 4px ${
      theme.palette.mode === 'dark' ? 'rgba(0,0,0, 0.5)' : 'rgba(0,0,0, 0.05)'
    };
    border-radius: 8px;
    margin: 0 8px;
    padding: 10px 12px;
    outline: 0;
    min-width: 40px;
    width: 40px;
    text-align: center;
    &:hover {
      border-color: ${blue[400]};
    }
  
    &:focus {
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[700] : blue[200]};
    }
  
    &:focus-visible {
      outline: 0;
    }
  `,
  );
  
  const StyledButton = styled('button')(
    ({ theme }) => `
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    box-sizing: border-box;
    line-height: 1.5;
    border: 1px solid;
    border-radius: 999px;
    border-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[200]};
    background: ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
    color: ${theme.palette.mode === 'dark' ? grey[200] : grey[900]};
    width: 32px;
    height: 32px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 120ms;
  
    &:hover {
      cursor: pointer;
      background: ${theme.palette.mode === 'dark' ? blue[700] : blue[500]};
      border-color: ${theme.palette.mode === 'dark' ? blue[500] : blue[400]};
      color: ${grey[50]};
    }
  
    &:focus-visible {
      outline: 0;
    }
  
    &.increment {
      order: 1;
    }
  `,
  );





  const submitCart = () => {
        fetch('/submitcart',{
            method:"post",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
        }).then(res=>res.json())
        .then(result=>{
        console.log(result)
            M.toast({html: result.message, classes:"#43a047 green darken-1"})
            
        }).catch(err=>{
            console.log(err)
            M.toast({html: err, className:"#43a047 green darken-1"})
    })
  }
  const [buttonPopup, setButtonPopup] = useState(false);
  const [total, settotal] = useState(0);
  const sum = data.map((order)=>order.amount*order.itemPost?.body).reduce((prev, curr) => prev +  curr, 0)

  return (

    <div class="cart_container">
    <div class="cart_checkoutLayout">
        
        <div class="cart_returnCart">
            <a href="/" > Tiếp tục mua sắm</a>
            <h1>Giỏ hàng</h1>
            <div class="cart_list">
                {
                    data.map(item=>{
                        return(
                        <div class="cart_item">
                            <img src={item.itemPost?.photo} alt = "" />
                            <div class="cart_info">
                                <div class="cart_name">{item.itemPost?.title}</div>
                                <div class="cart_price">{item.itemPost?.body}</div>
                            </div>
                            
                            <div class='quachange'><QuantityInput item = {item}/></div>
                            
                            
                            
                            
                            <div class="cart_returnPrice">{item.amount* item.itemPost?.body}</div>
                        </div>
                    )
                    })

               } 

            </div>
        </div>

        <div class="cart_right_forcart">
            

            <div class="cart_return">
                <div class="cart_row">
                    <div>Tổng tiền</div>
                    <div class="cart_totalPrice">{sum} VND</div>
                </div>
                <div class="cart_row">
                    <div>Phí vận chuyển</div>
                    <div class="cart_transportation">0 VND</div>
                </div>
                <div class="cart_row">
                    <div>Tổng cộng</div>
                    <div class="cart_totalPrice">{sum} VND</div>
                </div>
            </div>
            {sum>0?(
            <a href = "./Payment">
                <button class="cart_buttonCheckout">THANH TOÁN</button>
            </a>):undefined}


        </div>
    </div>
    </div>
  )
}

export default Cart
