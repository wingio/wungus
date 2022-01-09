import { Client, Message } from "discord.js";

export function run(client: Client, msg: Message, args: string[]) {
    msg.channel.send("Syncing...");
}

export const names = ["sync", "syncranks"];
export const description = "Sync your server with MEE6 ranks.";
export const dev = false;