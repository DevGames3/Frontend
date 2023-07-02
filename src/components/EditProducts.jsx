import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import useInput from "../hooks/useInput";
import Input from "../commons/Input";
import ProductData from "../commons/ProductData.jsx";
import FormSelectBtn from "../commons/FormSelectBtn";

const EditProducts = () => {
  //States
  const [gameGenres, setGameGenres] = useState([]);
  const [gameDevelopers, setGameDevelopers] = useState([]);
  const [gamePlatforms, setGamePlatforms] = useState([]);
  const [selectedGame, setSelectedGame] = useState("");
  const genres = useSelector((state) => state.genres);
  const developers = useSelector((state) => state.developers);
  const platforms = useSelector((state) => state.platforms);

  //Hooks
  const params = useParams();
  const navigate = useNavigate();
  const name = useInput();
  const description = useInput();
  const playtime = useInput();
  const released = useInput();
  const price = useInput();
  const image = useInput();
  const tags = useInput();

  //Handlers
  useEffect(() => {
    if (params.id) {
      axios
        .get(`http://localhost:3001/api/games/${Number(params.id)}`)
        .then((res) => {
          setSelectedGame(res.data);
        });
    }
  }, [params]);

  const handleGenresChange = (event) => {
    const {
      target: { value },
    } = event;
    setGameGenres(typeof value === "string" ? value.split(",") : value);
  };

  const handleDevelopersChange = (event) => {
    const {
      target: { value },
    } = event;
    setGameDevelopers(typeof value === "string" ? value.split(",") : value);
  };

  const handlePlatformsChange = (event) => {
    const {
      target: { value },
    } = event;
    setGamePlatforms(typeof value === "string" ? value.split(",") : value);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (params.id) {
      axios
        .put(
          `http://localhost:3001/api/games/admin/edit/${params.id}`,
          {
            name: name.value,
            description: description.value,
            playtime: Number(playtime.value),
            released: released.value,
            poster: image.value,
            price: Number(price.value),
            genres: gameGenres,
            developers: gameDevelopers,
            platforms: gamePlatforms,
            //tags: [tags.value]
          },
          { withCredentials: true }
        )
        .then(() => {
          alert("Game updated successfully");
          navigate("/");
        })

        .catch(() => {
          alert("Couldn't edit game");
        });
    } else {
      axios
        .post(
          `http://localhost:3001/api/games/admin/create`,
          {
            name: name.value,
            description: description.value,
            playtime: playtime.value,
            released: released.value,
            price: price.value,
            poster: image.value,
            genres: gameGenres,
            developers: gameDevelopers,
            platforms: gamePlatforms,
            tags: tags.value,
          },
          { withCredentials: true }
        )
        .then(() => {
          alert("Game created successfully");
          navigate("/");
        })
        .catch(() => {
          alert("Couldn't edit game");
        });
    }
  };

  return (
    <div className="editProductsWrapper">
      {params.id ? (
        <div className="dataSheetWrapper">
          <p className="editProductTitle">Current information</p>
          <div className="editDataSheet">
            <ProductData
              title="Image"
              info={
                <img
                  className="editProductImg"
                  src={selectedGame.poster}
                  alt="product"
                />
              }
            />
            <ProductData title="Name" info={selectedGame.name} />
            <ProductData title="Description" info={selectedGame.description} />
            <ProductData title="Release Date" info={selectedGame.released} />
            <ProductData title="Playtime" info={selectedGame.playtime} />
            <ProductData title="Price" info="60" />
            <ProductData
              title="Genres"
              info={
                selectedGame.genres
                  ? selectedGame.genres.map((genre) => genre.name).join(", ")
                  : null
              }
            />
            <ProductData
              title="Developers"
              info={
                selectedGame.developers
                  ? selectedGame.developers
                      .map((developer) => developer.name)
                      .join(", ")
                  : null
              }
            />
            <ProductData
              title="Platforms"
              info={
                selectedGame.platforms
                  ? selectedGame.platforms
                      .map((platform) => platform.name)
                      .join(", ")
                  : null
              }
            />
            <ProductData
              title="Tags"
              info={selectedGame.tags ? selectedGame.tags.join(", ") : null}
              star
            />
          </div>
        </div>
      ) : null}

      <div className="editConteiner">
        <form className="editForm" onSubmit={onSubmitHandler}>
          {params.id ? (
            <h3 className="registerTitle">Edit product</h3>
          ) : (
            <h3 className="registerTitle">Create product</h3>
          )}
          <Input
            name="name"
            type="text"
            placeholder="Name"
            valueHandler={name}
          />
          <Input
            name="description"
            type="textarea"
            placeholder="Description"
            valueHandler={description}
          />
          <Input
            name="playtime"
            type="text"
            placeholder="Playtime"
            valueHandler={playtime}
          />
          <Input
            name="released"
            type="date"
            placeholder="Release date"
            valueHandler={released}
          />
          <Input
            name="price"
            type="number"
            placeholder="Price"
            valueHandler={price}
          />
          <Input
            name="image"
            type="text"
            placeholder="Image URL"
            valueHandler={image}
          />
          <Input
            name="tags"
            type="text"
            placeholder="Tags"
            valueHandler={tags}
          />
          <FormSelectBtn
            title={"Genres"}
            handler={handleGenresChange}
            array={genres}
            state={gameGenres}
            setState={setGameGenres}
          />
          <FormSelectBtn
            title={"Developers"}
            handler={handleDevelopersChange}
            array={developers}
            state={gameDevelopers}
            setState={setGameDevelopers}
          />
          <FormSelectBtn
            title={"Platforms"}
            handler={handlePlatformsChange}
            array={platforms}
            state={gamePlatforms}
            setState={setGamePlatforms}
          />
          <button className="registerButton" type="submit">
            {params.id ? "Change" : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProducts;
