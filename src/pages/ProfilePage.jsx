import { getAuth } from 'firebase/auth'
import { useContext, useEffect, useState } from 'react'
import { Button, Col, Container, Image, Navbar, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import '../App.css'
import { AuthContext } from '../components/AuthProvider'
import EditProfileModal from '../components/EditProfileModal'
import ProfileMidBody from '../components/ProfileMidBody'
import ProfileSideBar from '../components/ProfileSideBar'
import { useTheme } from '../components/ThemeContext'
import { fetchFollowData, fetchSuggestedUsers, followUser } from '../features/posts/followSlice'
import { fectchUserProfile } from '../features/posts/usersSlice'
export default function ProfilePage() {
    
    const auth = getAuth()
    const { currentUser } = useContext(AuthContext)
    const navigate = useNavigate()
    const { isDark, toggleTheme } = useTheme()
    const [activeTab, setActiveTab] = useState('tweets')
    const dispatch = useDispatch()
      useEffect(() => {
        if (!currentUser) {
            navigate('/')
        }
    }, [currentUser, navigate])

    const {profile} = useSelector((state) => state.users)
    const allPosts = useSelector((state) => state.posts.posts)
    const myTweetCount = allPosts.filter((post) => post.userId === currentUser?.uid).length

    const [showEditModal, setShowEditModal] = useState(false)
    const  formatJoinDate = (isoString) => {
        if (!isoString) return ''
        return new Date(isoString).toLocaleDateString('en-Us', {
            month : 'long',
            year : 'numeric'
        })
    }
   
    const displayName = currentUser?.email?.split('@')[0] || 'user'
    // Clean mock data
    // "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    // "https://res.cloudinary.com/dqcztgs4v/image/upload/v1736165834/WhatsApp_Image_2025-01-06_at_7.09.10_PM_1_oqzrzf.jpg"
    
   const {followers, following, suggestedUsers} = useSelector((state) => state.follows)
   useEffect(() => {
    if (currentUser) {
        dispatch(fetchFollowData(currentUser.uid))
    }
   },[currentUser, dispatch])
  
   useEffect(() => {
    if (currentUser) {
        dispatch(fetchSuggestedUsers(currentUser.uid))
    }
   }, [currentUser,dispatch])
    
    const handleLogout = () => auth.signOut()
     useEffect(() => {
        if (currentUser) {
            dispatch(fectchUserProfile(currentUser.uid))
            
        }
    }, [currentUser, dispatch])
    
    return (
        <div className={`profile-page ${isDark ? 'dark-theme' : ''}`}> 
            <Navbar className='profile-navbar' variant={isDark ? 'dark' : 'light'}>
                <Container>
                    <Navbar.Brand href='/' className='d-flex align-items-center'>
                        <i className='bi bi-twitter' style={{fontSize: 30, color: '#1da1f2'}}></i>
                        <span className='ms-2 d-none d-md-block fw-bold'>Twitter Clone</span>
                    </Navbar.Brand>
                    
                    <div className="d-flex gap-2">
                        <Button 
                            variant={isDark ? 'light' : 'outline-dark'}
                            onClick={toggleTheme}
                            className="rounded-pill"
                        >
                            <i className={`bi bi-${isDark ? 'sun' : 'moon-fill'}`}></i>
                            <span className="ms-2 d-none d-md-inline">
                                {isDark ? 'Light' : 'Dark'}
                            </span>
                        </Button>
                        
                        <Button 
                            variant="primary" 
                            onClick={handleLogout}
                            className="rounded-pill"
                        >
                            <i className="bi bi-box-arrow-right me-2"></i>
                            <span className="d-none d-md-inline">Logout</span>
                        </Button>
                    </div>
                </Container>
            </Navbar>

            {/* Profile Header */}
            <div className="profile-header">
                <div className="cover-photo-container">
                    <Image src={profile?.coverUrl || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"} className="cover-photo" />
                </div>
                
                <Container> 
                    <Row className="profile-info-row">
                        <Col md={8}>
                            <div className="profile-info-wrapper">
                                <div className="profile-avatar-container">
        <Image
            src={profile?.avatarUrl || 'https://res.cloudinary.com/dqcztgs4v/image/upload/v1731486722/cld-sample.jpg'}
            roundedCircle
            className="profile-avatar-large"
        />
    </div>
                                
                                <div className="profile-user-info">
                                    <h2 className="profile-name">{displayName
                                        }</h2>
                                    <p className="profile-handle">@{displayName}</p>
                                    <p className="profile-bio">{profile?.bio || 'No bio yet'}</p>
                                    
                                    <div className="profile-meta">
                                        <span className="meta-item">
                                            <i className="bi bi-geo-alt"></i> {profile?.location || 'No location yet'}
                                        </span>
                                        <span className="meta-item">
                                            <i className="bi bi-link"></i>
                                            <a href={`https://${profile?.website}`} target="_blank" rel="noopener noreferrer" className="profile-link ms-1">
                                                {profile?.website}
                                            </a>
                                        </span>
                                        <span className="meta-item">
                                            <i className="bi bi-calendar3"></i> {formatJoinDate(profile?.joinDate)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        
                        <Col md={4} className="edit-profile-col">
                            <Button onClick={() => setShowEditModal(true)} variant="outline-primary" className="edit-profile-btn">
                                <i className="bi bi-pencil me-2"></i>
                                Edit profile
                            </Button>
                        </Col>
                    </Row>

                    <Row className="profile-stats-row">
                        <Col>
                            <div className="stat-item">
                                <span className="stat-value">{following.length}</span>
                                <span className="stat-label">Following</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-value">{followers.length}</span>
                                <span className="stat-label">Followers</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-value">{myTweetCount}</span>
                                <span className="stat-label">Tweets</span>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Profile Tabs */}
            <div className="profile-tabs">
                <Container className='d-flex justify-content-center align-items-center' >
                    <div className="tabs-container">
                        {['All tweets', 'my tweets'].map(tab => (
                            <button
                                key={tab}
                                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>
                </Container>
            </div>

            {/* Main Content */}
            <Container className="mt-4">
                <Row>
                    <Col md={3}>
                        <ProfileSideBar />
                    </Col>
                    <Col md={6}>
                        <ProfileMidBody activeTab={activeTab} />
                    </Col>
                    <Col md={3} className="d-none d-md-block">
                        <div className="trends-widget">
                            <h5>Trends for you</h5>
                            <div className="trend-item">
                                <span className="trend-category">Trending in Tech</span>
                                <span className="trend-name">#ReactJS</span>
                                <span className="trend-count">12.5K Tweets</span>
                            </div>
                            <div className="trend-item">
                                <span className="trend-category">Programming</span>
                                <span className="trend-name">#JavaScript</span>
                                <span className="trend-count">25.2K Tweets</span>
                            </div>
                            <div className="trend-item">
                                <span className="trend-category">Web Development</span>
                                <span className="trend-name">#TailwindCSS</span>
                                <span className="trend-count">8.3K Tweets</span>
                            </div>
                        </div>
                        
                        <div className="follow-widget mt-3">
                            <h5>Who to follow</h5>
                            {suggestedUsers.length === 0 ? (
                                <p className='text-muted small'> No suggestions right Now</p>
                            ) : (
                                suggestedUsers.map(user => (
                                    <div key={user.id} className='follow-item'>
                                        <img
                                         src={user.avatarUrl ||  'https://res.cloudinary.com/dqcztgs4v/image/upload/v1731486722/cld-sample.jpg'}
                                          alt={user.id}            
                                          />
                                          <div className='follow-info'>
                                            <span className='follow-name'>{user.email?.split('@')[0]}</span>
                                            <span className='follow-handle'>@{user.email?.split('@')[0]}</span>
                                            </div>
                                            <Button
                                            size='sm' variant='outline-primary'
                                            className='follow-btn' onClick={() => dispatch(followUser({
                                                followerId : currentUser.uid,
                                                followingId : user.id
                                            }))}
                                            >
                                                follow
                                            </Button>
                                          

                                    </div>
                                ))
                            )}
                        </div>
                    </Col>
                </Row>
                <EditProfileModal currentProfile={profile} onHide={() => setShowEditModal(false)} show={showEditModal}/>
            </Container>
        </div>
    )
}