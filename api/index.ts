import express, { NextFunction } from "express";
import Logger from "../util/Logger";
import User from "./models/User";
import { guildsRouter } from "./routes/guilds.router";
import { usersRouter } from "./routes/users.router";
import { collections, connectToDatabase } from "./services/database.service"

const app = express()
const port = 3000
connectToDatabase()
    .then(() => {
        app.use("/users", usersRouter);
        app.use("/guilds", guildsRouter);

        app.listen(port, () => {
            console.log(`Server started at http://localhost:${port}`);
        });
    })
    .catch((error: Error) => {
        console.error("Database connection failed", error);
        process.exit();
    });