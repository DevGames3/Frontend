import React, { useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import stringGenerator from "../utils/stringGenerator";
import { setCart } from "../state/cart";
import { setGames } from "../state/games";
import { addReview, setReviews } from "../state/reviews";
import { TextField, Rating } from "@mui/material";
import { FaCheck } from "react-icons/fa";
import ProductData from "../commons/ProductData.jsx";
import useInput from "../hooks/useInput";
import { useEffect } from "react";
import { setAverage } from "../state/average";

const Product = () => {
  //Hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const content = useInput();
  const ratingValue = useInput();

  //States
  const product = useSelector((state) => state.product);
  const user = useSelector((state) => state.user);
  const cart = useSelector((state) => state.cart);
  const average = useSelector((state) => state.average);
  const reviews = useSelector((state) => state.reviews);
  const [active, setActive] = useState(false);
  const [userReviews, setUserReviews] = useState(true);

  //Variables
  const developerString = stringGenerator(product.developers);
  const platformString = stringGenerator(product.platforms);
  const genreString = stringGenerator(product.genres);
  const tagString = product.tags.join(", ");

  //Handlers and functions

  useEffect(() => {
    axios
      .get(`https://devgames3-b95m.onrender.com/api/review/${product.id}`)
      .then((res) => {
        console.log("revieewwsss", res.data);
        dispatch(setReviews(res.data));
      });
  }, [dispatch, product.id]);

  const getAllReviewsOfAUserOrAllReviews = (userName) => {
    userReviews ? setUserReviews(false) : setUserReviews(true);
    if (userReviews)
      axios
        .get(
          `https://devgames3-b95m.onrender.com/api/review/${product.id}/${userName}`,
          {
            withCredentials: true,
          }
        )
        .then((res) => dispatch(setReviews(res.data)));
    else {
      axios
        .get(`https://devgames3-b95m.onrender.com/api/review/${product.id}`, {
          withCredentials: true,
        })
        .then((res) => {
          console.log("revieewwsss", res.data);
          dispatch(setReviews(res.data));
        });
    }
  };
  const buyHandler = () => {
    const validate = cart.some((el) => el.id === product.id);
    if (user && !validate) {
      dispatch(setCart(product));
    }
    navigate(user ? "/cart" : "/login");
  };

  const addToCartHandler = () => {
    const validate = cart.some((el) => el.id === product.id);
    if (!validate) {
      dispatch(setCart(product));
      if (user.id) {
        axios
          .post(
            `https://devgames3-b95m.onrender.com/api/cart/addItem/${user.id}/${product.id}`,
            {},
            { withCredentials: true }
          )
          .then(() => {
            "ready";
          })
          .catch((error) => {
            alert("Couldn't add to cart");
          });
      }
    }
  };

  const handleAdminNavigate = (item) => {
    navigate(`/edit/products/${item.id}`);
  };

  const handleAdminDeleteProduct = (item) => {
    axios
      .delete(
        `https://devgames3-b95m.onrender.com/api/games/admin/delete/${item.id}`,
        {
          withCredentials: true,
        }
      )
      .then(() => {
        axios
          .get("https://devgames3-b95m.onrender.com/api/games")
          .then((res) => dispatch(setGames(res.data)));
      })
      .catch(() => {
        alert("Couldn't delete game");
      });
    navigate("/");
  };

  const showReviewsHandler = () =>
    active ? setActive(false) : setActive(true);

  const reviewSubmitHandler = (e) => {
    e.preventDefault();
    axios
      .post(
        `https://devgames3-b95m.onrender.com/api/review/${product.id}/${user.id}`,
        {
          content: content.value,
          rating: Number(ratingValue.value),
        }
      )
      .then((res) => {
        dispatch(
          addReview({
            id: res.data.review.id,
            content: res.data.review.content,
            rating: res.data.review.rating,
            user: res.data.user,
          })
        );
        content.value = "";
      });
  };

  useEffect(() => {
    axios
      .get(`https://devgames3-b95m.onrender.com/api/review/${product.id}`)
      .then((res) => {
        const averageArray = res.data.map((review) => review.rating);
        const average =
          averageArray.reduce((acc, num) => (acc += num)) / averageArray.length;
        console.log("averageArray", averageArray);
        console.log("average", average);
        dispatch(setAverage(average));
      });
  }, [dispatch, product.id]);

  return (
    <div className="mainConteiner">
      <div className="upperConteiner">
        <div className="productImage">
          <img src={product.poster} alt="game" />
        </div>
        <div className="lowerWrapper">
          <div className="productTitleRating">
            <h2 className="productTitle">{product.name}</h2>
            <Rating
              className="productRating"
              value={average}
              precision={0.5}
              readOnly
              size="large"
            />
          </div>
          <p className="productDescription">{product.description}</p>
          <div className="productReviewsRating">
            <p className="productReviewsTitle">
              {reviews.length
                ? (reviews.length,
                  (<span onClick={showReviewsHandler}>Show reviews</span>))
                : " There are no reviews for this game."}
            </p>
          </div>
          {active ? (
            reviews.map((review) => (
              <div className="productUsersReviews">
                <p className="usersReviewsDetails">
                  <span
                    onClick={() =>
                      getAllReviewsOfAUserOrAllReviews(review.user.name)
                    }
                  >
                    {review.user.name}
                  </span>{" "}
                  {review.user.lastName}:
                </p>
                <p className="usersReviewsContent">{review.content}</p>
                <p className="usersReviewsContent">
                  Rate given: {review.rating}
                </p>
              </div>
            ))
          ) : (
            <></>
          )}

          {user.id ? (
            <form className="textFieldForm" onSubmit={reviewSubmitHandler}>
              <TextField
                className="productTextField"
                color="primary"
                focused
                multiline
                required
                placeholder="your review..."
                sx={{
                  "& .MuiOutlinedInput-input": {
                    color: "#fff",
                  },
                }}
                id="outlined-controlled"
                label="Add a review and a rate"
                {...content}
              />
              <div className="poductMyRates">
                <p>Rate:</p>
                <Rating
                  required
                  {...ratingValue}
                  precision={0.5}
                  size="small"
                />
              </div>
              <button className="textFieldButton" type="submit">
                Send
              </button>
            </form>
          ) : null}
        </div>
      </div>

      <div className="lowerConteiner">
        <div className="productSidebar">
          <div className="productDataSheet">
            <ProductData title="Release Date" info={product.released} />
            <ProductData title="Developers" info={developerString} />
            <ProductData title="Playtime" info={product.playtime} />
            <ProductData title="Platforms" info={platformString} />
            <ProductData title="Genres" info={genreString} />
            <ProductData title="Tags" info={tagString} />
          </div>

          <div className="productButtonsWrapper">
            {user.isAdmin ? (
              <>
                <button
                  className="productButton"
                  onClick={() => handleAdminNavigate(product)}
                >
                  Edit
                </button>
                <button
                  className="productButton"
                  onClick={() => handleAdminDeleteProduct(product)}
                >
                  Delete
                </button>
              </>
            ) : (
              <>
                <button className="productButton" onClick={buyHandler}>
                  Buy
                </button>
                <button className="productButton" onClick={addToCartHandler}>
                  {cart.some((el) => el.id === product.id) ? (
                    <FaCheck />
                  ) : (
                    "Add to cart"
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
