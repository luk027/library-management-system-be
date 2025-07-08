import express from 'express'
import 'dotenv/config.js'
import { connectDB } from './config/db/connection.js';
import cookieParser from 'cookie-parser';
import {userRouter} from './routes/user.routes.js'


const app = express();
const PORT = process.env.PORT;
const MogoBD_URL = process.env.MONGO_URI;


//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("secretKey"));

//Routing
app.use('/api/user', userRouter)


//Starting the server
async function startApp() {
    await connectDB(MogoBD_URL);
    app.listen(PORT, () => {
        console.log(`Server is listenin to PORT: ${PORT}`);
    })
}

startApp();



