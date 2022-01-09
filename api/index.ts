import express, { NextFunction } from "express";
import Logger from "../util/Logger";
import { usersRouter } from "./routes/users.router";
import { connectToDatabase } from "./services/database.service"

const app = express()
const port = 3000
connectToDatabase()
    .then(() => {
        app.use("/users", usersRouter);

        app.listen(port, () => {
            console.log(`Server started at http://localhost:${port}`);
        });
    })
    .catch((error: Error) => {
        console.error("Database connection failed", error);
        process.exit();
    });