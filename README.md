# Crypto Mind Duel

This is a Next.js application built in Firebase Studio. It's a crypto-themed game app with two modes: Crypto Quiz and Word Scramble.

## Getting Started

The main application entry point is `src/app/page.tsx`.

## Running Locally

To run this application on your local machine, you need to have Node.js and npm installed.

First, install the project dependencies by running the following command in your terminal:

```bash
npm install
```

After the installation is complete, you need to run two separate processes in two different terminal windows.

### 1. Run the Next.js Development Server

This command starts the main application interface.

```bash
npm run dev
```

The app will be available at http://localhost:9002.

### 2. Run the Genkit AI Flows

This command starts the Genkit server, which powers the AI features like the bot difficulty adjuster.

```bash
npm run genkit:dev
```

This will start the Genkit development UI, typically on port 4000.

With both of these processes running, your app will be fully functional on your local machine.
