import { Client, Message } from "discord.js";
import Command from "./Command";

export default class Sync extends Command {
    public static commandName: string = "sync";
    public static description: string = "Syncs MEE6 xp";
    public static aliases: string[] = ["syncranks"];

    public static run(client: Client, msg: Message, args: string[]) : void {
        msg.channel.send("Sync started!");
        throw new Error("Sync not implemented!");
    }
}