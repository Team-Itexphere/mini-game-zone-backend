import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from 'cors';
import dotenv from 'dotenv';

import { createServer } from 'http';

// import PostMessage from './models/room.js';

import userRoutes from './routes/user.route.js';
import gameRoutes from './routes/game.route.js';

dotenv.config(); // PORT and MONGO URL in the .env folder

const app = express();
const server = createServer(app);


app.use(bodyParser.json({ limit: "30mb", extended: true })); //for send over req
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use('/user', userRoutes);
app.use('/game', gameRoutes);

app.get('/', (req, res) => {
    res.send('Hello mini game zone')
});

// const CONNECTION_URL = 'mongodb+srv://admin:Abcd1234@cluster001.h7uda.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
// const CONNECTION_URL = 'mongodb+srv://user:user123@cluster001.n4vq0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const PORT = process.env.PORT || 5000;

// http://localhost:5000/game/comment get post
// http://localhost:5000/game

mongoose.connect(process.env.CONNECTION_URL).then(() => server.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
    .catch((error) => console.log(error.message));