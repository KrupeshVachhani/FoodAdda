import ConnectDB from './db/DatabaseConnection.js'
import dotenv from "dotenv";
import { app } from "./app.js";

dotenv.config({
    path: "./.env",
});
ConnectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Listening on port ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.error("Error", error);
        throw error;
    });

