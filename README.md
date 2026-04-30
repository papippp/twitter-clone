# PPPTweet — Twitter Clone
 
A full-stack social media application built with React, Firebase, and Redux Toolkit. Supports real-time posting, follow/unfollow, likes, image uploads, dark mode, and user profiles.

**Live Demo:** (https://twitter-clone-loiw.vercel.app)
----
## screenshots

[Auth Page]

<img width="1266" height="649" alt="image" src="https://github.com/user-attachments/assets/0de6f56d-15e8-4d83-b51a-d685188bd602" />

[User Profile Bio]

<img width="1329" height="584" alt="image" src="https://github.com/user-attachments/assets/354d5707-51d2-4613-b902-b62130f8fbba" />

[feeds]
<img width="1324" height="622" alt="image" src="https://github.com/user-attachments/assets/19059d7b-2b39-4409-bb13-066ba684b741" />

[dark mode]
<img width="1318" height="594" alt="image" src="https://github.com/user-attachments/assets/66abc307-4552-4e62-a21c-8881d09e4693" />

## Features
 
- **Authentication** — Email/password signup and login with Google OAuth, password reset via email, and real-time error feedback
- **Tweet Feed** — Create, edit, and delete tweets with real-time updates across all users
- **Likes** — Like and unlike any post with atomic Firestore operations to prevent data conflicts
- **Follow System** — Follow and unfollow other users with live follower/following counts on your profile
- **User Profiles** — Custom avatar, cover photo, bio, location, and website — all editable
- **Image Uploads** — Profile and cover photos uploaded to Cloudinary with preview before saving
- **Dark Mode** — Full dark/light theme toggle persisted to localStorage
- **Who to Follow** — Dynamic suggestions of users you haven't followed yet
- **Relative Timestamps** — Posts show "just now", "2m ago", "3h ago" or a full date
- **Responsive Design** — Works on mobile, tablet, and desktop
---

## Tech Stack
 
| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6 |
| State Management | Redux Toolkit |
| Backend/Database | Firebase Firestore |
| Authentication | Firebase Auth |
| Image Storage | Cloudinary |
| Styling | Bootstrap 5, Bootstrap Icons, Custom CSS |
| Deployment | Vercel |
 
---

## Architecture Decisions
 
**Why Redux Toolkit?**
The app has shared state across many components — posts, likes, follow counts, profile data. Redux gives a single source of truth so any component can read or update data without prop drilling.
 
**Why Firebase Firestore?**
Firestore's real-time capabilities and flexible document model fit social media data well. Security rules restrict writes so users can only edit their own data.
 
**Why Cloudinary?**
Firebase Storage requires more setup and billing configuration. Cloudinary has a generous free tier and a simple REST upload API that works well with unsigned upload presets.
 
**Atomic like operations**
Likes use Firestore's `arrayUnion` and `arrayRemove` instead of read-then-write, preventing race conditions when multiple users like a post simultaneously.
 
---

 
## Project Structure
 
```
src/
├── components/
│   ├── AuthProvider.jsx       # Firebase auth context
│   ├── ThemeContext.jsx       # Dark/light mode context
│   ├── ProfilePostCard.jsx    # Individual post with like/follow/edit/delete
│   ├── ProfileMidBody.jsx     # Tweet feed + compose area
│   ├── ProfileSideBar.jsx     # Navigation sidebar
│   ├── EditPostModal.jsx      # Edit tweet modal
│   └── EditProfileModal.jsx   # Edit profile modal with image upload
├── features/
│   └── posts/
│       ├── postSlice.js       # Posts CRUD + likes
│       ├── usersSlice.js      # User profile data
│       └── followSlice.js     # Follow/unfollow + suggestions
├── hooks/
│   └── useUserAvatar.js       # Fetches any user's avatar by userId
├── pages/
│   ├── AuthPage.jsx           # Login + signup page
│   └── ProfilePage.jsx        # Main profile + feed page
├── utils/
│   └── uploadImage.js         # Cloudinary upload helper
├── firebase.js                # Firebase config
└── store.js                   # Redux store
```
 
---

## Getting Started
 
### Prerequisites
 
- Node.js 18+
- A Firebase project with Firestore and Authentication enabled
- A Cloudinary account with an unsigned upload preset

### Installation
 
```bash
# Clone the repository
git clone https://github.com/papippp/twitter-clone.git
cd twitter-clone
 
# Install dependencies
npm install
```
 
### Environment Variables
 
Create a `.env` file in the root directory:
 
```env
VITE_API_KEY=your_firebase_api_key
VITE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_PROJECT_ID=your_project_id
VITE_STORAGE_BUCKET=your_project.appspot.com
VITE_MESSAGING_SENDER_ID=your_sender_id
VITE_APP_ID=your_app_id
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```
 
### Firebase Setup
 
Enable the following in your Firebase project:
- **Authentication** → Email/Password and Google providers
- **Firestore Database** → with these security rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{postId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    match /bioInfo/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /follows/{followId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```
 
### Run Locally
 
```bash
npm run dev
```
 
---
 
## Deployment
 
This app is deployed on Vercel. To deploy your own:
 
1. Push to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Add all environment variables in Vercel project settings
4. Deploy
---

## What I Learned
 
- Tracing data flow from write to read to catch silent bugs (typos in field names cause no errors but wrong behavior)
- Using atomic Firestore operations (`arrayUnion`, `arrayRemove`) for concurrent-safe updates
- Separating Firestore security rules by operation type (`read`, `create`, `update`, `delete`) for fine-grained control
- Managing global state with Redux Toolkit across a multi-user app
- Structuring a React project with custom hooks, slices, and context for maintainability
---
 
## Roadmap
 
- [ ] Comments on posts
- [ ] Real-time notifications
- [ ] Search users and posts
- [ ] Retweet / repost
- [ ] Direct messages
---
 
## Author
 
**Your Name**
- Twitter/X: [@lukzy40](https://twitter.com/lukzy40)
- LinkedIn: (https://www.linkedin.com/in/lukmon-daramola-a6604a2a7/)
- GitHub: [@papippp](https://github.com/papippp)

- 
## License
 
MIT
 
