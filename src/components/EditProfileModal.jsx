import { useContext, useEffect, useState } from 'react'
import { Button, Form, Modal, Spinner,Image } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { saveProfile } from '../features/posts/usersSlice'
import { AuthContext } from './AuthProvider'
import { uploadImageToCloudinary } from '../utils/uploadImage'

export default function EditProfileModal({show, onHide,currentProfile}) {
    const dispatch = useDispatch()
    const [bio, setBio] = useState('')
    const [location, setLocation] = useState('' )
    const [website, setWebsite] = useState('')
    const [avatarFile, setAvatarFile] = useState(null)
    const [coverFile, setCoverFile] = useState(null)
    const [avatarPreview, setAvatarPreview] = useState(null)
    const [coverPreview, setCoverPreview] = useState(null)
    const [isUploading, setIsUploading] = useState(false)
    const {currentUser} = useContext(AuthContext)

    useEffect(() => {
        if(show && currentProfile) {
            setBio(currentProfile.bio ||  '')
            setLocation(currentProfile.location || '')
            setWebsite(currentProfile.website || '')
            setAvatarPreview(currentProfile.avatarUrl || null)
            setCoverPreview(currentProfile.coverUrl || null)
        }
        if (!show) {
            setAvatarFile(null)
            setCoverFile(null)
            setAvatarPreview(null)
            setCoverPreview(null)
        }
    }, [show,currentProfile])
    
    const handleImageChange = (e, type) => {
        const file = e.target.files[0]
        if (!file) return

        const previewUrl = URL.createObjectURL(file)
        if (type === 'avatar') {
            setAvatarFile(file)
            setAvatarPreview(previewUrl)
        }
        else {
            setCoverFile(file)
            setCoverPreview(previewUrl)
        }
    }

    const handleSave = async () => {
        setIsUploading(true)
        try {
            const userId = currentUser.uid
            const email = currentUser.email
            let avatarUrl = null
            let coverUrl = null

            if (avatarFile) avatarUrl = await uploadImageToCloudinary(avatarFile)
            if (coverFile) coverUrl = await uploadImageToCloudinary(coverFile)
            dispatch(saveProfile({userId,bio, email, location,website,avatarUrl,coverUrl})) 
            onHide()
        }
        catch(error) {
            console.error('Failed to save profile',error)
        }
        finally {
            setIsUploading(false)
        }
        
    }

   
  return (
    <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
            <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className='postion-relative mb-5'>
             <div
                        style={{
                            height: '120px',
                            background: coverPreview ? `url(${coverPreview}) center/cover` : '#cfd9de',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}
                        onClick={() => document.getElementById('coverInput').click()}
                    >
                        <div className="d-flex justify-content-center align-items-center h-100">
                            <i className="bi bi-camera fs-3 text-white"></i>
                        </div>
                </div>
                <input
                 id="coverInput"
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => handleImageChange(e, 'cover')}
                    />

                      <div
                        style={{
                            position: 'absolute',
                            bottom: '-40px',
                            left: '16px',
                            cursor: 'pointer'
                        }}
                        onClick={() => document.getElementById('avatarInput').click()}
                    >
                        <div className="position-relative">
                            <Image
                                src={avatarPreview }
                                roundedCircle
                                style={{ width: '80px', height: '80px', objectFit: 'cover', border: '3px solid white' }}
                            />
                            <div
                                className="position-absolute top-50 start-50 translate-middle"
                                style={{ background: 'rgba(0,0,0,0.5)', borderRadius: '50%', padding: '6px' }}
                            >
                                <i className="bi bi-camera text-white"></i>
                            </div>
                        </div>
                        <input
                            id="avatarInput"
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={(e) => handleImageChange(e, 'avatar')}
                        />
                    </div>

            </div>
            <Form>
                <Form.Group className='mb-3'>
                    <Form.Label>Bio</Form.Label>
                    <Form.Control
                     as='textarea'
                     rows={3}
                     value={bio}
                     onChange={(e) => setBio(e.target.value)}
                     placeholder='tell us about yourself'
                     maxLength={160}
                    />
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Form.Label>Location</Form.Label>
                    <Form.Control
                     type='text'
                     value={location}
                     onChange={(e) => setLocation(e.target.value)}
                     placeholder='where are you based?'
                    />
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Form.Label>website</Form.Label>
                    <Form.Control
                    type='text'
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder='yourwebsite.com'
                    />
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant='secondary' onClick={onHide}>Cancel</Button>
            <Button variant='primary' className='rounded-pill' onClick={handleSave}>
                {isUploading ? (
                        <><Spinner size="sm" animation="border" className="me-2" />Saving...</>
                    ) : 'Save'}
            </Button>
        </Modal.Footer>

    </Modal>
  )
}
