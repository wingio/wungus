import { Client, Message } from "discord.js";
import Command from "./Command";

export default class God extends Command {
    public static commandName: string = "god";
    public static description: string = "God";
    public static aliases: string[] = ["worship"];

    public static run(client: Client, msg: Message, args: string[]) : void {
        msg.channel.send("For I am the lord your God.");
    }
}