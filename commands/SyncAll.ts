import { Client, Collection, Message } from "discord.js";
import Mee6LevelsApi, { User } from "mee6-levels-api";
import { Emoji } from "../Constants";
import Logger from "../util/Logger";
import { updateUserXp } from "../util/XPUtils";

let log = new Logger("DEBUG", "Sync");

export async function run(client: Client, msg: Message, args: string[]) {
    if(!msg.inGuild()) return;
    if(!msg.member.permissions.has("MANAGE_GUILD", true)) return msg.channel.send("You don't have the permission to do that.");
    msg.channel.send(Emoji.TIMER +  " Syncing...");
    let now = Date.now();

    let page = 0;
    let transferedPlayers = 0;
    while(true) {
        log.info(`Syncing page ${page}`);
        var currentPage = await Mee6LevelsApi.getLeaderboardPage(msg.guildId, 1000, page);
        if(currentPage.length === 0) break;
        currentPage.forEach(user => {
            log.info(`Syncing... ${user.tag}`);
            updateUserXp(user.id, msg.guildId, user.username, user.discriminator, user.xp.userXp, user.xp.totalXp, user.level).then(() => {
                transferedPlayers++;
            }).catch(err => {
                log.error(`Couldn't sync ${user.tag}`);
            });
        });
        page++;
    }
    msg.channel.send(`Synced ${transferedPlayers} players in ${Date.now() - now}ms`);
}

export const names = ["syncall", "syncranks"];
export const description = "Sync your server with MEE6 ranks.";
export const dev = false;