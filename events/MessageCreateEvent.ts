import { Client, Message } from "discord.js";
import { commands, userCache } from "..";
import { createUser } from "../util/api/APIUtils";
import { checkPermissions } from "../util/PermissionUtils";
import Event from "./Event";

export default class MessageCreateEvent extends Event {
    public static eventName: string = "messageCreate";

    public static handle(client: Client, msg : Message) {
        if(msg.author.bot) return;
        if(!userCache.has(msg.author.id)) createUser(msg.author.id, msg.author.username, msg.author.discriminator).then(user => {
            userCache.set(msg.author.id, user);
        });
        if(msg.content.startsWith("!")) {
            let args = msg.content.split(/ +/);
            let commandName = args.shift().slice(1).toLowerCase();
            let command = commands.find((r, n) => n.includes(commandName));
            if(!command) return;
            try {
                if(command.dev && msg.author.id !== "298295889720770563") return;
                if(!checkPermissions(msg.guild.me, msg.channel.id, "MANAGE_MESSAGES", "SEND_MESSAGES")) return;
                command.run(client, msg, args);
            } catch(e) {
                this.log.error("Error while running: !" + commandName, e);
            }
        }
    }
}