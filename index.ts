import * as dotenv from "dotenv";
dotenv.config();
import { Client, Collection, Intents, Message } from "discord.js";
import Logger from "./util/Logger";
import Event from "./events/Event";
import * as fs from 'fs';
import Command from "./commands/Command";

let intents: Intents = new Intents();
let client = new Client({intents: intents.add(Intents.FLAGS.GUILDS).add(Intents.FLAGS.GUILD_MESSAGES).add(Intents.FLAGS.GUILD_MEMBERS)});
let log = new Logger("DEBUG");
//define client.commands
let commands: Collection<string, Command> = new Collection();

client.on("ready", () => {
    log.info("Ready!");
});

fs.readdir("./events", (err, files) => {
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

fs.readdir("./commands", (err, files) => {
    if (err) return log.error(err);
    files.forEach(file => {
        if (!file.endsWith(".js")) return;

        import(`./commands/${file}`).then(command => {
            if(command.default.commandName == undefined) return;
            log.info(`Loaded command: ${command.default.commandName}`);
            commands.set(command.default.commandName, command.default);
            
            command.default.aliases.forEach(alias => {
                commands.set(alias, command.default);
            });
        });
        delete require.cache[require.resolve(`./commands/${file}`)];
    });
});

client.login(process.env.TOKEN);
export default commands;