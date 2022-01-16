import { Client, Message } from "discord.js";

export function run(client: Client, msg: Message, args: string[]) {
    var responses = ["No problem!", "You're welcome :)"];
    var response = responses[Math.floor(Math.random() * responses.length)];
    msg.channel.send(response);
}

export const names = ["thankyou", "thanks", "ty"];
export const description = "Thanks wungus :)";
export const dev = false;