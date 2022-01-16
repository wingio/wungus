import axios from "axios";
import { Client, Collection, Message, MessageEmbed } from "discord.js";
import { users } from "..";
import Member from "../api/models/Member";
import User from "../api/models/User";
import { Emoji } from "../Constants";
import { BASE_URL, getGuildMember } from "../util/api/APIUtils";
import { getXPToNextLevel } from "../util/XPUtils";

export async function run(client: Client, msg: Message, args: string[]) {
    if(!msg.inGuild()) return
    axios.get(`${BASE_URL}/guilds/${msg.guild.id}/members?limit=10&page=1`).then(res => {
        let members = res.data as Member[];
        let userList: Collection<string, User> = new Collection();
        members.forEach(async member => {
            try {
                let user = await users.get(member.userId);
                userList.set(member.userId, user);
            } catch (error) {
                console.log(error);
            }
        });
        let description = "";
        members.forEach(m => {
            description += `**${m.rank})** <@${m.userId}> - Level ${m.level}) (${m.xp}/${getXPToNextLevel(m.level)})\n`;
        });
        let embed = new MessageEmbed()
            .setAuthor({ name: msg.guild.name, iconURL: msg.guild.iconURL() })
            .setThumbnail(msg.guild.iconURL())
            .setTimestamp(Date.now())
            .setColor(msg.member.displayColor)
            .setDescription(description);
        msg.channel.send({embeds: [embed]});
    }).catch(e => {
        console.error(e);
        msg.channel.send(`${Emoji.ERROR} Error getting leaderboard`);
    });
}

export const names = ["leaderboard", "lb", "levels"];
export const description = "Top server members.";
export const dev = false;