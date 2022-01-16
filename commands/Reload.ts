import { Client, Message } from "discord.js";
import { commands } from "..";
import Command from "./base/Command";

export async function run(client: Client, msg: Message, args: string[]) {
    let name = args[0];
    if (!name) {
        msg.channel.send("No name specified.");
        return;
    }

    if(commands.find((m, n) => n.includes(name))) {
        const cmd = commands.find((m, n) => n.includes(name))

        if (!cmd) return msg.channel.send(`Command does not exist.`);

        delete require.cache[require.resolve(`./${cmd.names[0]}.js`)];
        commands.delete(cmd.names);
    }

    try {
        const props = await import(`./${name}.js`) as { names: string[], description: string, dev: boolean, run: (client: Client, msg: Message, args: string[]) => any };
        const newCmd = new Command(props.names, props.description, props.run);
        newCmd.dev = props.dev;
        commands.set(newCmd.names, newCmd);
        msg.channel.send("Command `" + newCmd.names[0] + "` was reloaded!");
    } catch (error) {
        console.log(error);
        msg.channel.send("There was an error while reloading the `" + name + "` command. \n\nError is as follows:\n```js\n" + error.msg + "\n```");
    }
}

export const names = ["reload", "r"];
export const description = "Reload a command.";
export const dev = true;