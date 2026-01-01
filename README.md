# KIZUNA (絆) - Relational Network

A community-focused web application built with React Router 7 that connects people who need help with those who can provide it.

## Features

- **Relational Network**: Users can create requests for help and offer support to others
- **3D Network Visualization**: Interactive Three.js scene showing community connections
- **Trust-Based System**: User verification, ratings, badges, and trust levels
- **Location-Aware**: Geographic matching for local community support
- **Real-time**: Firebase integration for live data
- **Authentication**: Secure phone + password authentication with session persistence

## Tech Stack

- React Router 7 with SSR
- Three.js (@react-three/fiber) for 3D visualization
- Firebase (Firestore, Auth, Storage)
- Framer Motion for animations
- Tailwind CSS with custom design tokens
- TypeScript

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kizuna-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

   Then edit `.env` and add your Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
   VITE_FIREBASE_DATABASE_URL=your_database_url_here
   VITE_FIREBASE_PROJECT_ID=your_project_id_here
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
   VITE_FIREBASE_APP_ID=your_app_id_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to `http://localhost:5173`

## Environment Variables

All Firebase configuration is stored in environment variables for security. Never commit your `.env` file to version control.

Required environment variables:
- `VITE_FIREBASE_API_KEY` - Firebase API key
- `VITE_FIREBASE_AUTH_DOMAIN` - Firebase auth domain
- `VITE_FIREBASE_DATABASE_URL` - Firebase database URL
- `VITE_FIREBASE_PROJECT_ID` - Firebase project ID
- `VITE_FIREBASE_STORAGE_BUCKET` - Firebase storage bucket
- `VITE_FIREBASE_MESSAGING_SENDER_ID` - Firebase messaging sender ID
- `VITE_FIREBASE_APP_ID` - Firebase app ID

## Core Routes

- `/` - Landing page
- `/home` - Main dashboard (requires authentication)
- `/network` - 3D visualization of community connections (requires authentication)
- `/requests` - Browse and create help requests (requires authentication)
- `/profile` - User management and settings (requires authentication)
- `/auth/login` - Login page
- `/auth/register` - Registration page

## Authentication

The app uses phone + password authentication with the following features:
- Session persistence across page refreshes
- "Remember Me" functionality for auto-login
- Duplicate email/phone validation during registration
- Secure credential storage

## Development

### Test Users

For development, you can use quick login buttons on the login page:
- **Alice** - Test user (Asker)
- **Bob** - Test user (Supporter)

### Building for Production

```bash
npm run build
```

### Running Production Build

```bash
npm start
```

## Security Notes

⚠️ **Important for Production:**
- Never commit `.env` file to version control
- Use environment variables for all sensitive data
- Implement proper password hashing (current implementation is for demo)
- Use HTTPS only in production
- Consider using httpOnly cookies for sensitive tokens

## License

[Your License Here]

## Contributing

[Your Contributing Guidelines Here]
