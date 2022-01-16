import * as dotenv from "dotenv";
dotenv.config();
import { Client, Collection, Intents, Message } from "discord.js";
import Logger from "./util/Logger";
import Event from "./events/Event";
import * as fs from 'fs';
import Command from "./commands/base/Command";
import { addGuild, getMembers, getUser, getUsers } from "./util/api/APIUtils";
import User from "./api/models/User";
import Member from "./api/models/Member";
import { getLevelFromXP, getTotalXpNeeded } from "./util/XPUtils";
import GuildManager from "./managers/GuildManager";
import UserManager from "./managers/UserManager";

const dev = process.env.NODE_ENV === "dev";
let intents: Intents = new Intents();
let client = new Client({intents: intents.add(Intents.FLAGS.GUILDS).add(Intents.FLAGS.GUILD_MESSAGES).add(Intents.FLAGS.GUILD_MEMBERS)});

export const commands: Collection<string[], Command> = new Collection();

export const memberCache: Collection<string, Collection<string, Member>> = new Collection();
export const userCache: Collection<string, User> = new Collection();

export const guilds: GuildManager = new GuildManager(client);
export const users: UserManager = new UserManager(client);

client.on("ready", () => {
    let log = new Logger("DEBUG");
    log.info("Ready!");

    getUsers().then(users => {
        log.debug("[API] Users preloaded: " + users.length);
        for(let user of users) {
            userCache.set(user.userId, user);
        }
    })

    client.guilds.cache.forEach(guild => {
        let guildId = guild.id;
        if(guild) addGuild(guild.name, guildId).then(g => {
            if(g) log.debug("[API] Guild added: " + g.name);
            getMembers(guildId).then(members => {
                log.debug("[API] Members preloaded: " + members.length);
                for(let member of members) {
                    if(!memberCache.has(guildId)) memberCache.set(guildId, new Collection());
                    memberCache.get(guildId).set(member.userId, member);
                }
            });
        });
    });
});

client.on("guildCreate", guild => {
    let guildId = guild.id;
    let log = new Logger("DEBUG");
    addGuild(guild.name, guildId).then(g => {
        if(g) log.debug("[API] Guild added: " + g.name);
        memberCache.set(guildId, new Collection());
        getMembers(guildId).then(members => {
            log.debug("[API] Members preloaded: " + members.length);
            for(let member of members) {
                if(!memberCache.has(guildId)) memberCache.set(guildId, new Collection());
                memberCache.get(guildId).set(member.userId, member);
            }
        });
    });
})    


fs.readdir("./events", (err, files) => {
    let log = new Logger("DEBUG", "Event Loader");
    if (err) return log.error(err);
    files.forEach(file => {
        if (!file.endsWith("Event.js")) return;
        if(file == "Event.js") return;
        import(`./events/${file}`).then(event => {
            log.info(`Loaded event: ${event.default.eventName}`);
            client.on(event.default.eventName, (...args) => {
                event.default.handle(client, ...args);
            });
        });
        delete require.cache[require.resolve(`./events/${file}`)];
    });
});

fs.readdir('./commands/', (err, allFiles) => {
    let log = new Logger("DEBUG", "Command Loader");
    if (err) log.error(err);
    let files = allFiles.filter(f => f.split('.').pop() === (dev ? 'ts' : 'js'));
    if (files.length <= 0) console.log('No commands found!');
    else for(let file of files) {
        log.info(`Loading command: ${file.slice(0, -3)}`);
        const props = require(`./commands/${file}`) as {names: string[], run: (client: Client, msg: Message, args: string[]) => any, description: string, dev: boolean};
        let command = new Command(props.names, props.description, props.run);
        command.dev = props.dev;
        commands.set(props.names, command);
    }
});

client.login(process.env.TOKEN);