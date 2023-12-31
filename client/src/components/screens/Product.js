import React from "react";
import {useState,useEffect,useContext}from 'react'
import {UserContext} from '../../App'
import { Link} from 'react-router-dom'
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
// import ListItem from '@mui/material/ListItem';
// import ReactPaginate from 'react-paginate';
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
  useEffect(()=>{
    fetch('/allfood',{
      headers:{
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      }
    }).then(res=>res.json())
    .then(result=>{
      
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
        fetch('/allfood',{
          headers:{
            "Authorization":"Bearer "+localStorage.getItem("jwt")
          }
        }).then(res=>res.json())
        .then(result=>{
          
          setData(result.foods)
        })
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
    fetch('/allfood',{
      headers:{
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      }
    }).then(res=>res.json())
    .then(result=>{
      
      setData(result.foods)
    })
    M.toast({html: "UnLike Food", classes:"#43a047 green darken-1"})
  }).catch(err=>{
    console.log(err)
})
}
const addToCart = (id)=>{
  fetch('/quickaddToCart',{
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
  
  const [foodFilter, setFoodFilter] = React.useState({
    court:"",
    type:"",
    minval:null,
    maxval:null
  });

  const [useFilter, setUseFilter] = 
  React.useState({
    court:"",
    type:"",
    minval:null,
    maxval:null
  });
 const handleApllyFilter = () => {
    setUseFilter(foodFilter)
    setPagepos(1)
 }
 const handleResetFilter = () => {
  setPagepos(1)
  setFoodFilter({
    court:"",
    type:"",
    minval:null,
    maxval:null}
  )
  setUseFilter({
    court:"",
    type:"",
    minval:null,
    maxval:null
 })
  
}
  const applyFilter = (data) => {
    var r = data
    if (useFilter.court) {
      r = r.filter((d) => d.belongTo.name.toLowerCase().includes(useFilter.court.toLowerCase()));
    }
    if (useFilter.type && useFilter.type !== "") {
      r = r.filter((d) => d.tag.includes(useFilter.type));
    }
    if (useFilter.minval) {
      r = r.filter((d) => d.price>=useFilter.minval);
    }
    if (useFilter.maxval) {
      r = r.filter((d) => d.price<=useFilter.maxval);
    }
    return r
  }
  const filterData = (query, data) => {
    query = query.toLowerCase()
    if (!query) {
      return data;
    } else {
      return data.filter((d) => d.title.toLowerCase().includes(query));
    }
  };
  const [searchQuery, setSearchQuery] = useState("");
  const dataFiltered = filterData(searchQuery,applyFilter(data));
  const courtList = [...new Set(Object.values(data).map(item => item.belongTo.name))];
  const list = () => (
    <Box
      sx={{ width: "100" }}
    > 
    <div style={{fontSize: "24px"}}>
      <div style={{margin: "20px"}}> <FilterAlt fontSize="large" /> <span> Lọc sản phẩm </span> </div>
        <div style={{margin: "15px"}} >
          <form>
          <Box >
            <FormControl variant="standard" sx={{ minWidth: 250 }}>
            <InputLabel variant="standard" > Gian hàng </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={foodFilter.court?foodFilter.court:""}
              label="type"
              onChange={(e) =>
                setFoodFilter({
                  ...foodFilter,
                  court: e.target.value
              })}
            >
             {courtList.map(court => (
                <MenuItem key={court} value={court}>
                  {court}
                </MenuItem>
              ))}
            </Select>
            </FormControl>
          </Box>  
          <Box >
            <FormControl variant="standard" sx={{ minWidth: 250 }}>
            <InputLabel variant="standard" > Loại </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={foodFilter.type?foodFilter.type:""}
              label="type"
              onChange={(e) =>
                setFoodFilter({
                  ...foodFilter,
                  type: e.target.value
              })}
            >
              <MenuItem value={"Đồ ăn"}>Đồ ăn</MenuItem>
              <MenuItem value={"Thức uống"}>Thức uống </MenuItem>
            </Select>
            </FormControl>
          </Box>
        <Divider style={{marginTop:"20px"}}/>
        <div style={{marginTop:"10px"}}> Khoảng giá </div>
        <div className="row">
        <TextField 
          InputProps={{ disableUnderline: true }} 
          id="standard-basic" 
          label="Tối thiểu" 
          name = "minval"
          variant="standard" 
          style={{width: '100px'}}
          onChange={(e) => setFoodFilter({
            ...foodFilter,
            minval: e.target.value
          })}
        />
        <CompareArrows style={{ margin: "20"}}/>
        <TextField 
          InputProps={{ disableUnderline: true }} 
          id="standard-basic" 
          label="Tối đa" 
          name = "maxval"
          variant="standard" 
          style={{width: '100px'}}
          onChange={(e) =>setFoodFilter({
            ...foodFilter,
            maxval: e.target.value
          })}
        />
          </div>
          <div className="row center">
            <Button variant="contained" onClick={handleApllyFilter}> Áp dụng </Button>
            <Button variant="contained" onClick={handleResetFilter}> Đặt lại </Button>
          </div>
        </form>
        </div>
      </div>

    </Box>
    
  );

  const [pagepos,setPagepos] = useState(1)
  const Pagebar = () => {
    //setdisplayPage(dataFiltered.slice(0,9))
    //console.log(displayPage)
    //setPagepos(1)
    function handlePage(event,page){
      //setdisplayPage(dataFiltered.slice(page*12,(page+1)*12))
      //console.log(page)
      setPagepos(page)
    }
    return (<Pagination count={Math.ceil(dataFiltered.length/9)} variant="outlined" shape="rounded" className="pagnating" onChange={handlePage}/>
    )
  }
  
  function ToggleFavorite({Fstate,id}) {
    const [favoriteState, setFavoriteState] = useState(Fstate);
    const toggleState = () => {
      if (Fstate === true){
        unlikeFood(id)
      }
      else{
        likeFood(id)
      }
      
    }

    return(
      <div
       onClick={toggleState}
        >
        {Fstate === true ? 
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
                      setPagepos(1)
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
          dataFiltered.slice((pagepos-1)*9,pagepos*9).map(item=>{
              
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
                    <h6  style={{fontSize: "20px"}}>{item.price}đ</h6>
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
                       <ToggleFavorite Fstate = {item?.isLike} id = {item._id}/>
                       <div className="texting">{item?.numLike}</div>
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
        <center>
                <Pagebar/>
              </center>
        </div>
      
        : <h2>Loading....!</h2>
          }
      
      </div>

      
    </>
  );
        
}
export default Product;
