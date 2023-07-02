import * as React from "react";

import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../state/user";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import PersonAdd from "@mui/icons-material/PersonAdd";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Logout from "@mui/icons-material/Logout";
import DehazeIcon from "@mui/icons-material/Dehaze";

const NavbarResponsive = () => {
  //Hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //States
  const genres = useSelector((state) => state.genres);
  const user = useSelector((state) => state.user);
  const [anchorEl, setAnchorEl] = React.useState(null);

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
      }
      navigate("/login");
    } catch (error) {
      alert("Couldn't logout ");
    }
  };

  const searchByCategoryHandler = (category) => {
    setAnchorEl(null);
    navigate(`/category/${category}`);
  };

  return (
    <div className="navbarResponsive">
      {" "}
      <React.Fragment>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            textAlign: "center",
            mt: 2.2,
          }}
        >
          <Tooltip>
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <DehazeIcon
                sx={{
                  mt: 2,
                  width: 32,
                  height: 32,
                  color: "rgb(53, 136, 230)",
                }}
              ></DehazeIcon>
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
          transformOrigin={{ horizontal: "center", vertical: "top" }}
          anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
        >
          <MenuItem readOnly>CATEGORIES</MenuItem>
          {genres
            ? genres.map((genre) => (
                <MenuItem
                  key={genre.id}
                  onClick={() => searchByCategoryHandler(genre.name)}
                >
                  {genre.name}
                </MenuItem>
              ))
            : null}
          <Divider />
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
                <MenuItem key={i} onClick={() => navigate(menu)}>
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

export default NavbarResponsive;
