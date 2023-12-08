import React from "react";
import {useState,useEffect,useContext}from 'react'
import {UserContext} from '../../App'
import { Link} from 'react-router-dom'
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ReactPaginate from 'react-paginate';
// import ListItemButton from '@material-ui/core/ListItemButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import FilterAlt from '@mui/icons-material/FilterAlt'
import CompareArrows from '@mui/icons-material/CompareArrows'
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import Favorite from "@mui/icons-material/Favorite";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import M from 'materialize-css'
import ProductDescription from "./ProductDescription";
import "./Product.css"
import { Pagination } from "@mui/material";
const Product = () => {
  const [data,setData]=useState([])
   const {state,dispatch}=useContext(UserContext)
   useEffect(()=>{
    fetch('/allfood',{
      headers:{
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      }
    }).then(res=>res.json())
    .then(result=>{
      console.log(result)
      setData(result.foods)
     })
   },[])
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
const addToCart = (id)=>{
  fetch('/addToCart',{
      method:"put",
      headers:{
          "Content-Type":"application/json",
          "Authorization":"Bearer "+localStorage.getItem('jwt')
      },
      body:JSON.stringify({
          foodId:id,
          amount:1
      })
  }).then(res=>res.json())
  .then(result=>{
    M.toast({html: result.message, classes:"#43a047 green darken-1"})
  }).catch(err=>{
    console.log(err)
})
}



   const [drawerState, setDrawerState] = React.useState({
    left: false,
  });
  
  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
  
    setDrawerState({ ...drawerState, [anchor]: open });
  };
  
  const [store, setStore] = React.useState('');
  
  const handleStoreChange = (event) => {
    setStore(event.target.value);
  };
  const [type, setType] = React.useState('');
  
  const handleTypeChange = (event) => {
    setType(event.target.value);
  };
  
  



  const list = (anchor) => (
    <Box
      sx={{ width: "100" }}
      //role="presentation"
      //onClick={toggleDrawer(anchor, false)}
      //onKeyDown={toggleDrawer(anchor, false)}
    > 
    <div style={{fontSize: "24px"}}>
      <div style={{margin: "20px"}}> <FilterAlt fontSize="large" /> <span> Lọc sản phẩm </span> </div>
        <div style={{margin: "15px"}} >
          <Box 
            sx={{ minWidth: 150 }}>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 250 }}>
              <InputLabel variant="standard" > Gian hàng </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={store}
                label="store"
                onChange={handleStoreChange}
              >
                <MenuItem value={"MiniStop"}>MiniStop</MenuItem>
                <MenuItem value={"Hồng Trà Ngô Gia"}>Hồng Trà Ngô Gia </MenuItem>
                <MenuItem value={"Ngô Quyền"}>Ngô Quyền</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </div>
        <div style={{margin: "15px"}} >
          <Box 
            sx={{ minWidth: 150 }}>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 250 }}>
              <InputLabel variant="standard" > Loại </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={type}
                label="type"
                onChange={handleTypeChange}
              >
                <MenuItem value={"Đồ ăn"}>Đồ ăn</MenuItem>
                <MenuItem value={"Thức Uống"}>Thức Uống </MenuItem>
              </Select>
            </FormControl>
          </Box>
        </div>
      <Divider />
      <div  style={{margin: "15px"}} >
        <span> Khoảng giá </span>
        <div className="row">
        <TextField 
          InputProps={{ disableUnderline: true }} 
          id="standard-basic" 
          label="Tối thiểu" 
          variant="standard" 
          style={{width: '100px'}}
        />
        <CompareArrows style={{ margin: "20"}}/>
        <TextField 
          InputProps={{ disableUnderline: true }} 
          id="standard-basic" 
          label="Tối đa" 
          variant="standard" 
          style={{width: '100px'}}
        />
          </div>
          <div className="row center">
            <Button variant="contained">Áp dụng</Button>
            <Button variant="contained">Đặt lại</Button>
          </div>
        </div>
    </div>
    </Box>
    
  );
  
  
  
  const filterData = (query, data) => {
    if (!query) {
      return data;
    } else {
      return data.filter((d) => d.title.toLowerCase().includes(query));
    }
  };
  
  const [searchQuery, setSearchQuery] = useState("");
  const dataFiltered = filterData(searchQuery, data);
  
  function PaginatedItems() {
    // Here we use item offsets; we could also use page offsets
    // following the API or data you're working with.
    const [itemOffset, setItemOffset] = useState(0);
  
    // Simulate fetching items from another resources.
    // (This could be items from props; or items loaded in a local state
    // from an API endpoint with useEffect and useState)
    const endOffset = itemOffset + 12;
    console.log(`Loading items from ${itemOffset} to ${endOffset}`);
    const currentItems = dataFiltered.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(dataFiltered.length / 12);
  
    // Invoke when user click to request another page.
    const handlePageClick = (event) => {
      const newOffset = (event.selected * 12) % dataFiltered.length;
      console.log(
        `User requested page number ${event.selected}, which is offset ${newOffset}`
      );
      setItemOffset(newOffset);
    };
  
    return (
      <>
        
        <ReactPaginate
          breakLabel="..."
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel="< previous"
          renderOnZeroPageCount={null}
          className="pagnating"
        />
      </>
    );
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





  return (
    <>
      <div>
        <div className="container" 
        style={{margin: "10",
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}>
          <div>
       
              <Button onClick={toggleDrawer('left', true)}>
                <span style={{fontSize: "20px",color: "black"}}>
                  Lọc sản phẩm
                </span>  </Button>
              <SwipeableDrawer
                anchor={'left'}
                open={drawerState['left']}
                onClose={toggleDrawer('left', false)}
                onOpen={toggleDrawer('left', true)}
              >
                {list('left')}
              </SwipeableDrawer>

        
          </div>
            <div
                  style={{
                    display: "flex",
                    alignSelf: "center",
                    justifyContent: "center",
                    flexDirection: "center",
                    padding: '100',
                    width: "40%",
                  }}
                >
                  <TextField
                    id="standard-basic" 
                    onInput={(e) => {
                      setSearchQuery(e.target.value);
                    }}
                    label="Search..."
                    variant="outlined"
                    
                    style={{width: '100%', }}
                    inputProps={{
                      style: {
                          paddingLeft: "10px"
                        }
                    }}
                  />
             </div>
             
        </div>
        
          {dataFiltered?
            <div className="container ">
            <div  style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
          }}>
          {
          dataFiltered.map(item=>{
              
              return(
                  <div className="col s12 m4" key={item._id}>
                  <div className="card" style={{ margin: "30px" }} 
                  // style={{ width: "15rem;" }}
                  >
                    <img src={item.photo} className="card-img-top" alt="..." 
                  style={{height:"150px", width:"200px"}}
                    /> 
                    <div className="card-body"><center>
                    <Link to={ "/productdescription/"+item._id} >
                        <h6 className="card-title blue-text text-darken-2">{item.title}</h6>
                    </Link>
                    <h6  style={{fontSize: "20px"}}>{item.body}đ</h6>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',

                      }}>
                        
                      
                      </div>
                      </center>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        marginBottom: "20px",

                    }}>
                       <ToggleFavorite Fstate = {item.isLike} id = {item._id}/>
                      <button className="btn" name="addCart"
                        onClick={() => addToCart(item._id)}
                        >
                      <ShoppingCart style={{fontSize: "30px", margin:"0px"}}/>
                      </button>
                    </div>
                    </div>
                  </div>
                </div>
              )
          })
        }
        </div>
        </div>
        : <h2>Loading....!</h2>
          }
      <center>
          <Pagination count={Math.ceil(dataFiltered.length/12)} variant="outlined" shape="rounded" className="pagnating"/>
          
      </center>
      </div>

      
    </>
  );
};

export default Product;
