import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

export const fetchPostsByUser = createAsyncThunk(
    'posts/fecthByUser',
    async (userId) => {
        try {
            const postRef = collection(db, `users/${userId}/posts`)
            const querySnapShot = await getDocs(postRef)
            const docs = querySnapShot.docs.map((doc) => ({
                id : doc.id,
                ...doc.data()
            }))
            return docs
        }

        catch (error) {
            console.error(error)
            throw error
        }
    }
)

export const savePost = createAsyncThunk(
    'posts/savePost',
    async({userId, postContent}) => {
        try {
            const postRef = collection(db, `users/${userId}/posts`)
            console.log(`users/${userId}/posts`)
            const newRef = doc(postRef)
            console.log(postContent)
            
            await setDoc(newRef, {content : postContent, likes: []})
            const newPost = await getDoc(newRef)

            const post = {
                id : newPost.id,
                ...newPost.data()
            }
            return post
        }

        catch(error) {
            console.error(error)
            throw error
        }
    }
)

export const EditPost = createAsyncThunk(
    'posts/editPost',
    async({userId, postId, updatedContent}) => {
        try {
            const postRef = doc(db, `users/${userId}/posts/${postId}`)
            const docSnap = await getDoc(postRef)
            if (docSnap.exists()) {
                await updateDoc(postRef, {
                    content : updatedContent
                })
                const updatedDoc = await getDoc(postRef)
                const updatedPost = {
                    id : updatedDoc.id, 
                    ...updatedDoc.data()
                }
                return updatedPost
            } else {
                throw  Error('post does not exist')
            }
        }
        catch (error) {
            console.error(error)
            throw  error
        }
    }
)

export const deletePost = createAsyncThunk(
    'post/deletePost',
    async ({userId, postId}) => {
       try{ const postRef = doc(db, `users/${userId}/posts/${postId}`)
       const docSnap = await getDoc(postRef)
       if (docSnap.exists()) {
        await deleteDoc(postRef)
       }
       return {userId, postId}

       }
       catch (error) {
        console.error(error)
        throw Error('post does not exist')
       }
    }

)



export const likePost = createAsyncThunk(
    'posts/likePost',
    async({userId, postId}) => {
        try {
            const postRef = doc (db, `users/${userId}/posts/${postId}`)
            const docSnap = await getDoc(postRef)
            if (docSnap.exists()) {
                const postData = docSnap.data()
                const likes = [...postData.likes, userId]
                await setDoc(postRef, {...postData, likes})   
            }
            return {userId, postId}
        }

        catch (error) {
            console.error(error)
            throw error
        }
    }
)

export const removeLikeFromPost = createAsyncThunk(
    'post/removeLikeFromPost',
    async({userId, postId}) => {
        try {
            const postRef = doc(db, `users/${userId}/posts/${postId}`)
            const docSnap = await getDoc(postRef)

            if(docSnap.exists()) {
                const postData = docSnap.data()
                const likes = postData.likes.filter((id) => id !== userId)

                await setDoc(postRef, {...postData, likes})
            }
            return {userId, postId}
        }
        catch (error) {
            console.error(error)
            throw error
        }
    }
)

const postsSlice = createSlice({
    name : 'posts',
    initialState : {posts : [], loading : true},
    reducers : {},
    extraReducers : (builder) => {
        builder
        .addCase(fetchPostsByUser.fulfilled, (state, action) => {
            state.posts = action.payload
            state.loading = false
        })
        .addCase(savePost.fulfilled, (state,action) => {
            state.posts = [action.payload, ...state.posts]
        })
        .addCase(EditPost.fulfilled, (state, action) => {
            const updatedPost = action.payload
            const index = state.posts.findIndex((post) => post.id === updatedPost.id)
            if (index !== -1) {
                state.posts[index] = updatedPost
            }
        })
        .addCase(likePost.fulfilled, (state, action) => {
            const {userId, postId} = action.payload
            const postIndex = state.posts.findIndex((post) => post.id === postId)
            if (postIndex !== -1) {
                state.posts[postIndex].likes.push(userId)
            }
        })
        .addCase(deletePost.fulfilled, (state, action) => {
            const {postId} = action.payload
            state.posts = state.posts.filter((post) => post.id !== postId)
        })
        .addCase(removeLikeFromPost.fulfilled, (state,action) => {
            const {userId, postId} = action.payload
            const postIndex = state.posts.findIndex((post) => post.id === postId)
            if (postIndex !== -1) {
                state.posts[postIndex].likes = state.posts[postIndex].likes.filter(
                    (id) => id !== userId
                )
            }
        })
    }
})

export default postsSlice.reducer