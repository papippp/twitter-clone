import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {  doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
 
export const fectchUserProfile = createAsyncThunk(
    'bioInfo/profie',
    async(userId) => {
        try {
            const docRef = doc(db,'bioInfo',userId)
            const docSnap= await getDoc(docRef)
            if (docSnap.exists()) {
                return {id : docSnap.id, ...docSnap.data()}
            }
            
            return null
        }
        catch (error) {
            console.error(error)
            throw error
        }
    }
)



export const saveProfile = createAsyncThunk(
    'bioInfo/saveProfile',
    async({userId,bio,location ,email,website,avatarUrl, coverUrl}) => {
        try {
            const docRef = doc(db, 'bioInfo',userId)
            const updates = {bio, location, website, email : email, joinDate : new Date().toISOString()}
            if (avatarUrl) updates.avatarUrl = avatarUrl
            if (coverUrl) updates.coverUrl = coverUrl
            await setDoc(docRef,updates, {merge : true})
            const updated = await getDoc(docRef)
            return {id : updated.id, ...updated.data()}
    
        }

        catch(error) {
            console.error(error)
            throw error
        }
    }
)
const usersSlice = createSlice({
    name : 'bioInfo',
    initialState : {profile: null, loading: true},
    reducers : {},
    extraReducers : (builder) => {
        builder
        .addCase(fectchUserProfile.fulfilled, (state, action) => {
            state.profile = action.payload
            state.loading = false
        })
        .addCase(saveProfile.fulfilled,(state, action) => {
            state.profile = action.payload
        })
        
    }
})

export default usersSlice.reducer