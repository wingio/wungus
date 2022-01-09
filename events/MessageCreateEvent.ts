import { Client, Message } from "discord.js";
import commands from "..";
import Event from "./Event";

export default class MessageCreateEvent extends Event {
    public static eventName: string = "messageCreate";

    public static handle(client: Client, msg : Message) {
        if(msg.author.bot) return;
        if(msg.content.startsWith("!")) {
            let args = msg.content.split(/ +/);
            let commandName = args.shift().slice(1).toLowerCase();
            let command = commands.get(commandName);
            if(!command) return;
            try {
                command.run(client, msg, args);
            } catch(e) {
                this.log.error("Error while running: !" + commandName, e);
            }
        }
    }
}