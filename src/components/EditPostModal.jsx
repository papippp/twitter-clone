import { useEffect, useState } from "react";
import { useTheme } from "./ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Image, Modal } from "react-bootstrap";
import { EditPost } from "../features/posts/postSlice";

export default function EditPostModal({ show, handleClose, postId }) {
    const { isDark } = useTheme();
    
    const [postsContent, setPostsContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const postToEdit = useSelector((state) => 
        state.posts.posts.find((post) => post.id === postId)
    );

    const dispatch = useDispatch();

    // Reset form whenever the modal opens or postId changes
    useEffect(() => {
        if (show && postToEdit) {
            console.log('Loading content for edit:', postToEdit.content);
            setPostsContent(postToEdit.content || '');
        } else if (!show) {
            // Optional: clear when closed
            setPostsContent('');
        }
    }, [show, postToEdit]);   // ← Important: depend on show + postToEdit

    const handleModalClose = () => {
        setPostsContent('');
        handleClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!postsContent.trim() || isSubmitting || !postId ) return;

        setIsSubmitting(true);
        try {
            const result = await dispatch(EditPost({ 
            
                postId, 
                updatedContent: postsContent 
            })).unwrap();

            console.log('Edit successful:', result);
            handleModalClose();   // Use the cleared version
        } catch (error) {
            console.error('Failed to edit post:', error);
            // Optionally show toast/error message to user
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal 
            show={show} 
            onHide={handleModalClose} 
            centered
            className={`edit-post-modal ${isDark ? 'dark' : ''}`}
        >
            <Modal.Header closeButton className={`border-0 pb-0 ${isDark ? 'bg-dark text-light' : ''}`}>
                <Modal.Title className="fs-5">Edit Your Tweet</Modal.Title>
            </Modal.Header>
            
            <Modal.Body className={`${isDark ? 'bg-dark text-light' : ''}`}>
                <div className="d-flex gap-3">
                    
                    <div className="flex-grow-1">
                        <Form onSubmit={handleSubmit}>
                            <Form.Control
                                as="textarea"
                                value={postsContent}
                                onChange={(e) => setPostsContent(e.target.value)}
                                rows={4}
                                placeholder="What's happening?"
                                className={`border-0 p-0 fs-5 ${isDark ? 'bg-dark text-light' : ''}`}
                                style={{ resize: 'none', outline: 'none', boxShadow: 'none' }}
                                autoFocus
                            />
                            
                            <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                                <div className="d-flex gap-3">
                                    {/* your action buttons */}
                                </div>
                                
                                <Button 
                                    type="submit" 
                                    variant="primary" 
                                    className="rounded-pill px-4"
                                    disabled={isSubmitting || !postsContent.trim()}
                                >
                                    {isSubmitting ? 'Saving...' : 'Save'}
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}