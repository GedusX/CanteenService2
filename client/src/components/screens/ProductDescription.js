import React,{useEffect,useState,useContext} from 'react'
import {UserContext} from '../../App'
import {useParams} from 'react-router-dom'
import './ProductDescription.css'
import M from 'materialize-css'

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
};
const handleButtonPress = () => {
  setIsPressed(true);
};
const handleButtonRelease = () => {
  setIsPressed(false);
};

  return (
    <>
    {PostDesc?   
    <div className="productDescription" >
      <div className="box">
        <div className="card-image" >
          <img src={PostDesc.photo} alt="" style={{height:"365px", width:"450px", marginTop: '100px'}}/>
        </div>

        <div className="card-content" >
          <h2 style={{ fontFamily: 'Montserrat, sans-serif' }}>{PostDesc.title}</h2>
          <h3 style={{ color: '#FF4004', fontFamily: 'Montserrat, sans-serif'}}>{PostDesc.body} đ</h3>
          <i className="material-icons" style={{color:'red', marginRight : '40px' }}>favorite</i>
          <p>{PostDesc.likes?.length}</p>
          <button
            style={buttonStyle}
            onMouseDown={handleButtonPress}
            onMouseUp={handleButtonRelease}
            onMouseLeave={handleButtonRelease}
          >
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
      <div className='Description' style = {{marginLeft: '60px'}}>
      <h3>Mô tả</h3>
      <p>{PostDesc.desc}</p>
      </div>
      <div className='Comments' style = {{marginLeft: '60px'}}>
      <h3>Bình luận</h3>
      {PostDesc.comments && PostDesc.comments.length > 0 ? (
        PostDesc.comments.map((comment, index) => (
          <div key={index}>
            <p>
              <strong>{comment.postedBy.name}: </strong>
              {comment.text}
            </p>
          </div>
        ))
      ) : (
        <p>Chưa có bình luận</p>
      )}
      </div>
    </div>  
 :  <h2>Loading...!</h2> }
    </>
  )
}
export default ProductDescription