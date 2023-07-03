import "./App.css";
import axios from "./api/instance";
import { useEffect } from "react";
import { Routes, Route } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setProduct } from "./state/product";
import { setUser } from "./state/user";
import { setGenres } from "./state/genres";
import { setDevelopers } from "./state/developers";
import { setPlatforms } from "./state/platforms";
import { importCartFromLs, importCartFromDb } from "./state/cart";
import {
  Home,
  Navbar,
  Register,
  Login,
  Product,
  Cart,
  EditProducts,
  EditCategories,
  EditUsers,
  History,
  Settings,
} from "../src/utils/index";

function App() {
  //Hooks
  const dispatch = useDispatch();

  //States
  const cart = useSelector((state) => state.cart);
  const product = useSelector((state) => state.product);
  const user = useSelector((state) => state.user);

  //Handlers and functions
  useEffect(() => {
    dispatch(setProduct(JSON.parse(localStorage.getItem("singleProduct"))));
    if (!user.id) {
      const cookie = JSON.parse(localStorage.getItem("cookie"));
      if (cookie) dispatch(setUser(cookie.payload));
    }
    axios.get("/api/genres/", { withCredentials: true }).then((res) => {
      dispatch(setGenres(res.data));
    });
    axios.get("/api/developers/", { withCredentials: true }).then((res) => {
      dispatch(setDevelopers(res.data));
    });
    axios.get("/api/platforms/", { withCredentials: true }).then((res) => {
      dispatch(setPlatforms(res.data));
    });

    if (user.id) {
      axios
        .get(`/api/cart/${user.id}`, {
          withCredentials: true,
        })
        .then((res) => dispatch(importCartFromDb(res.data)));
    } else {
      dispatch(importCartFromLs(JSON.parse(localStorage.getItem("cart"))));
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("product", JSON.stringify(product));
  }, [product]);

  return (
    <div className="appContainer">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products/:id" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/shopping history" element={<History />} />
        <Route path="/create/products" element={<EditProducts />} />
        <Route path="/edit/products/:id" element={<EditProducts />} />
        <Route path="/edit/users" element={<EditUsers />} />
        <Route path="/edit/categories" element={<EditCategories />} />
        <Route path="/search" element={<Home />} />
        <Route path="/category/:category" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  );
}

export default App;
