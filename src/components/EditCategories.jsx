import React from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import useInput from "../hooks/useInput";
import { setGenres, addGenres, deleteGenres } from "../state/genres";
import ProductData from "../commons/ProductData.jsx";
import { FaTrash } from "react-icons/fa";

const EditCategories = () => {
  //Hooks
  const newCategory = useInput();
  const editedCategory = useInput();
  const oldCategory = useInput();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //States
  const genres = useSelector((state) => state.genres);

  //Handlers
  const createOnSubmitHandler = (e) => {
    e.preventDefault();

    axios
      .post(
        "https://devgames3-b95m.onrender.com/api/genres/create",
        { name: newCategory.value },
        { withCredentials: true }
      )
      .then(() => {
        dispatch(addGenres(newCategory.value));
        newCategory.value = "";
        navigate("/edit/categories");
      })
      .catch(() => {
        alert("Couldn't create category");
        navigate("/");
      });
  };

  const editOnSubmitHandler = (e) => {
    e.preventDefault();
    axios
      .put(
        `https://devgames3-b95m.onrender.com/api/genres/edit/${oldCategory.value}`,
        { name: editedCategory.value },
        { withCredentials: true }
      )
      .then(() => {
        axios
          .get("https://devgames3-b95m.onrender.com/api/genres/", {
            withCredentials: true,
          })
          .then((updateGenres) => {
            dispatch(setGenres(updateGenres.data));
            editedCategory.value = "";
            oldCategory.value = "";
          })
          .catch(() => {
            alert("Could't update category");
            navigate("/");
          });
      });
  };

  const handleAdminDeleteCategory =  (id) => {
    axios
      .delete(`https://devgames3-b95m.onrender.com/api/genres/${id}`, {
        withCredentials: true,
      })
      .then(() => {
        dispatch(deleteGenres(id));
        navigate("/edit/categories");
      })
      .catch(() => {
        alert("Could't delete category");
        navigate("/");
      });
  };

  return (
    <div className="editProductsWrapper">
      <div className="categoriesDataSheetWrapper">
        <p className="categoriesTitle">Current categories</p>

        {genres?.map((genre, i) => (
          <div className="categories">
            <ProductData info={genre.name ? genre.name : genre} />
            <FaTrash onClick={() => handleAdminDeleteCategory(genre.id)} />
          </div>
        ))}
      </div>

      <div className="editConteiner">
        <form
          className="editCategoriesForm"
          id="editCategoriesForm"
          onSubmit={createOnSubmitHandler}
        >
          <h3 className="registerTitle">Create categories</h3>

          <div className="formInline">
            <input
              className="editCategoriesInput"
              name="name"
              type="text"
              placeholder="New categorie"
              {...newCategory}
            />
          </div>

          <button className="editCategoriesButton" type="submit">
            Create
          </button>
        </form>
        <form
          className="editCategoriesForm"
          id="editCategoriesForm"
          onSubmit={editOnSubmitHandler}
        >
          <h3 className="registerTitle">Edit categories</h3>
          <div className="formColumn">
            <input
              className="editCategoriesInput"
              name="name"
              type="text"
              placeholder="Categorie to update"
              {...oldCategory}
            />
            <input
              className="editCategoriesInput"
              name="name"
              type="text"
              placeholder="Categorie updated"
              {...editedCategory}
            />
          </div>
          <button className="editCategoriesButton" type="submit">
            Edit
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCategories;
