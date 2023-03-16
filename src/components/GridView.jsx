import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { setProduct } from "../state/product";
import { setCart } from "../state/cart";
import { setGames } from "../state/games";
import Card from "../commons/Card";
import Grid from "@mui/material/Grid";

const GridView = () => {
  //Hooks
  const location = useLocation();
  const { category } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //States
  const games = useSelector((state) => state.games);
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user);
  const query = useSelector((state) => state.searchQuery);
  const [anchorEl, setAnchorEl] = useState(null);

  //Variables
  const open = Boolean(anchorEl);
  const pathname = location.pathname.split("/")[1];

  //Handlers and functions
  useEffect(() => {
    if (pathname === "") {
      axios.get("http://localhost:3001/api/games").then((res) => {
        dispatch(setGames(res.data));
      });
    }
    if (pathname === "search") {
      axios
        .get(`http://localhost:3001/api/games/search?name=${query}`, {
          withCredentials: true,
        })
        .then((result) => {
          console.log(result);
          dispatch(setGames(result.data));
        });
    }
    if (pathname === "category") {
      axios
        .get(`http://localhost:3001/api/games/category/${category}`, {
          withCredentials: true,
        })
        .then((result) => {
          console.log(result);
          dispatch(setGames(result.data));
        });
    }
  }, [pathname, category, query]);

  const singleProductHandler = (item) => {
    axios.get(`http://localhost:3001/api/games/${item.id}`).then((res) => {
      console.log("producto", res.data);
      dispatch(setProduct(res.data));
      localStorage.setItem("singleProduct", JSON.stringify(res.data));
      navigate(`/products/${res.data.id}`);
    });
  };

  const addToCartHandler = (item) => {
    const validate = cart.some((el) => el.id === item.id);
    if (!validate) {
      axios.get(`http://localhost:3001/api/games/${item.id}`).then((res) => {
        dispatch(setCart(res.data));        
      }).then(()=> user.id ? axios.post(`http://localhost:3001/api/cart/addItem/${user.id}/${item.id}`, { } , {withCredentials : true}).then((res)=> console.log(res)) : null)
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    anchorEl === event.currentTarget
      ? setAnchorEl(null)
      : setAnchorEl(event.currentTarget);
  };

  const handleAdminNavigate = (id) => {
    setAnchorEl(null);
    navigate(`/edit/products/${id}`);
  };

  const handleAdminDeleteProduct = (id) => {
    setAnchorEl(null);
    console.log(id);
    axios
      .delete(`http://localhost:3001/api/games/admin/delete/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        axios.get("http://localhost:3001/api/games").then((res) => {
          dispatch(setGames(res.data));
        });
        navigate("/");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="gridContainer">
      <h2 className="gridTitle">
        {games && games[0] ? "Games" : "No games found for this category"}
      </h2>
      <Grid container rowSpacing={6} columnSpacing={5}>
        {games.map((game) => {
          return (
            <Grid key={game.id} item s={12} sm={6} md={6} lg={6} xl={3}>
              <Card
                singleGame={game}
                cart={cart}
                user={user}
                open={open}
                anchorEl={anchorEl}
                singleProductHandler={singleProductHandler}
                addToCartHandler={addToCartHandler}
                handleClose={handleClose}
                handleClick={handleClick}
                handleAdminNavigate={handleAdminNavigate}
                handleAdminDeleteProduct={handleAdminDeleteProduct}
              />
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export default GridView;
