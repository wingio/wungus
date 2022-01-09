import { Client, Message } from "discord.js";
import Logger from "../util/Logger";

export default class Command {
    public static commandName: string;
    public static description: string;
    public static log: Logger = new Logger("DEBUG");
    public static aliases: string[];

    public run(client: Client, msg: Message, args: string[]) {};
}