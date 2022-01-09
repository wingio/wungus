import { Client, Message, MessageEmbed } from "discord.js";
import { commands } from "..";

export function run(client: Client, msg: Message, args: string[]) {
    const embed = new MessageEmbed()
        .setTitle("Commands")
        .setColor(0x00FF00)
        .setDescription("Here are all the commands you can use.");
    commands.each(cmd => {
        if(!cmd.dev) embed.addField(cmd.names[0], cmd.description + "\n\n*Aliases: " + (cmd.names.length > 1 ? cmd.names.slice(1).join(", ") + "*" : "None*"));
    });
    msg.channel.send({embeds: [embed]});
}

export const names = ["help", "h"];
export const description = "View commands.";
export const dev = false;