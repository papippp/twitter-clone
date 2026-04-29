import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'
import React, { useContext, useEffect, useState } from 'react'
import { Button, Col, Form, Image, Modal, Row, Alert, Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../components/AuthProvider'

export default function AuthPage() {
    const loginImage = 'https://sig1.co/img-twitter-1'
    
    // State declarations
    const [show, setShow] = useState(false)
    const [modalType, setModalType] = useState('signup')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [validated, setValidated] = useState(false)
    const [showResetModal, setShowResetModal] = useState(false)
    const [resetEmail, setResetEmail] = useState('')
    
    const navigate = useNavigate()
    const auth = getAuth()
    const { currentUser } = useContext(AuthContext)

    // Effects
    useEffect(() => {
        if (currentUser) navigate('/profile')
    }, [currentUser, navigate])

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(''), 5000)
            return () => clearTimeout(timer)
        }
    }, [error])

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(''), 3000)
            return () => clearTimeout(timer)
        }
    }, [successMessage])

    // Helper functions
    const handleShow = (type) => {
        setModalType(type)
        setShow(true)
        setError('')
        setSuccessMessage('')
        setValidated(false)
        setUsername('')
        setPassword('')
        setConfirmPassword('')
    }

    const handleClose = () => {
        setShow(false)
        setError('')
        setSuccessMessage('')
        setValidated(false)
        setUsername('')
        setPassword('')
        setConfirmPassword('')
    }

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const validatePassword = (password) => {
        const hasMinLength = password.length >= 6
        const hasUpperCase = /[A-Z]/.test(password)
        const hasLowerCase = /[a-z]/.test(password)
        const hasNumber = /[0-9]/.test(password)
        
        return {
            isValid: hasMinLength && hasUpperCase && hasLowerCase && hasNumber,
            hasMinLength,
            hasUpperCase,
            hasLowerCase,
            hasNumber
        }
    }

    const getErrorMessage = (errorCode) => {
        switch(errorCode) {
            case 'auth/invalid-email':
                return 'Please enter a valid email address.'
            case 'auth/user-not-found':
                return 'No account found with this email. Please sign up first.'
            case 'auth/wrong-password':
                return 'Incorrect password. Please try again or reset your password.'
            case 'auth/email-already-in-use':
                return 'An account already exists with this email. Please login instead.'
            case 'auth/weak-password':
                return 'Password should be at least 6 characters with uppercase, lowercase, and numbers.'
            case 'auth/too-many-requests':
                return 'Too many failed attempts. Please try again later or reset your password.'
            default:
                return 'An error occurred. Please try again.'
        }
    }

    // Event handlers
    const handleSignUp = async (e) => {
        e.preventDefault()
        setError('')
        setSuccessMessage('')
        
        const form = e.currentTarget
        if (form.checkValidity() === false) {
            e.stopPropagation()
            setValidated(true)
            return
        }

        const passwordValidation = validatePassword(password)
        if (!passwordValidation.isValid) {
            setError('Password must be at least 6 characters with uppercase, lowercase, and numbers.')
            return
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.')
            return
        }

        if (!validateEmail(username)) {
            setError('Please enter a valid email address.')
            return
        }

        setLoading(true)
        
        try {
            const res = await createUserWithEmailAndPassword(auth, username, password)
            console.log(res.user)
            setSuccessMessage('Account created successfully! Redirecting...')
            setTimeout(() => {
                handleClose()
            }, 1500)
        } catch (error) {
            setError(getErrorMessage(error.code))
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        setError('')
        setSuccessMessage('')
        
        const form = e.currentTarget
        if (form.checkValidity() === false) {
            e.stopPropagation()
            setValidated(true)
            return
        }

        if (!validateEmail(username)) {
            setError('Please enter a valid email address.')
            return
        }

        setLoading(true)
        
        try {
            await signInWithEmailAndPassword(auth, username, password)
            setSuccessMessage('Login successful! Redirecting...')
            setTimeout(() => {
                handleClose()
            }, 1000)
        } catch (error) {
            setError(getErrorMessage(error.code))
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleResetPassword = async (e) => {
        e.preventDefault()
        setError('')
        setSuccessMessage('')
        
        if (!validateEmail(resetEmail)) {
            setError('Please enter a valid email address.')
            return
        }

        setLoading(true)
        
        try {
            await sendPasswordResetEmail(auth, resetEmail)
            setSuccessMessage('Password reset email sent! Check your inbox.')
            setTimeout(() => {
                setShowResetModal(false)
                setResetEmail('')
            }, 2000)
        } catch (error) {
            setError(getErrorMessage(error.code))
        } finally {
            setLoading(false)
        }
    }

    return (
        <Row className="min-vh-100 align-items-center">
            <Col md={6} className="p-0">
                <Image 
                    src={loginImage} 
                    fluid 
                    style={{ objectFit: 'cover', height: '100vh' }}
                    alt="Twitter background"
                />
            </Col>
            <Col md={6} className='p-5'>
                <i className='bi bi-twitter' style={{ fontSize: 50, color: '#1DA1F2' }}></i>

                <p className='mt-4' style={{ fontSize: 64, fontWeight: 'bold' }}>Happening Now</p>
                <h2 className='my-4' style={{ fontSize: 31 }}>Join Twitter Today</h2>

                {/* Success Alert */}
                {successMessage && (
                    <Alert variant="success" className="rounded-pill">
                        {successMessage}
                    </Alert>
                )}

                <Col md={6} className='d-grid gap-2'>
                    <Button className='rounded-pill' variant='outline-dark'>
                        <i className='bi bi-google me-2'></i> Sign up with Google
                    </Button>

                    <Button className='rounded-pill' variant='outline-dark'>
                        <i className='bi bi-apple me-2'></i> Sign up with Apple
                    </Button>
                    
                    <div className="text-center my-2">
                        <hr className="my-0" />
                        <span className="px-2 text-muted">or</span>
                        <hr className="my-0" />
                    </div>

                    <Button 
                        onClick={() => handleShow('signup')} 
                        className='rounded-pill fw-bold'
                        style={{ backgroundColor: '#1DA1F2', border: 'none' }}
                    >
                        Create an account
                    </Button>
                    
                    <p className='text-muted small mt-2'>
                        By signing up, you agree to the Terms of Service and Privacy Policy, including Cookie Use.
                    </p>
                    
                    <p className='mt-4 fw-bold'>Already have an account?</p>
                    
                    <Button 
                        onClick={() => handleShow('login')} 
                        className='rounded-pill'
                        variant='outline-primary'
                    >
                        Sign In
                    </Button>
                </Col>
            </Col>

            {/* Auth Modal */}
            <Modal show={show} onHide={handleClose} centered size="lg">
                <Modal.Body className='p-5'>
                    {error && (
                        <Alert variant="danger" className="mb-4">
                            {error}
                        </Alert>
                    )}
                    
                    {modalType === 'signup' ? (
                        <>
                            <h2 className='mb-4' style={{ fontWeight: 'bold' }}>Create your account</h2>
                            <Form noValidate validated={validated} onSubmit={handleSignUp}>
                                <Form.Group className='mb-3'>
                                    <Form.Control 
                                        value={username} 
                                        onChange={(e) => setUsername(e.target.value)} 
                                        type='email' 
                                        placeholder='Email address'
                                        required
                                        disabled={loading}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please provide a valid email address.
                                    </Form.Control.Feedback>
                                </Form.Group>
                                
                                <Form.Group className='mb-3'>
                                    <Form.Control 
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)} 
                                        type='password' 
                                        placeholder='Password'
                                        required
                                        disabled={loading}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Password is required.
                                    </Form.Control.Feedback>
                                    <div className="small text-muted mt-1">
                                        Password must have at least 6 characters with uppercase, lowercase, and numbers.
                                    </div>
                                </Form.Group>
                                
                                <Form.Group className='mb-4'>
                                    <Form.Control 
                                        value={confirmPassword} 
                                        onChange={(e) => setConfirmPassword(e.target.value)} 
                                        type='password' 
                                        placeholder='Confirm Password'
                                        required
                                        disabled={loading}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please confirm your password.
                                    </Form.Control.Feedback>
                                </Form.Group>
                                
                                <p className='text-muted small mb-4'>
                                    By signing up, you agree to the Terms of Service and Privacy Policy, including cookie use. 
                                    PPPtweet may use your information, including your email address and phone number for 
                                    purposes outlined in our privacy policy, like keeping your account secure and personalising 
                                    our services, including ads.
                                </p>
                                
                                <Button 
                                    type="submit" 
                                    className='rounded-pill w-100 fw-bold'
                                    style={{ backgroundColor: '#1DA1F2', border: 'none' }}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Spinner as="span" animation="border" size="sm" className="me-2" />
                                            Creating Account...
                                        </>
                                    ) : (
                                        'Sign Up'
                                    )}
                                </Button>
                            </Form>
                        </>
                    ) : (
                        <>
                            <h2 className='mb-4' style={{ fontWeight: 'bold' }}>Login to your account</h2>
                            <Form noValidate validated={validated} onSubmit={handleLogin}>
                                <Form.Group className='mb-3'>
                                    <Form.Control 
                                        value={username} 
                                        onChange={(e) => setUsername(e.target.value)} 
                                        type='email' 
                                        placeholder='Email address'
                                        required
                                        disabled={loading}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please provide a valid email address.
                                    </Form.Control.Feedback>
                                </Form.Group>
                                
                                <Form.Group className='mb-4'>
                                    <Form.Control 
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)} 
                                        type='password' 
                                        placeholder='Password'
                                        required
                                        disabled={loading}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Password is required.
                                    </Form.Control.Feedback>
                                </Form.Group>
                                
                                <Button 
                                    type="submit" 
                                    className='rounded-pill w-100 fw-bold mb-3'
                                    style={{ backgroundColor: '#1DA1F2', border: 'none' }}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Spinner as="span" animation="border" size="sm" className="me-2" />
                                            Logging in...
                                        </>
                                    ) : (
                                        'Login'
                                    )}
                                </Button>
                                
                                <Button 
                                    variant="link" 
                                    className='text-decoration-none d-block text-center'
                                    onClick={() => setShowResetModal(true)}
                                >
                                    Forgot password?
                                </Button>
                            </Form>
                        </>
                    )}
                </Modal.Body>
            </Modal>

            {/* Reset Password Modal */}
            <Modal show={showResetModal} onHide={() => setShowResetModal(false)} centered>
                <Modal.Body className="p-4">
                    <h3 className="mb-3">Reset Password</h3>
                    <p className="text-muted mb-3">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                    <Form onSubmit={handleResetPassword}>
                        <Form.Group className="mb-3">
                            <Form.Control
                                type="email"
                                placeholder="Email address"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </Form.Group>
                        <Button 
                            type="submit" 
                            className="rounded-pill w-100"
                            style={{ backgroundColor: '#1DA1F2', border: 'none' }}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Spinner as="span" animation="border" size="sm" className="me-2" />
                                    Sending...
                                </>
                            ) : (
                                'Send Reset Email'
                            )}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Row>
    )
}