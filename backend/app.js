import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import messageRoutes from './routes/messageRoutes.js';

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    }),
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('API is running....');
});
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/msg', messageRoutes);

export { app };