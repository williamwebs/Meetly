# Meetly  
**Instant video calls, zero friction**

Meetly is a modern web application that enables instant 1-on-1 and group video calls with minimal setup. Users can see who’s online and start a call immediately - no complex onboarding, no unnecessary steps.

Built with **Next.js**, Meetly focuses on speed, simplicity, and a smooth real-time communication experience.

---

## Live Demo

**Live Project:** https://meetly-z166.onrender.com  
*(Deployed on Render)*

---

## Project Overview

Meetly is designed to remove friction from video communication. Instead of scheduling links or navigating multiple screens, users can instantly start or receive calls when others are online.

Key goals of the project:
- Instant call initiation
- Simple and intuitive UI
- Real-time communication
- Scalable architecture for future features

---

## Features

- Instant incoming & outgoing video calls  
- Group call user selection  (future update) 
- Incoming call notifications (modal-based)  
- Accept / reject call actions 
- Mute / unmute & camera controls 
- Online user presence indicator  
- Clean, modern UI with Shadcn UI & Tailwind  
- Zero-friction user experience  

---

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **UI:** Tailwind CSS, Shadcn UI
- **Icons:** Lucide React
- **State Management:** React hooks / context
- **Real-time Communication:**  
  - WebRTC  
  - `simple-peer` (WebRTC abstraction)
- **Deployment:** Render
- **Package Manager:** pnpm

---

## Installation Guide

### 1. Clone the repository
```bash
git clone https://github.com/williamwebs/Meetly.git
cd meetly
```

### 2. Install dependencies
```bash
pnpm install
```

### 3. Environment variables
Create a .env.local file and add the variables
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
```

### 4. Edit the scripts in package.json file to look like this:
```bash
"scripts": {
    "dev": "node server.js",
    "build": "next build",
    "start": "NODE_ENV=production node server.js",
    "nodemon": "nodemon server.js",
    "lint": "biome check",
    "format": "biome format --write"
  }
  ```

### 5. Run the project
To start the development server using nodemon:
```bash
pnpm run nodemon
```
The app will be available at:
```bash
http://localhost:3000
```

---

## WebRTC & simple-peer

Meetly uses WebRTC for real-time peer-to-peer video communication.

To simplify WebRTC complexity, the project leverages simple-peer, which:
- Handles SDP exchange
- Manages ICE candidates
- Simplifies peer connection logic

This allows faster development while maintaining reliable video and audio streams.

--- 

## Deployment
The application is deployed on Render.

### Deployment steps:

- Push code to GitHub
- Connect repository to Render
- Set environment variables
- Build and deploy automatically

### Live URL:
https://meetly-z166.onrender.com

---

## Future improvements
- Group calls
- Screen sharing

---

## Contributing
Contributions are welcome.

- Fork the repository
- Create a new branch
- Make your changes
- Submit a pull request

---

## Author
William Anaza

Frontend Engineer

Building modern, real-time web experiences.