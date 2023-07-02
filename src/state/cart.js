import { createAction, createReducer } from "@reduxjs/toolkit";

export const importCartFromDb = createAction("IMPORT_CART_FROM_DB");
export const importCartFromLs = createAction("IMPORT_CART_FROM_LS");
export const setCart = createAction("SET_CART");
export const removeAllItems = createAction("REMOVE_ALL_ITEMS");
export const removeFromCart = createAction("REMOVE_FROM_CART");

let initialState = JSON.parse(localStorage.getItem("cart")) || [];

export default createReducer(initialState, {
  [importCartFromDb]: (state, action) => action.payload,
  [importCartFromLs]: (state, action) => (action.payload ? action.payload : []),
  [setCart]: (state, action) => [...state, action.payload],
  [removeAllItems]: (state, action) => action.payload,
  [removeFromCart]: (state, action) => {
    return state.filter((item) => item.id !== action.payload.id);
  },
});
