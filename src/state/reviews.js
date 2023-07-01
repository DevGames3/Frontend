import { createAction, createReducer } from "@reduxjs/toolkit";

export const setReviews = createAction("SET_REVIEWS");
export const addReview = createAction("ADD_REVIEW")

const initialState = [];

export default createReducer(initialState, {
  [setReviews]: (state, action) => action.payload,
  [addReview]: (state,action)=> [...state].concat(action.payload)
});
