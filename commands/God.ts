import { Client, Message } from "discord.js";

export function run(client: Client, msg: Message, args: string[]) {
    msg.channel.send("For I am the lord your God.");
}

export const names = ["god", "worship"];
export const description = "Worship the God of the universe.";