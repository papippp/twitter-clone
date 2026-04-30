import React, { useContext, useState } from 'react';
import { Row, Col, Button, Image } from 'react-bootstrap';
import { useTheme } from './ThemeContext';
import EditPostModal from './EditPostModal';
import { AuthContext } from './AuthProvider';
import { useDispatch, useSelector} from 'react-redux';
import { deletePost, likePost, removeLikeFromPost } from '../features/posts/postSlice';
import { useUserAvatar } from '../hooks/useUserAvatar';
import { followUser, unfollowUser } from '../features/posts/followSlice';

const DEFAULT_AVATAR = 'https://res.cloudinary.com/dqcztgs4v/image/upload/v1731486722/cld-sample.jpg'

export default function ProfilePostCard({ post }) {
    const { isDark } = useTheme()

    // CHANGE: Track interaction states       
    
    const [showModal, setShowModal] = useState(false)
    const handleShow = () => setShowModal(true)
    const handleClose = () => setShowModal(false)
    const {currentUser} = useContext(AuthContext)
    const dispatch = useDispatch()
    const {following} = useSelector((state) => state.follows)
    const isFollowing = following.includes(post.userId)
    const isOwnPost = post.userId === currentUser?.uid
    const handleFollow = () => {
        if (isFollowing) {
            dispatch(unfollowUser({followerId : currentUser.uid, followingId : post.userId}))
        }
        else {
            dispatch(followUser({followerId : currentUser.uid , followingId : post.userId}))
        }
    }
    const authorAvatar = useUserAvatar(post.userId)

    const handleDelete = () => {
        if (window.confirm('are you sure you want to delete this posts'))
        dispatch(deletePost({userId : currentUser?.uid,postId : post.id}))
        }
    
    const hasLikes = post.likes?.length > 0
    const isLikedIt = post.likes?.includes(currentUser?.uid)
    const handleLike = () => {
        if(isLikedIt) {
            dispatch(removeLikeFromPost({userId: currentUser.uid, postId : post.id}))
        }
        else {
            dispatch(likePost({userId : currentUser.uid, postId : post.id}))
        }
    }
     const formatDate = (isoString) => {
        if (!isoString) return ''
        const date = new Date(isoString)
        const now = new Date()
        const diffInSeconds = Math.floor((now -date) / 1000)

        if (diffInSeconds < 60) return 'just now'
         if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

     }

    return (
        <div className={`post-card p-3 ${isDark ? 'dark' : ''}`}>
            <Row>
                {/* CHANGE: Better column sizing */}
                
                
                <Col xs={10} md={10} lg={11}>
                    {/* CHANGE: Better header layout */}
                     <div className="flex-shrink-0">
                                            <Image 
                                                src={authorAvatar || DEFAULT_AVATAR }
                                                roundedCircle 
                                                className="post-avatar"
                                                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                            />
                                        </div>
                    <p className="fw-bold mb-0">@{post.username}</p>
                    <p className="post-content mt-2">{post.content}</p>
                    <small className="text-muted">{formatDate(post.createdAt)}</small>
                    
                    {/* CHANGE: Interactive action buttons */}
                    <div className="post-actions d-flex flex-wrap justify-content-center align-items-center">
                        {post.userId === currentUser?.uid &&(
                        <Button onClick={handleShow} variant="link" className="action-btn">
                            <i className="bi bi-pencil"></i>                            
                        </Button>
                        )}
                        { post.userId === currentUser?.uid &&(
                        <Button 
                            variant="link" 
                            className={'action-btn text-success'}
                            onClick={handleDelete}
                        >
                            <i className="bi bi-trash"></i>
                            <span className="d-none d-sm-inline ms-1">Delete</span>
                            
                        </Button>
                        )}
                        <Button 
                            variant="link" 
                            className={`action-btn ${hasLikes ? 'text-danger' : 'text-muted'}`}
                            onClick={handleLike}
                           
                        >
                            <i className={`bi ${hasLikes ? 'bi-heart-fill' : 'bi-heart'} `}></i>
                            <span className='ms-1'>{post.likes?.length || 0}</span>
                            
                        </Button>
                        
                        
                        { !isOwnPost && (
                            <Button onClick={handleFollow} variant='link' className={`action-btn ${isFollowing ? 'text-primary' : 'text-muted'}`}>
                                <i className={`bi ${isFollowing ? 'bi-person-check-fill' : 'bi-person-plus'}`}></i>
        <span className='d-none d-sm-inline ms-1'>{isFollowing ? 'Following' : 'Follow'}</span>
                            </Button>
                        )

                        }
                    </div>
                </Col>
            </Row>
            <EditPostModal postId={post.id} show={showModal} handleClose={handleClose}  />
        </div>
    );
}