import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";

export function useUserAvatar (userId) {
    const [avatarUrl, setAvatarUrl] = useState(null)

    useEffect(() => {
        if (!userId) return
        const fetchAvatar = async () => {

            try {
                const docRef = doc(db, 'bioInfo', userId)
                const docSnap = await getDoc(docRef)
                if (docSnap.exists()) {
                    setAvatarUrl(docSnap.data().avatarUrl || null)
                }
              
            }
              catch (error) {
                    console.error('failed to fetch avatar:', error)
                }
        }
        fetchAvatar()
    },[userId])
    return avatarUrl
}