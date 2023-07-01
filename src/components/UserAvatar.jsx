import * as React from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../state/user";
import { removeAllItems } from "../state/cart";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Logout from "@mui/icons-material/Logout";
import { FaUserAlt } from "react-icons/fa";

const UserAvatar = () => {
  //Hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //States
  const [anchorEl, setAnchorEl] = React.useState(null);
  const user = useSelector((state) => state.user);

  //Variables
  const open = Boolean(anchorEl);
  const isAdminMenu = [
    "Create products",
    "Edit categories",
    "Edit users",
    "Orders",
  ];
  const userMenu = ["Shopping history", "Settings"];

  //Handlers and functions
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAdminActions = (type) => {
    setAnchorEl(null);
    navigate(type === "products" ? `/create/${type}` : `/edit/${type}`);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAccess = async () => {
    try {
      setAnchorEl(null);
      if (user.id) {
        localStorage.clear();
        dispatch(setUser({}));
        dispatch(removeAllItems([]));
      }
      navigate("/login");
    } catch (error) {
      alert("Couldn't logout");
    }
  };

  return (
    <div className="navbarUserAvatar">
      <React.Fragment>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            textAlign: "center",
            mt: 2.2,
          }}
        >
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: "rgb(53, 136, 230)",
                }}
              >
                {user.name ? user.name.charAt(0) : <FaUserAlt />}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          {user?.isAdmin
            ? isAdminMenu.map((menu, i) => (
                <MenuItem
                  key={i}
                  onClick={() => handleAdminActions(menu.split(" ")[1])}
                >
                  {menu}
                </MenuItem>
              ))
            : user.name
            ? userMenu.map((menu, i) => (
                <MenuItem
                  key={i}
                  onClick={() => navigate(menu.toLocaleLowerCase())}
                >
                  <ListItemIcon>
                    <PersonAdd fontSize="small" />
                  </ListItemIcon>
                  {menu}
                </MenuItem>
              ))
            : null}

          <MenuItem onClick={handleAccess}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            {user.id ? "Logout" : "Login"}
          </MenuItem>
        </Menu>
      </React.Fragment>
    </div>
  );
};

export default UserAvatar;
