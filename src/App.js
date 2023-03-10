import "./App.css";
import axios from "axios"
import {useEffect} from "react";
import { Routes, Route } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { setProduct } from "./state/product";
import { setUser} from "./state/user";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Login from "./components/Login";
import Product from "./components/Product";
import Cart from "./components/Cart"

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  useEffect(()=>{  
    dispatch(setProduct(JSON.parse(localStorage.getItem("singleProduct"))));
    axios.get("http://localhost:3001/api/user/me", {withCredentials:true}).then(res=> res.data).then(data=> dispatch(setUser(data)))
    console.log(user)
  }, [])


  return (
    <div className="appContainer">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products/:id" element={<Product />} />
        <Route path="/cart" element={<Cart /> } /> 
      </Routes>
    </div>
  );
}

export default App;
