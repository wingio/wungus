import { Client, Message } from "discord.js";

export function run(client: Client, msg: Message, args: string[]) {
    msg.channel.send("Syncing...");
}

export const names = ["sync", "syncranks"];