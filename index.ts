import * as dotenv from "dotenv";
dotenv.config();
import { Client, Collection, Intents, Message } from "discord.js";
import Logger from "./util/Logger";
import Event from "./events/Event";
import * as fs from 'fs';
import Command from "./commands/base/Command";

const dev = process.env.NODE_ENV === "dev";
let intents: Intents = new Intents();
let client = new Client({intents: intents.add(Intents.FLAGS.GUILDS).add(Intents.FLAGS.GUILD_MESSAGES).add(Intents.FLAGS.GUILD_MEMBERS)});
let log = new Logger("DEBUG");
//define client.commands
let commands: Collection<string[], Command> = new Collection();

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

fs.readdir('./commands/', (err, allFiles) => {
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
export default commands;