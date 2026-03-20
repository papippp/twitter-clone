import React, { useState } from 'react'
import { Button, Form, Image, Nav, Row } from 'react-bootstrap'
import ProfilePostCard from './ProfilePostCard'
import { useTheme } from './ThemeContext'

export default function ProfileMidBody({activeTab}) {
   const {isDark} = useTheme()
   const [tweet, setTweet] = useState('')
    const mockPosts = [
        {
            id: 1,
            user: 'Papi',
            handle: '@papi.ppp',
            content: 'Heyy',
            date: 'Mar 16',
            likes: 24,
            replies: 3,
            retweets: 5
        },
        {
            id: 2,
            user: 'Papi',
            handle: '@papi.ppp',
            content: 'Working on my Twitter clone! 🚀',
            date: 'Mar 15',
            likes: 42,
            replies: 7,
            retweets: 12
        }
    ]

  return (
    <div className={`profile-mid-body ${isDark ? 'dark' : ''}`}>
            {/* CHANGE: Compose Tweet area */}
            <div className="compose-tweet p-3">
                <div className="d-flex">
                    <Image 
                        src="https://res.cloudinary.com/dqcztgs4v/image/upload/v1736165834/WhatsApp_Image_2025-01-06_at_7.09.10_PM_1_oqzrzf.jpg" 
                        roundedCircle 
                        className="me-3"
                        style={{ width: '50px', height: '50px' }}
                    />
                    <Form className="flex-grow-1">
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="What's happening?"
                            value={tweet}
                            onChange={(e) => setTweet(e.target.value)}
                            className="tweet-input border-0"
                        />
                        <div className="d-flex justify-content-end mt-3">
                            <Button 
                                type="submit" 
                                variant="primary" 
                                className="rounded-pill px-4"
                                disabled={!tweet.trim()}
                            >
                                Tweet
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>

            {/* CHANGE: Feed Tabs Indicator */}
            <div className="px-3 py-2 border-bottom">
                <span className="fw-bold">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</span>
            </div>

            {/* CHANGE: Posts Feed */}
            <div className="posts-feed">
                {mockPosts.map(post => (
                    <ProfilePostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
  )
}
