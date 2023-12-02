import React from 'react'
import {useState,useEffect,useContext}from 'react'
import {UserContext} from '../../App'
import { Link} from 'react-router-dom'
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
// import ListItemButton from '@material-ui/core/ListItemButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import FilterAlt from '@mui/icons-material/FilterAlt'
import CompareArrows from '@mui/icons-material/CompareArrows'
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import M from 'materialize-css'



const Home=()=> {
   const [data,setData]=useState([])
   const {state,dispatch}=useContext(UserContext)
   useEffect(()=>{
    fetch('/allpost',{
      headers:{
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      }
    }).then(res=>res.json())
    .then(result=>{
      console.log(result)
      setData(result.posts)
     })
   },[])

   const likePost = (id)=>{
    fetch('/like',{
        method:"put",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")
        },
        body:JSON.stringify({
            postId:id
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
      setData(newData)
      M.toast({html: "Add To Cart", classes:"#43a047 green darken-1"})
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
          postId:id
      })
  }).then(res=>res.json())
  .then(result=>{
    const newData = data.map(item=>{
        if(item._id==result._id){
            return result
        }else{
            return item
        }
    })
    setData(newData)
  }).catch(err=>{
    console.log(err)
})
}
const addToCart = (id)=>{
//   fetch('/addCart',{
//       method:"put",
//       headers:{
//           "Content-Type":"application/json",
//           "Authorization":"Bearer "+localStorage.getItem('jwt')
//       },
//       body:JSON.stringify({
//           CartId:id
          
//       })
//   }).then(res=>res.json())
//   .then(res=>res.json())
//   .then(result=>{
//     const newData = data.map(item=>{
//         if(item._id==result._id){
//             return result
//         }else{
//             return item
//         }
//     })
//     setData(newData)
//   }).catch(err=>{
//     console.log(err)
// })
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
    sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : "100" }}
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

var tData = data
const [searchQuery, setSearchQuery] = useState("");
const dataFiltered = filterData(searchQuery, data);



//make a delete post
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
          {[
            <span style={{fontSize: "20px",color: "black"}}>
              Lọc sản phẩm
            </span>   
          ].map((anchor) => (
            <React.Fragment key={anchor}>
              <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button>
              <SwipeableDrawer
                anchor={'left'}
                open={drawerState[anchor]}
                onClose={toggleDrawer(anchor, false)}
                onOpen={toggleDrawer(anchor, true)}
              >
                {list(anchor)}
              </SwipeableDrawer>
            </React.Fragment>
          ))}
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
                      <h6 className="card-title">{item.title}</h6>
                      <h6 className="">{item.body}đ</h6>
                      
                      </center>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',

                    }}>
                        <Link to={ "/productdescription/"+item._id} >
                    <button className="btn waves-effect #e65100 lightblue darken-4 btn-medium" type="submit" name="action">More Details
                      </button>
                    </Link>
                      <button className="btn  " type="submit" name="addToCart"
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

      </div>
    </>
  )
}

export default Home