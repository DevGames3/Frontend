import React from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import useInput from "../hooks/useInput";
import Input from "../commons/Input";
import cookie from "../hooks/cookie";
import { setUser } from "../state/user";

const Settings = () => {
  const dispatch = useDispatch();

  //Hooks
  const navigate = useNavigate();
  const name = useInput();
  const lastName = useInput();
  const email = useInput();
  const password = useInput();

  console.log(cookie());

  //Handlers and functions
  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();

      const updateInfo = await axios.put(
        "https://devgames3-b95m.onrender.com/api/user/me/edit",
        verifyData({
          token: cookie(),
          name: name.value,
          lastName: lastName.value,
          email: email.value,
          password: password.value,
        }),
        { withCredentials: true }
      );
      localStorage.setItem("cookie", JSON.stringify(updateInfo.data));
      console.log(updateInfo)

      dispatch(setUser(updateInfo.data.payload));
      alert("Updated successfuly");
      navigate("/");
    } catch (error) {
      alert("Could't update your info");
    }
  };

  const verifyData = (data) => {
    const dataV = {};
    for (const verifierD in data) {
      if (data[verifierD]) {
        dataV[verifierD] = data[verifierD];
      }
    }
    return dataV;
  };

  return (
    <div style={{ marginTop: "15vh" }}>
      <form className="registerForm" onSubmit={onSubmitHandler}>
        <h3 className="registerTitle">Update your personal info</h3>
        <Input
          name="name"
          type="text"
          placeholder="New name"
          valueHandler={name}
        />
        <Input
          name="lastname"
          type="text"
          placeholder="New last name"
          valueHandler={lastName}
        />
        <Input
          name="email"
          type="email"
          placeholder="New email"
          valueHandler={email}
        />
        <Input
          name="password"
          type="password"
          placeholder="New password"
          valueHandler={password}
        />
        <button className="registerButton" type="submit">
          Update
        </button>
      </form>
    </div>
  );
};

export default Settings;
