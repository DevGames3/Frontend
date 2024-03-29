import React, { useEffect } from "react";
import axios from "../api/instance";
import { useSelector, useDispatch } from "react-redux";
import { setUsersDb, removeFromUsersDb, editAdmin } from "../state/usersDb";
import { message } from "antd";
import { Avatar } from "@mui/material";
import { FaTrash } from "react-icons/fa";
import UserDetails from "../commons/UserDetails";
import cookie from "../hooks/cookie";

const EditUsers = () => {
  //Hooks
  const dispatch = useDispatch();

  //States
  const usersDb = useSelector((state) => state.usersDb);
  const user = useSelector((state) => state.user);

  const otherUsers = usersDb.filter((eachUser) => user.id !== eachUser.id);

  //Handlers and functions
  useEffect(() => {
    axios
      .post(
        "/api/user/admin",
        { token: cookie() },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        dispatch(setUsersDb(res));
      });
  }, [dispatch]);

  const deleteUserHandler = (id) => {
    axios
      .post(
        `/api/user/admin/delete/${id}`,
        { token: cookie() },
        {
          withCredentials: true,
        }
      )
      .then(() => {
        dispatch(removeFromUsersDb(id));
      })

      .catch(() => {
        alert("Couldn't delete user");
      });
  };

  const editAdminHandler = (id) => {
    axios
      .put(
        `/api/user/admin/access/${id}`,
        { token: cookie() },
        {
          withCredentials: true,
        }
      )
      .then(() => {
        dispatch(editAdmin(id));
        message.success(`Admin permissions successfully modified`);
      })
      .catch((error) => {
        alert("Couldn't delete user");
      });
  };

  return (
    <div className="usersWrapper">
      <h2 className="usersTitle">Users</h2>

      {otherUsers.length ? (
        otherUsers.map((userDb) => {
          return (
            <div key={userDb.id} className="userData">
              <Avatar
                className="userAvatar"
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: "rgb(53, 136, 230)",
                }}
              ></Avatar>
              <UserDetails
                title="Fullname"
                info={`${userDb.name} ${userDb.lastName}`}
              />

              <UserDetails title="Email" info={userDb.email} />

              <FaTrash
                className="userFaTrash"
                onClick={() => deleteUserHandler(userDb.id)}
              />

              {userDb.isAdmin ? (
                <button
                  className="userButton"
                  onClick={() => editAdminHandler(userDb.id)}
                >
                  Remove from admins
                </button>
              ) : (
                <button
                  className="userButton"
                  onClick={() => editAdminHandler(userDb.id)}
                >
                  Upgrade to admin
                </button>
              )}
            </div>
          );
        })
      ) : (
        <p className="noUsers">There are no users registered</p>
      )}
    </div>
  );
};

export default EditUsers;
