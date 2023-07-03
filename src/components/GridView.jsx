import React, { useState, useEffect } from "react";
import axios from "../api/instance";
import { useLocation, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { setProduct } from "../state/product";
import { setCart } from "../state/cart";
import { setGames } from "../state/games";
import Card from "../commons/Card";
import Grid from "@mui/material/Grid";
import cookie from "../hooks/cookie";

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
      axios.get("/api/games").then((res) => {
        console.log(res);
        dispatch(setGames(res));
      });
    }
    if (pathname === "search") {
      axios
        .post(
          `/api/games/search?name=${query}`,
          { token: cookie() },
          {
            withCredentials: true,
          }
        )
        .then((result) => {
          dispatch(setGames(result.data));
        });
    }
    if (pathname === "category") {
      axios
        .post(
          `/api/games/category/${category}`,
          { token: cookie() },
          {
            withCredentials: true,
          }
        )
        .then((result) => {
          dispatch(setGames(result.data));
        });
    }
  }, [pathname, category, query, dispatch]);

  const singleProductHandler = async (item) => {
    try {
      const singleProduct = await axios.get(`/api/games/${item.id}`);
      dispatch(setProduct(singleProduct.data));
      localStorage.setItem("singleProduct", JSON.stringify(singleProduct.data));
      navigate(`/products/${singleProduct.data.id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const addToCartHandler = async (item) => {
    try {
      const validate = cart.some((el) => el.id === item.id);
      if (!validate) {
        const gameToAdd = await axios.get(`/api/games/${item.id}`);

        dispatch(setCart(gameToAdd.data));

        if (user.id) {
          axios
            .post(
              `/api/cart/addItem/${user.id}/${item.id}`,
              {},
              { withCredentials: true }
            )
            .then(() => console.log("add to the cart"));
        }
      }
    } catch (error) {
      alert("Couldn't add game to cart");
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

    axios
      .post(
        `/api/games/admin/delete/${id}`,
        { token: cookie() },
        {
          withCredentials: true,
        }
      )
      .then(() => {
        axios.get("/api/games").then((res) => dispatch(setGames(res.data)));
      })
      .catch(() => {
        alert("Couldn't delete game");
      });
    navigate("/");
  };

  return (
    <div className="gridContainer">
      <h2 className="gridTitle">
        {games && games[0] ? "Games" : "No games found for this category"}
      </h2>
      {category ? <h2 className="gridSubtitle">{category}</h2> : null}
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
                singleProductHandler={singleProductHandler(game)}
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
