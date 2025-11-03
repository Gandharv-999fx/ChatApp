// const express = require('express');
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';


import { ENV } from './lib/env.js';
import { app, server } from './lib/socket.js'

import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { connectDB } from './lib/db.js';
import cors from "cors";


app.use(express.json({ limit: "5mb" })); // to parse json data from request body
app.use(cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
}));
app.use(cookieParser()); // to parse cookies from request headers


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = ENV.PORT || 3000;


app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Health check endpoint for deployment monitoring
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        environment: ENV.NODE_ENV 
    });
});

server.listen(PORT, () => {
    console.log('Server is running on port: ' + PORT);
    connectDB();
})