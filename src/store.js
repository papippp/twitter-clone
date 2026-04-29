import { configureStore } from "@reduxjs/toolkit";
import postsReducer from './features/posts/postSlice'
import usersReducer from './features/posts/usersSlice'
import followsReducer from './features/posts/followSlice'
export default configureStore({
    reducer : {
        posts : postsReducer,
        users : usersReducer,
        follows : followsReducer
    }

})