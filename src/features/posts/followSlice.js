import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, deleteDoc, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { db } from "../../firebase";

export const followUser = createAsyncThunk(
    'follows/followUser',
    async ({followerId, followingId}) => {
        const followId = `${followerId}_${followingId}`
        const followRef = doc(db, 'follows',followId)
        await setDoc(
            followRef, {
                followId,followingId,createdAt : new Date().toISOString()
            } )
            return {followerId, followingId}
    }
)

export const unfollowUser = createAsyncThunk(
    'follows/unfollowUser',
    async ({followerId, followingId}) => {
       try {
         const followId = `${followerId}_${followingId}`
        const followRef = doc(db, 'follows',followId)
        await deleteDoc(followRef)
        return {followerId, followingId}
       }
       catch (error) {
        console.error(error)
        throw error
       }
    }
)

export const fetchFollowData = createAsyncThunk(
    'follows/fetchFollowData',
    async (userId) => {
        const followersQuery = query(
            collection(db, 'follows'),
            where('followingId', '==', userId)
        )

        const followingQuery = query(
            collection(db, 'follows'),
            where('followerId','==',userId)
        )
        const [followerSnap, followingSnap] = await Promise.all([
            getDocs(followersQuery),
            getDocs(followingQuery)
        ])

        return {
            followers : followerSnap.docs.map(doc => doc.data().followerId),
            following : followingSnap.docs.map(doc => doc.data().followingId)
        }
    }

)

export const fetchSuggestedUsers = createAsyncThunk(
    'follows/fetchSuggestedUsers',
    async (currentUserId) => {
        try {
            const usersSnap = await getDocs(collection(db, 'bioInfo'))
            const allUsers = usersSnap.docs.map(doc => ({
                id : doc.id,
                ...doc.data()
            }))

            const followingQuery = query(
                collection(db, 'follows'),
                where('followerId', '==', currentUserId)
            )

            const followingSnap = await getDocs(followingQuery)
            const followingIds = followingSnap.docs.map(doc => doc.data().followingId)

            const suggestions = allUsers.filter(user => user.id !== currentUserId && !followingIds.includes(user.id))
            return suggestions.slice(0,3)
        }
        catch (error) {
        console.error(error)
        throw error

    } 
    }
)

const followsSlice = createSlice({
    name : 'follows',
    initialState : {
        followers : [],
        following : [],
        suggestedUsers : [],
        loading : false
    },
    reducers : {},
    extraReducers : (builder) => {
        builder
        .addCase(fetchFollowData.pending, (state) => {
            state.loading = true
        })
        .addCase(fetchFollowData.fulfilled, (state,action) => {
            state.followers = action.payload.followers
            state.following = action.payload.following
            state.loading = false
        })
        .addCase(followUser.fulfilled, (state, action) => {
            state.following.push(action.payload.followingId)
            state.suggestedUsers = state.suggestedUsers.filter(
                user => user.id !== action.payload.followingId
            )
        })
        .addCase(unfollowUser.fulfilled, (state,action) => {
            state.following = state.following.filter(id => id !== action.payload.followingId)
        })
        .addCase(fetchSuggestedUsers.fulfilled, (state, action) => {
            state.suggestedUsers = action.payload
        })
    }
})


export default followsSlice.reducer