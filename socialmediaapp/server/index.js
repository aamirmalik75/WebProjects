import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from 'cors'
import dotenv from 'dotenv'
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from 'path';
import { fileURLToPath } from "url";
import { register } from "./Controllers/auth.js";
import { createPost } from './Controllers/posts.js'
import authRoutes from './routes/auth.js'
import usersRoutes from './routes/users.js'
import postRoutes from './routes/posts.js'
import { verifyToken } from "./middleware/auth.js";

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
app.use(cors());
app.use(morgan('common'));
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use("/assets", express.static(path.join(__dirname, "public/assets")))

/* FILE STORAGE */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({ storage });

/* ROUTES WITH FILES */
app.post('/auth/register', upload.single('picture'), register);
app.post('/posts', verifyToken, upload.single('picture'), createPost);

/* ROUTES */
app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/posts', postRoutes)

/* DATABASE SETUP */
const PORT = process.env.PORT || 4000;
const Url = process.env.MONGODB_URL || 'mongodb://localhost:27017/SocialMedia';
console.log(Url);

mongoose.connect(Url)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server on Port: ${PORT}`)
        })
    })
    .catch(err => console.log(`${err} not connected`))