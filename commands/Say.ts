import { Client, Message } from "discord.js";
import { checkPermissions } from "../util/PermissionUtils";

export function run(client: Client, msg: Message, args: string[]) {
    
    msg.channel.send(args.join(" "));
    msg.delete();
}

export const names = ["say", "echo"];
export const description = "Sync your server with MEE6 ranks.";
export const dev = true;