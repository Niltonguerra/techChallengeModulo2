import { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../index";
import { getPosts, setPosts as setPostsAction } from "./postSlice";
import type { Post } from "../../types/post";

export function usePosts() {
  const dispatch = useAppDispatch();
  const posts = useAppSelector(getPosts);

  const setPosts = useCallback((list: Post[]) => {
    dispatch(setPostsAction(list));
  }, [dispatch]);

  return useMemo(
    () => ({ posts, setPosts }),
    [posts, setPosts]
  );
}
