// const express = require('express');
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';


import { ENV } from './lib/env.js';

import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { connectDB } from './lib/db.js';
import cors from "cors";

const app = express();
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

//Deployment 
if (ENV.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, "../Frontend/dist");
    app.use(express.static(distPath));
    app.get('*', (_, res) => {
        res.sendFile(path.join(distPath, "index.html"));
    });
}

app.listen(PORT, () => {
    console.log('Server is running on port: ' + PORT);
    connectDB();
})