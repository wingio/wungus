import { Client, Message, MessageEmbed } from "discord.js";
import { Emoji } from "../Constants";
import { getGuildMember } from "../util/api/APIUtils";
import { getXPToNextLevel } from "../util/XPUtils";

export function run(client: Client, msg: Message, args: string[]) {
    if(!msg.inGuild()) return
    let target = msg.mentions.members.first() || msg.member;

    if(!target) msg.channel.send("No user provided");
    
    getGuildMember(msg.guild.id, target.id).then(member => {
        let embed = new MessageEmbed()
            .setAuthor({ name: target.user.tag, iconURL: target.user.avatarURL() })
            .setThumbnail(target.user.avatarURL())
            .setTimestamp(Date.now())
            .setFooter({ text: `#${member.rank} in ${msg.guild.name}`, iconURL: msg.guild.iconURL() })
            .setColor(target.displayColor)
            .setDescription(`Level ${member.level} (${member.xp}/${getXPToNextLevel(member.level)})`);
        msg.channel.send({embeds: [embed]});
    }).catch(e => {
        msg.channel.send(`${Emoji.ERROR} **${target.user.tag}** not ranked`);
    });
}

export const names = ["rank"];
export const description = "Your rank in the server.";
export const dev = false;