import express, { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/database.service";
import User from "../models/User";
import Logger from "../../util/Logger";
import Guild from "../models/Guild";
import Member from "../models/Member";

export const guildsRouter = express.Router();

type GuildBody = {
    name: string;
    id: string;
}

type MemberBody = {
    userId: string;
}

type XpBody = {
    xp: number;
    level: number;
    totalXp: number;
}

guildsRouter.use(express.json());

guildsRouter.use((req, res, next: NextFunction) => {
    let log = new Logger("DEBUG", req.method);
    log.info(`${req.originalUrl}`);
    next();
})

guildsRouter.get("/", async (_req: Request, res: Response) => {
    try {
       const guilds = (await collections.guilds.find({}).toArray()) as unknown as Guild[];

        res.status(200).send(guilds);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

guildsRouter.get("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;
    
    try {
        const query = { id: id };
        const guild = (await collections.guilds.findOne(query)) as unknown as Guild;

        if (guild) {
            res.status(200).send(guild);
        } else {
            res.status(404).send("Guild not found");
        }
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
});

guildsRouter.post("/:id/members", async (req: Request, res: Response) => {
    const id = req?.params?.id;
    const member = req.body as MemberBody;

    try {
        const guild = (await collections.guilds.findOne({ id: id })) as unknown as Guild;
        const query = { userId: member.userId, guildId: id };
        const mem = (await collections.members.findOne(query)) as unknown as Member;

        if(guild){
            if(mem){
                res.status(200).send(mem);
            } else {

            const result = await collections.members.insertOne({
                userId: member.userId,
                guildId: id,
                xp: 0,
                level: 0,
                totalXp: 0,
            });

            result
                ? res.status(201).send(new Member(member.userId, 0, 0, 0, id))
                : res.status(500).send("Failed to create member");
            }
        } else {
            res.status(404).send("Guild not found");
        }
    } catch (error) {
        res.status(404).send(`Unable to add member: ${member.userId}`);
    }
});

guildsRouter.get("/:id/members", async (req: Request, res: Response) => {
    const id = req?.params?.id;
    const limit = parseInt(req.query.limit?.toString());
    const page = parseInt(req.query.page?.toString());;

    try {
        const guild = (await collections.guilds.findOne({ id: id })) as unknown as Guild;
        const query = { guildId: id };
        const users = (await collections.members.find(query).sort({totalXp : -1}).toArray()) as unknown as Member[];

        if(limit && page && guild){
            const start = (page - 1) * limit;
            const end = page * limit;
            const sliced = users.slice(start, end);
            sliced.forEach(mem => {
                mem.rank = users.indexOf(mem) + 1;
            })
            res.status(200).send(sliced);
        } else {
            if (guild) {
                res.status(200).send(users);
            } else {
                res.status(404).send("Guild not found");
            }
        }
    } catch (error) {
        res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
    }
});

guildsRouter.get("/:id/members/:userid", async (req: Request, res: Response) => {
    const id = req?.params?.id;
    const userid = req?.params?.userid;

    try {
        const guild = (await collections.guilds.findOne({ id: id })) as unknown as Guild;
        const query = { guildId: id, userId: userid };
        const user = (await collections.members.findOne(query)) as unknown as Member;

        if (guild && user) {
            const rank = (await collections.members.find({ guildId: id }).sort({ totalXp: -1 }).toArray()) as unknown as Member[];
            const rankIndex = rank.findIndex(member => member.userId === userid);
            user.rank = rankIndex + 1;
            res.status(200).send(user);
        } else {
            res.status(404).send("Guild or User not found");
        }
    } catch (error) {
        res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
    }
});

guildsRouter.put("/:id/members/:userid", async (req: Request, res: Response) => {
    const id = req?.params?.id;
    const userid = req?.params?.userid;
    const body = req.body as XpBody;

    try {
        const guild = (await collections.guilds.findOne({ id: id })) as unknown as Guild;
        const query = { guildId: id, userId: userid };
        const user = (await collections.members.findOne(query)) as unknown as Member;

        if (guild && user) {
            const result = await collections.members.updateOne(query, {
                $set: {
                    xp: body.xp,
                    level: body.level,
                    totalXp: body.totalXp,
                },
            });
        
            result
                ? res.status(200).send(new Member(user.userId, body.xp, body.totalXp, body.level, id))
                : res.status(500).send("Failed to update member");
        } else {
            res.status(404).send("Guild or User not found");
        }
    } catch (error) {
        res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
    }
});

guildsRouter.post("/", async (req: Request, res: Response) => {
    
    try {
        const newGuild = req.body as GuildBody;
        const query = { id: newGuild.id };
        const guild = (await collections.guilds.findOne(query)) as unknown as Guild;
        if(guild) {
            res.status(200).send(guild);
        } else {
            const result = await collections.guilds.insertOne(new Guild(newGuild.name, newGuild.id, []));

            result
                ? res.status(201).send(new Guild(newGuild.name, newGuild.id, []))
                : res.status(500).send("Failed to add server");
        }
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
});