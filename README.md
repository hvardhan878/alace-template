# Express + React Full-Stack Application

A modern full-stack application with Express.js backend and React frontend, built with TypeScript and optimized for both development and production.

## 🚀 Development Options

### Option 1: Hot Module Replacement (Development)
```bash
npm run dev
```
- ✅ **Hot reload** for frontend development
- ✅ **Real-time updates** without full rebuilds
- ✅ **Fast development** with Vite dev server
- ✅ **API and frontend** served with proxy setup

### Option 2: Preview Built App (Like Vite Preview)
```bash
npm run preview
```
- ✅ **Serves built/optimized versions** of both frontend and backend
- ✅ **Auto-rebuilds** when you change files
- ✅ **Production-like performance** during development
- ✅ **API and frontend** served from single port (3000)
- ✅ **Built with Vite + esbuild** for maximum optimization
- 💡 **Similar to `vite preview`** but for full-stack apps

## 🛠️ Build & Production

### Build for Production
```bash
npm run build
```
Creates optimized builds in `dist/`:
- `dist/public/` - Frontend assets (HTML, CSS, JS)
- `dist/index.js` - Backend server bundle

### Start Production Server
```bash
npm start
```
Runs the built server from `dist/index.js`

## 📁 Project Structure

```
├── client/          # React frontend
├── server/          # Express backend
├── shared/          # Shared types/schemas
├── dist/            # Built output
│   ├── public/      # Frontend build
│   └── index.js     # Backend build
└── package.json
```

## 🔄 What Changed

The development workflow has been enhanced to serve **built versions** instead of development versions:

1. **New `npm run dev`** - Builds and serves optimized versions with auto-rebuild
2. **Modified server setup** - Always serves static build files instead of Vite dev server
3. **Updated paths** - Points to `dist/public` for frontend assets
4. **Added file watching** - Automatically rebuilds when source files change

## 🌐 API Endpoints

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID  
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## 🚦 Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development**
   ```bash
   npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - API: http://localhost:3000/api/users

The application will automatically rebuild when you make changes to any source files! 