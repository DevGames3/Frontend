import React from "react";
import Input from "../commons/Input";
import useInput from "../hooks/useInput";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router";

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
      .post("http://localhost:3001/api/user/register", {
        name: name.value,
        lastName: lastname.value,
        email: email.value,
        password: password.value,
      })
      .then(() => {
        navigate("/login");
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
