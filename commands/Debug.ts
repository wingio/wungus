import axios from "axios";
import { Client, Message } from "discord.js";
import { BASE_URL } from "../util/api/APIUtils";
import Logger from "../util/Logger";
import { checkPermissions } from "../util/PermissionUtils";

enum DebugCommand {
    EVAL = "eval",
    REST = "rest",
    KILL = "kill",
}

enum Methods {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}

export function run(client: Client, msg: Message, args: string[]) {
    let cmd = args[0];
    if (!cmd) {
        return;
    }
    cmd = cmd.toLowerCase();
    switch (cmd) {
        case DebugCommand.REST:
            makeRequest(args, msg);
            break;
    }
}

export const names = ["debug", "dev"];
export const description = "debug stuff";
export const dev = true;

function makeRequest(args: string[], msg: Message) {
    let method = args[1].toUpperCase();
    if (!method) {
        msg.channel.send("No method specified.");
        return;
    }
    if (!Methods[method]) {
        msg.channel.send("Invalid method.");
        return;
    }
    method = Methods[method];
    let url = args[2];
    if (!url) {
        msg.channel.send("No url specified.");
        return;
    }
    var json = msg.content.split("\n").slice(1).join("\n");
    if (json) {
        json = JSON.parse(json);
    }

    axios[method.toLowerCase()](BASE_URL + url, json)
        .then(res => {
            msg.channel.send(formatJson(res.data));
        })
        .catch(err => {
            msg.channel.send("Error: " + err.message);
        });
}

function formatJson(json: any): string {
    return "```json\n" + JSON.stringify(json, null, 2) + "```";
}