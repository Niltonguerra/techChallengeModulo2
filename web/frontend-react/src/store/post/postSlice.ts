import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Post } from "../../types/post";

const initialState: Post[] = [];

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    // main setter
    setPosts: (_state, action: PayloadAction<Post[]>) => action.payload,
  },
});

export const { setPosts } = postSlice.actions;
export default postSlice.reducer;

// main getter
export const getPosts = (state: { posts: Post[] }) => state.posts;
