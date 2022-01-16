import express, { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/database.service";
import User from "../models/User";
import Logger from "../../util/Logger";

export const usersRouter = express.Router();

usersRouter.use(express.json());

usersRouter.use((req, res, next: NextFunction) => {
    let log = new Logger("DEBUG", req.method);
    log.info(`${req.originalUrl}`);
    next();
})

usersRouter.get("/", async (_req: Request, res: Response) => {
    try {
       const users = (await collections.users.find({}).toArray()) as unknown as User[];

        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

usersRouter.post("/", async (req: Request, res: Response) => {
    
    try {
        const newUser = req.body as User;
        const query = { userId: newUser.userId };
        const user = (await collections.users.findOne(query)) as unknown as User;
        if(user) {
            res.status(200).send(user);
            return;
        }

        const result = await collections.users.insertOne(newUser);

        result
            ? res.status(201).send(`Successfully added new user: ${newUser.username}`)
            : res.status(500).send("Failed to create user");
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
});

usersRouter.get("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        
        const query = { userId: id };
        const user = (await collections.users.findOne(query)) as unknown as User;

        if (user) {
            res.status(200).send(user);
        } else {
            res.status(404).send("User not found");
        }
    } catch (error) {
        res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
    }
});

usersRouter.put("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const updatedUser: User = req.body as User;
        const query = { userId: id };
      
        const result = await collections.users.updateOne(query, { $set: updatedUser });

        result
            ? res.status(200).send(updatedUser)
            : res.status(304).send(`User with id: ${id} not updated`);
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});