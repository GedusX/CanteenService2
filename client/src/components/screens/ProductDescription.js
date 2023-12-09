import React,{useEffect,useState,useContext} from 'react'
import {UserContext} from '../../App'
import {useParams} from 'react-router-dom'
import './ProductDescription.css'
import M from 'materialize-css'
import Favorite from "@mui/icons-material/Favorite";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";

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
      const newData = data.map(data=>{
          if(data._id==result._id){
              return result
          }else{
              return data
          }
      })
      // setData(newData)
      M.toast({html: "UnLike Food", classes:"#43a047 green darken-1"})
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
      const newData = data.map(item=>{
          if(item._id==result._id){
              return result
          }else{
              return item
          }
      })
      // setData(newData)
      M.toast({html: "Like Food", classes:"#43a047 green darken-1"})
    }).catch(err=>{
        console.log(err)
    })
  }
  function ToggleFavorite({Fstate,id}) {
    const [favoriteState, setFavoriteState] = useState(Fstate);
    const toggleState = () => {
      if (favoriteState === true){
        unlikeFood(id)
      }
      else{
        likeFood(id)
      }
      setFavoriteState(current => !current);
    }
    return(
      <div
       onClick={toggleState}
        >
        {favoriteState == true ? 
        (<Favorite style={{marginLeft:"22px" , fontSize: "30px",color: 'red'}}/>)
        : 
        (<FavoriteBorder style={{marginLeft:"22px" , fontSize: "30px",color: 'red'}}/>)
        }
      </div>
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

  console.log(PostDesc)
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
          <h2>Size</h2>
          <div class="Select_size">
            <button type="button" class="block">S</button>
            <button type="button" class="block1">M</button>
            <button type="button" class="block1">L</button>
          </div>

          <div class = "amount_like">
            <p >Số lượt yêu thích: {PostDesc.likes?.length}</p>
            {/* Not take the name of postdesc */}
            <p>Gian hàng: {PostDesc.belongTo?.name}</p>
          </div>
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
            <ToggleFavorite Fstate = {PostDesc.isLike} id = {PostDesc._id}/>
            <p>Thêm vào yêu thích</p>
          </div>

          
        </div>
      </div>

      <div className='Comments'>
        <h3>Bình luận</h3>
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
                    <img src = {comment.postedBy.pic}  alt = ""/>
                    {comment.pic} 
                    <p>
                    {comment.postedBy?.name}
                    </p>
                  </div>
                  <div class='right'>
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