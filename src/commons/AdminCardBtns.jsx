import React from "react";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const AdminCardBtns = ({
  singleGame,
  open,
  anchorEl,
  handleClose,
  handleClick,
  handleAdminNavigate,
  handleAdminDeleteProduct,
}) => {


  return (
    <div>
      <IconButton
        className="adminBtns"
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        color="primary"
        fontSize="large"
        onClick={handleClick}
        onClose={handleClose}
      >
        <EditIcon onClick={() => handleAdminNavigate(singleGame.id)} />
      </IconButton>
      <IconButton
        className="adminBtns"
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        color="primary"
        fontSize="large"
        onClick={handleClick}
        onClose={handleClose}
      >
        <DeleteIcon onClick={() => handleAdminDeleteProduct(singleGame.id)} />
      </IconButton>
    </div>
  );
};

export default AdminCardBtns;
