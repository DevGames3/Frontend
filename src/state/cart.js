import { createAction, createReducer } from "@reduxjs/toolkit";

export const setCart = createAction("SET_CART");

const initialState = [];

export default createReducer(initialState, {
  [setCart]: (state, action) => [...state, action.payload]
});
