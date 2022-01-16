import { Client, Collection, Message } from "discord.js";
import Mee6LevelsApi from "mee6-levels-api";
import { memberCache, userCache } from "..";
import { Emoji } from "../Constants";
import { addMember, createUser, updateMemberXp } from "../util/api/APIUtils";
import Logger from "../util/Logger";

export async function run(client: Client, msg: Message, args: string[]) {
    let log = new Logger("DEBUG", "Sync");
    if(!msg.inGuild()) return;
    msg.channel.send(Emoji.TIMER +  " Syncing...");

    Mee6LevelsApi.getUserXp(msg.guildId, msg.author.id).then(user => {
        if(userCache.has(user.id) && memberCache.get(msg.guildId)?.has(user.id)) {
            updateMemberXp(user.id, msg.guildId, user.xp.userXp, user.xp.totalXp, user.level).then(member => {
                if(!memberCache.has(msg.guildId)) memberCache.set(msg.guildId, new Collection());
                        memberCache.get(msg.guildId)?.set(user.id, member);
                msg.channel.send("Synced.");
            });
        } else {
            createUser(user.id, user.username, user.discriminator).then(newUser => {
                if(newUser != null) {
                    userCache.set(user.id, newUser);
                    addMember(user.id, msg.guildId).then(newMember => {
                        updateMemberXp(user.id, msg.guildId, user.xp.userXp, user.xp.totalXp, user.level).then(member => {
                            if(!memberCache.has(msg.guildId)) memberCache.set(msg.guildId, new Collection());
                            memberCache.get(msg.guildId)?.set(user.id, member);
                            msg.channel.send("Synced");
                        }).catch(err => {
                            log.error("Couldn't sync " + user.tag);
                        });
                    }).catch(err => {
                        log.error("Couldn't sync " + user.tag);
                    });
                }
            });
        }
    }).catch(err => {
        log.error("Couldn't sync " + msg.author.tag);
    });
}

export const names = ["sync"];
export const description = "Sync your rank";
export const dev = false;