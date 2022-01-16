import { Client, Collection, Message } from "discord.js";
import { commands, guilds, memberCache, userCache, users } from "..";
import Member from "../api/models/Member";
import { addMember, createUser, getGuildMember, updateMemberXp } from "../util/api/APIUtils";
import Logger from "../util/Logger";
import { checkPermissions } from "../util/PermissionUtils";
import { getXPToNextLevel, updateUserXp } from "../util/XPUtils";
import Event from "./Event";

let xpLog = new Logger("DEBUG", "XPManager");
let lastXpUpdate: Collection<string, Collection<string, number>> = new Collection();


export default class MessageCreateEvent extends Event {
    public static eventName: string = "messageCreate";

    public static handle(client: Client, msg : Message) {
        if(msg.author.bot) return;
        if(msg.inGuild() && !memberCache.has(msg.guild.id)) memberCache.set(msg.guild.id, new Collection());
        let prefix = "!";

        if(msg.content.startsWith(prefix)) {
            let args = msg.content.split(/ +/);
            let commandName = args.shift().slice(prefix.length).toLowerCase();
            let command = commands.find((r, n) => n.includes(commandName));
            if(!command) return;
            try {
                if(command.dev && msg.author.id !== "298295889720770563") return;
                if(!checkPermissions(msg.guild.me, msg.channel.id, "SEND_MESSAGES")) return;
                command.run(client, msg, args);
            } catch(e) {
                this.log.error("Error while running: !" + commandName, e);
            }
        }

        if(msg.inGuild() && !msg.content.startsWith("!rank")) {
            if(!lastXpUpdate.has(msg.guildId)) lastXpUpdate.set(msg.guildId, new Collection());
            let isFirstMessage = !lastXpUpdate.get(msg.guildId)?.has(msg.author.id);
            if(isFirstMessage) lastXpUpdate.get(msg.guildId)?.set(msg.author.id, Date.now());
            let canUpdateXp = lastXpUpdate.get(msg.guildId)?.get(msg.author.id) + (1000 * 60) <= Date.now() || isFirstMessage;
            if(canUpdateXp) {
                lastXpUpdate.get(msg.guildId)?.set(msg.author.id, Date.now());
                let randomXp = Math.floor(Math.random() * (25 - 15 + 1)) + 15;
                let userId = msg.author.id;
                guilds.get(msg.guildId).then(async guild => {
                    if(!guild) return;
                    guild.members.get(userId).then(async member => {
                        xpLog.info(`Gave ${msg.author.tag} ${randomXp} xp`);
                        let didLevelUp = member.addXp(randomXp);
                        if(didLevelUp) msg.channel.send(`GG Gamer <@${member.id}>, you just leveled up to ${member.level}!`);
                    }).catch(e => {
                        users.get(userId).then(async user => {
                            if(!user) return;
                            guild.addMember(user).then(async member => {
                                xpLog.info(`Gave ${msg.author.tag} ${randomXp} xp`);
                                let didLevelUp = member.addXp(randomXp);
                                if(didLevelUp) msg.channel.send(`GG Gamer <@${member.id}>, you just leveled up to ${member.level}!`);
                            }).catch(e => {
                                xpLog.error("Error while adding member to guild", e);
                            });
                        });
                    });
                });
        }}
    }
}