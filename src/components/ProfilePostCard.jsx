import React, { useState } from 'react';
import { Row, Col, Image, Button } from 'react-bootstrap';
import { useTheme } from './ThemeContext';


export default function ProfilePostCard({ post }) {
    const { isDark } = useTheme()
    // CHANGE: Track interaction states
    const [liked, setLiked] = useState(false);
    const [retweeted, setRetweeted] = useState(false);
    
    const pic = 'https://res.cloudinary.com/dqcztgs4v/image/upload/v1736165834/WhatsApp_Image_2025-01-06_at_7.09.10_PM_1_oqzrzf.jpg';

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
                    <div className="d-flex align-items-center flex-wrap gap-2">
                        <strong className="post-author">{post.user}</strong>
                        <span className="post-handle">{post.handle}</span>
                        <span className="post-date">· {post.date}</span>
                    </div>
                    
                    <p className="post-content mt-2">{post.content}</p>
                    
                    {/* CHANGE: Interactive action buttons */}
                    <div className="post-actions d-flex justify-content-between mt-3">
                        <Button variant="link" className="action-btn">
                            <i className="bi bi-chat"></i>
                            <span className="ms-2">{post.replies}</span>
                        </Button>
                        
                        <Button 
                            variant="link" 
                            className={`action-btn ${retweeted ? 'text-success' : ''}`}
                            onClick={() => setRetweeted(!retweeted)}
                        >
                            <i className="bi bi-repeat"></i>
                            <span className="ms-2">
                                {post.retweets + (retweeted ? 1 : 0)}
                            </span>
                        </Button>
                        
                        <Button 
                            variant="link" 
                            className={`action-btn ${liked ? 'text-danger' : ''}`}
                            onClick={() => setLiked(!liked)}
                        >
                            <i className={`bi bi-heart${liked ? '-fill' : ''}`}></i>
                            <span className="ms-2">
                                {post.likes + (liked ? 1 : 0)}
                            </span>
                        </Button>
                        
                        <Button variant="link" className="action-btn">
                            <i className="bi bi-upload"></i>
                        </Button>
                    </div>
                </Col>
            </Row>
        </div>
    );
}