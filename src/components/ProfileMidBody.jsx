import React, { useContext, useEffect, useState } from 'react'
import { Button, Form, Image, Nav, Row, Spinner } from 'react-bootstrap'
import ProfilePostCard from './ProfilePostCard'
import { useTheme } from './ThemeContext'
import { useDispatch, useSelector } from 'react-redux'
import { AuthContext } from './AuthProvider'
import { fetchPostsByUser, savePost } from '../features/posts/postSlice'
import { useUserAvatar } from '../hooks/useUserAvatar'

export default function ProfileMidBody({activeTab}) {
   const {isDark} = useTheme()
   const dispatch = useDispatch()
   const {currentUser} = useContext(AuthContext)
   useEffect(() => {
    dispatch(fetchPostsByUser())
   },[currentUser, dispatch])
   const allPosts = useSelector((state) => state.posts.posts)
   const posts = activeTab === 'my tweets' ? allPosts.filter((post) => post.userId === currentUser.uid) : allPosts
   const loading = useSelector((state) => state.posts.loading)
   const [postContent, setPostContent] = useState('')
   const userId = currentUser?.uid
   const username = currentUser?.email?.split('@')[0]
   const currentUserAvatar = useUserAvatar(currentUser?.uid)
   const DEFAULT_AVATAR = 'https://res.cloudinary.com/dqcztgs4v/image/upload/v1731486722/cld-sample.jpg'
   const handleSave = (e) => {
    e.preventDefault()
    dispatch(savePost({userId,postContent,username}))
    setPostContent('')
   } 

  return (
    <div className={`profile-mid-body ${isDark ? 'dark' : ''}`}>
            {/* CHANGE: Compose Tweet area */}
            {activeTab === 'All tweets' &&(
            <div className="compose-tweet p-3">
                <div className="d-flex">
                    <Image
            src={currentUserAvatar || DEFAULT_AVATAR}
            roundedCircle
            style={{ width: '45px', height: '45px', objectFit: 'cover', flexShrink: 0 }}
        />
                    <Form className="flex-grow-1" onSubmit={handleSave}>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="What's happening?"
                            value={postContent}
                            onChange={(e) => setPostContent(e.target.value)}
                            className="tweet-input border-0"
                        />
                        <div className="d-flex justify-content-end mt-3">
                            <Button 
                                type="submit" 
                                variant="primary" 
                                className="rounded-pill px-4"
                                disabled={!postContent.trim()}
                            >
                                Tweet
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
            )}

            {/* CHANGE: Feed Tabs Indicator */}
            <div className="px-3 py-2 border-bottom">
                <span className="fw-bold">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</span>
            </div>

            {/* CHANGE: Posts Feed */}
            <div className="posts-feed">
                { loading && <Spinner animation='border' variant='primary' />

                }
                {posts.map(post => (
                    <ProfilePostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
  )
}
