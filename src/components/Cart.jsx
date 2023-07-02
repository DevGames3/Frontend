import React from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { removeFromCart, removeAllItems } from "../state/cart";
import { FaTrash } from "react-icons/fa";

const Cart = () => {
  //Hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //States
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user);


  //Variables
  const total = cart.reduce((acc, el) => acc + el.price, 0);

  //Handlers
  const deleteItemHandler = (item) => {
    dispatch(removeFromCart(item));
    if (user.id) {
      axios
        .post(
          `http://localhost:3001/api/cart/removeItem/${user.id}/${item.id}`,
          {},
          { withCredentials: true }
        )
        .then((res) => console.log(res));
    }
  };

  const purchaseHandler = () => {
    if (!user.name) return navigate("/login");
    if (user.id) {
      axios
        .post(
          `http://localhost:3001/api/cart/purchase/${user.id}`,
          {},
          { withCredentials: true }
        )
        .then((res) => {
          dispatch(removeAllItems([]));
        });
    }
  };

  return (
    <div className="cartContainer">
      {cart.length ? <h2 className="cartTitleMain"> Your cart</h2> : null}
      {cart.map((item) => (
        <div className="cartViewWrapper">
          <img className="cartImg" src={item.poster} alt="product" />
          <div className="cartInfoWrapper">
            <div className="cartInfoTop">
              <p className="cartTitle">{item.name}</p>
              <p className="cartPrice" onClick={() => deleteItemHandler(item)}>
                USD {item.price} <FaTrash className="trash" />
              </p>
            </div>
            <div className="cartInfoBottom">
              <p className="cartExtraInfo">Tags: {item.tags.join(", ")}</p>
            </div>
          </div>
        </div>
      ))}
      {cart[0] ? (
        <div className="cartCheckoutWrapper">
          <p className="cartCheckoutData">Checkout</p>
          <p className="cartCheckoutData">Total: USD {total} </p>

          <button className="cartCheckoutButton" onClick={purchaseHandler}>
            Purchase
          </button>
        </div>
      ) : (
        <div className="cartNoGames">
          <h2 className="noGamesTitle">Your cart is empty</h2>
        </div>
      )}
    </div>
  );
};

export default Cart;
