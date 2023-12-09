import React,{useEffect,useState,useContext} from 'react'
import {UserContext} from '../../App'
import {useParams} from 'react-router-dom'
import './ProductDescription.css'
import M from 'materialize-css'
import Favorite from "@mui/icons-material/Favorite";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { grey, blue } from '@mui/material/colors';
import { createTheme, ThemeProvider } from '@mui/material/styles';
const ProductDescription  = ()=>{
  const [PostDesc,setPostDesc] = useState([])
  const {state,dispatch} = useContext(UserContext)
  const {postid}=useParams()
  useEffect(()=>{
      fetch(`/products/${postid}`,{
          headers:{
              "Authorization":"Bearer "+localStorage.getItem("jwt")
          }
      }).then(res=>res.json())
      .then(result=>{
          console.log(result.foodinfo)
          setPostDesc(result.foodinfo)
          console.log(PostDesc.likes.includes(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user"))._id:null))
          
          
      })
  },[])

  const [isPressed, setIsPressed] = useState(false);
  const buttonStyle = {
      width: '195px',
      height: '65px',
      flexShrink: 0,
      borderRadius: '10px',
      background: '#F4764E',
      transition: 'box-shadow 0.3s ease',
      cursor: 'pointer',
      boxShadow: isPressed ? '0px 4px 8px rgba(0, 0, 0, 0.4)' : 'none',
      border: 'none',
      outline: 'none',
      fontFamily: 'Montserrat, sans-serif',
      fontSize: '18px',
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: 'normal',
      color: '#FFF',
      marginLeft: '40px'
  };
  const buttonCommentStyle = {
    width: '150px',
    height: '50px',
    flexShrink: 0,
    borderRadius: '10px',
    background: '#F4764E',
    transition: 'box-shadow 0.3s ease',
    cursor: 'pointer',
    boxShadow: isPressed ? '0px 4px 8px rgba(0, 0, 0, 0.4)' : 'none',
    border: 'none',
    outline: 'none',
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '18px',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: 'normal',
    color: '#FFF',
    marginLeft: '40px'
};
  const handleButtonPress = () => {
    setIsPressed(true);
  };
  const handleButtonRelease = () => {
    setIsPressed(false);
  };
  const [data,setData]=useState([])
  const unlikeFood = (id)=>{
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

      // setData(newData)
      fetch(`/products/${postid}`,{
        headers:{
            "Authorization":"Bearer "+localStorage.getItem("jwt")
        }
    }).then(res=>res.json())
    .then(result=>{
        console.log(result.foodinfo)
        setPostDesc(result.foodinfo)
    })
      M.toast({html: "Đã hủy thích món ăn", classes:"#43a047 green darken-1"})
    }).catch(err=>{
      console.log(err)
  })
  }
  const likeFood = (id)=>{
    fetch('/like',{
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
               console.log(result)
      
      // setData(newData)
      fetch(`/products/${postid}`,{
        headers:{
            "Authorization":"Bearer "+localStorage.getItem("jwt")
        }
    }).then(res=>res.json())
    .then(result=>{
        console.log(result.foodinfo)
        setPostDesc(result.foodinfo)
    })
      M.toast({html: "Đã thích món ăn", classes:"#43a047 green darken-1"})
    }).catch(err=>{
        console.log(err)
    })
  }
  const [comment,setComment] = useState("")
  const addComment = () => {
    if (comment){
      console.log(comment)  
      fetch('/comment',{
        method:"put",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")
        },
        body:JSON.stringify({
            text:comment,
            foodId:PostDesc._id
        })
    }).then(res=>res.json())
    .then(result=>{
      console.log(result)
      setData(result)
      fetch(`/products/${postid}`,{
        headers:{
            "Authorization":"Bearer "+localStorage.getItem("jwt")
        }
    }).then(res=>res.json())
    .then(result=>{
        console.log(result.foodinfo)
        setPostDesc(result.foodinfo)
    })
      M.toast({html: "Comment Posted", classes:"#43a047 green darken-1"})

    }).catch(err=>{
      console.log(err)
    });


      setComment("")
    } else {
      console.log("please add a comment")
    } 
  }


  
  const p1 = createTheme({
    palette: {
      bluep: {
        light: blue[300],
        main: blue[500],
        dark: blue[700],
        darker: blue[900],
      },
      greyp:{
        light: grey[300],
        main: grey[500],
        dark: grey[700],
        darker: grey[900],
      }
    },
  });
  

  function ToggleFavorite({Fstate,id}) {
    
    const toggleState = () => {
      if (Fstate === true){
        unlikeFood(id)
      }
      else{
        likeFood(id)
      }
      
    }
    return(
      <ThemeProvider theme={p1}>
      <Button variant="contained" size="large" color = {Fstate == true ? "greyp": "bluep"} onClick = {toggleState}>
        <div>
        {Fstate == true ? 
        (<Favorite style={{marginLeft:"14px" , marginRight: "10px", alignSelf: "center", fontSize: "30px",color: 'red'}}/>)
        : 
        (<FavoriteBorder style={{marginLeft:"14px", marginRight: "10px",alignSelf: "center", fontSize: "30px",color: 'red'}}/>)
        }
      </div> <div className = "love_text">{Fstate == true ? "ĐÃ THÍCH": "YÊU THÍCH"}</div></Button>
      
      </ThemeProvider>
    )
  }
  const [amount,setAmount]=useState(1)
  const addToCart = (id)=>{
    fetch('/addToCart',{
        method:"put",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem('jwt')
        },
        body:JSON.stringify({
            foodId:id,
            amount:amount
        })
    }).then(res=>res.json())
    .then(result=>{
      M.toast({html: result.message, classes:"#43a047 green darken-1"})
    }).catch(err=>{
      console.log(err)
  })
  }


  return (
    <>
    {PostDesc?   
    <div class="productDescription" >
      <div class="box">
        <div class="card-image" >
          <div class = "img_frame">
            <img src={PostDesc.photo} alt="" />
          </div>
          <div class='Description'>
            <div class = 'Info'>
              <h3>Mô tả</h3>
              <p>{PostDesc.desc}</p>
            </div>
          </div>

        </div>

        <div class="card-content" >
          <h2>{PostDesc.title}</h2>
          <h3>{PostDesc.body} đ</h3>
          <h5>Bán tại gian hàng: {PostDesc.belongTo?.name}</h5>
          



          <div class = "amount_and_addcart">
            <input class = "amount_food" type = "number" defaultValue={amount} onChange={(e)=>setAmount(e.target.value)} />
            <button
              style={buttonStyle}
              onMouseDown={handleButtonPress}
              onMouseUp={handleButtonRelease}
              onMouseLeave={handleButtonRelease}
              onClick={() => addToCart(PostDesc._id)}
            >
              Thêm vào giỏ hàng
            </button>
          </div>
          <div class="Add_favorite">
            {/* <i className="material-icons" style={{color:'red', marginRight : '50px'}}>favorite</i> */}
            <ToggleFavorite Fstate = {PostDesc?.likes?.includes(JSON.parse(localStorage.getItem("user"))._id)} id = {PostDesc._id}/>
            <div class = "amount_like">
            <p className='amount_text'>{PostDesc.likes?.length}</p>
            {/* Not take the name of postdesc */}
            
          </div>



          </div>

          
        </div>
      </div>

      <div className='Comments'>
        <h3>Bình luận</h3>
        <div>    
          <input 
            type="text" 
            style={{width: "50%",marginLeft:"20px"}}
            placeholder='Thêm bình luận...'
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
        <button 
              style={buttonCommentStyle}
              onMouseDown={handleButtonPress}
              onMouseUp={handleButtonRelease}
              onMouseLeave={handleButtonRelease}
              onClick={() => addComment()}
            > Bình luận </button>
        </div>
        <div class='box_comment'>
          <div class='frame_comment'>
              {PostDesc.comments && PostDesc.comments.length > 0 ? (
              PostDesc.comments.map((comment, index) => (
                // <div key={index}>
                //   <p>
                //     <strong>{comment.postedBy.name}: </strong>
                //     {comment.text}
                //   </p>
                // </div>
                <div class='each_comment' key={index}>
                  <div class='left'>
                  <div>
                  <img  alt="" style={{width:"75px",height:'75px',borderRadius:"100px"}}
                    src={comment.postedBy.pic}/>
                  </div>

                    
                  </div>
                  <div class='right'>
                  <p>
                    <strong>{comment.postedBy.name}</strong>
                    </p>
                    <p>{comment.text}</p>
                  </div>
              </div>
              ))
            ) : (
              <p>Chưa có bình luận</p>
            )}

          </div>

        </div>
      </div>
      
    </div>

  
 :  <h2>Loading...!</h2> }
  
  
   
    </>
  )
}
export default ProductDescription