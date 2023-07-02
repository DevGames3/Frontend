import React, {useEffect} from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setShoppingHistory } from "../state/shoppingHistory";

const History = () => {
  //Hooks
  const dispatch= useDispatch();

  //States
  const user = useSelector((state) => state.user);
  const shoppingHistory = useSelector((state) => state.shoppingHistory);
  
  //Variables
  const title = shoppingHistory[0] ? `${user.name}'s shopping history` : `Your shopping history is empty`;

  useEffect(()=>{
    if(user.id){
      axios.get(`https://devgames3-b95m.onrender.com/api/cart/history/${user.id}`).then((res)=> dispatch(setShoppingHistory(res.data)))
    }
  }, [dispatch,user.id])


  return (
    <div className="cartContainer">
      <h1 className="HistoryTitle">{user.name ? title : `Login to see your shopping history`}</h1>
      {shoppingHistory.length ? shoppingHistory.map((item) => (
        <div className="cartViewWrapper">
          <img className="cartImg" src={item.poster} alt="product" />
          <div className="cartInfoWrapper">
            <div className="cartInfoTop">
              <p className="cartTitle">{item.name}</p>
              <p className="cartTitle">{new Date (item.createdAt.slice(0,10)).toDateString()}</p>
              <p className="cartPrice" >
                $USD {item.price} 
              </p>
            </div>
            <div className="cartInfoBottom">
              <p className="cartExtraInfo">
               Tags: {item.tags.join(", ")}
              </p>
            </div>
          </div>
        </div>
      )) : null}
    </div>
  );
};

export default History;
