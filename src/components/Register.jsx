import React from "react";
import axios from "../api/instance";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import useInput from "../hooks/useInput";
import Input from "../commons/Input";

const Register = () => {
  //Hooks
  const name = useInput();
  const lastname = useInput();
  const email = useInput();
  const password = useInput();
  const navigate = useNavigate();

  //Handlers and functions
  const onSubmitHandler = (e) => {
    e.preventDefault();
    axios
      .post("/api/user/register", {
        name: name.value,
        lastName: lastname.value,
        email: email.value,
        password: password.value,
      })
      .then(() => navigate("/login"))
      .catch(() => {
        alert("Couldn't register");
      });
  };

  return (
    <div className="registerConteiner">
      <form className="registerForm" onSubmit={onSubmitHandler}>
        <h3 className="registerTitle">Register</h3>
        <Input name="name" type="text" placeholder="Name" valueHandler={name} />
        <Input
          name="lastname"
          type="text"
          placeholder="Last name"
          valueHandler={lastname}
        />
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
          <p>Do you already have an account? </p>
          <Link className="registerLink" to="/login">
            Back to login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
