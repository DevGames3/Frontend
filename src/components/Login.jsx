import React from "react";
import axios from "../api/instance"
import useInput from "../hooks/useInput";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { setUser } from "../state/user";
import { importCartFromDb, importCartFromLs } from "../state/cart";
import Input from "../commons/Input";

const Login = () => {
  //Hooks
  const email = useInput();
  const password = useInput();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //Handlers and functions
  const onSubmitHandler = (e) => {
    e.preventDefault();
    axios
      .post(
        "/api/user/login",
        {
          email: email.value,
          password: password.value,
        },
        { withCredentials: true }
      )
      .then((res) => {
        console.log(res);
        dispatch(setUser(res.payload));
        localStorage.setItem("cookie", JSON.stringify(res));
        axios
          .get(
            `/api/cart/${res.payload.id}`,
            {
              withCredentials: true,
            }
          )
          .then((res) => {
            if (res.length) return dispatch(importCartFromDb(res));
            dispatch(
              importCartFromLs(JSON.parse(localStorage.getItem("cart")))
            );
          });
        navigate("/");
      });
  };

  return (
    <div className="loginConteiner">
      <form className="loginForm" onSubmit={onSubmitHandler}>
        <h3 className="registerTitle">Login</h3>
        <Input
          name="email"
          type="email"
          placeholder="Email"
          valueHandler={email}
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          valueHandler={password}
        />
        <button className="registerButton" type="submit">
          Submit
        </button>
        <div className="registerAlreadyAccount">
          <p>First time in DevGames3?</p>
          <Link className="registerLink" to="/register">
            Register
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
