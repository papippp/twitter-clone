import React, { useContext, useState } from 'react';
import { Row, Col, Image, Button } from 'react-bootstrap';
import { useTheme } from './ThemeContext';
import EditPostModal from './EditPostModal';
import { AuthContext } from './AuthProvider';
import { useDispatch } from 'react-redux';
import { deletePost } from '../features/posts/postSlice';


export default function ProfilePostCard({ post }) {
    const { isDark } = useTheme()
    // CHANGE: Track interaction states
       
    const pic = 'https://res.cloudinary.com/dqcztgs4v/image/upload/v1736165834/WhatsApp_Image_2025-01-06_at_7.09.10_PM_1_oqzrzf.jpg';
    const [showModal, setShowModal] = useState(false)
    const handleShow = () => setShowModal(true)
    const handleClose = () => setShowModal(false)
    const {currentUser} = useContext(AuthContext)
    const userId = currentUser?.uid
    const dispatch = useDispatch()
    const handleDelete = () => {
      if ( window.confirm('are you sure you want to delete this posts'))
        dispatch(deletePost({userId : currentUser?.uid,postId : post.id}))
    }
    return (
        <div className={`post-card p-3 ${isDark ? 'dark' : ''}`}>
            <Row>
                {/* CHANGE: Better column sizing */}
                <Col xs={2} md={2} lg={1}>
                    <Image 
                        src={pic} 
                        fluid 
                        roundedCircle 
                        className="post-avatar"
                    />
                </Col>
                
                <Col xs={10} md={10} lg={11}>
                    {/* CHANGE: Better header layout */}
                    
                    
                    <p className="post-content mt-2">{post.content}</p>
                    
                    {/* CHANGE: Interactive action buttons */}
                    <div className="post-actions d-flex justify-content-between mt-3">
                        <Button onClick={handleShow} variant="link" className="action-btn">
                            <i className="bi bi-pencil"></i>                            
                        </Button>
                        
                        <Button 
                            variant="link" 
                            className={'action-btn text-success'}
                            onClick={handleDelete}
                        >
                            <i className="bi bi-trash"></i>
                            
                        </Button>
                        
                        <Button 
                            variant="link" 
                            className={`action-btn  text-danger`}
                           
                        >
                            <i className={`bi bi-heart `}></i>
                            
                        </Button>
                        
                        <Button variant="link" className="action-btn">
                            <i className="bi bi-upload"></i>
                        </Button>
                    </div>
                </Col>
            </Row>
            <EditPostModal postId={post.id} show={showModal} handleClose={handleClose} userId={userId} />
        </div>
    );
}