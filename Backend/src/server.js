// const express = require('express');
import express from 'express';
import path from 'path';

import { ENV } from './lib/env.js';

import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { connectDB } from './lib/db.js';

const app = express();
app.use(express.json()); // to parse json data from request body
const __dirname = path.resolve();

const PORT = ENV.PORT || 3000;


app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

//Deployment 
if (ENV.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, "../Frontend/dist")));
    app.get('*', (_, res) => {
        res.sendFile(path.join(__dirname, "../Frontend/dist/index.html"));
    })
}

app.listen(PORT, () => {  
    console.log('Server is running on port: ' + PORT);
    connectDB();
})