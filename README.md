# SkySmart-AI-Flight-Booking-Price-Prediction-Platform

SkySmart is an AI-powered flight booking platform that helps users search, compare, and book flights with smart price predictions, alerts, and an AI chatbot. Built with React, TypeScript, Tailwind, and Supabase for a fast, secure, and modern travel experience.

## Prerequisites

Before running the project, make sure you have the following installed:

- **Node.js** (version 16 or higher recommended)
- **npm** (comes with Node.js) or **yarn**

To check if you have Node.js installed, run:
```bash
node --version
npm --version
```

## Steps to Run the Project

### Step 1: Navigate to the Project Directory

Open your terminal/command prompt and navigate to the project folder:

```bash
cd SkysmartMega-main
```

### Step 2: Install Dependencies

Install all required packages and dependencies:

```bash
npm install
```

or

```bash
npm i
```

This will download and install all the dependencies listed in `package.json`. This may take a few minutes.

### Step 3: Start the Development Server

Run the development server:

```bash
npm run dev
```

The server will start and you should see output indicating:
- The local URL (typically `http://localhost:3000`)
- The network URL (for accessing from other devices on your network)

### Step 4: Open in Browser

The development server should automatically open your default browser to `http://localhost:3000`. If it doesn't, manually navigate to:

```
http://localhost:3000
```

## Additional Commands

### Build for Production

To create a production build:

```bash
npm run build
```

This creates an optimized build in the `build` directory.

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, Vite will automatically try the next available port (3001, 3002, etc.). Check the terminal output for the actual port number.

### Dependencies Not Installing

If you encounter issues installing dependencies:
1. Delete the `node_modules` folder (if it exists)
2. Delete `package-lock.json` (if it exists)
3. Run `npm install` again

### Server Not Starting

- Make sure you're in the correct directory (`SkysmartMega-main`)
- Ensure all dependencies are installed (`npm install`)
- Check that Node.js and npm are properly installed

## Stopping the Server

To stop the development server, press `Ctrl + C` in the terminal where it's running.
