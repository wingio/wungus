import { Client } from "discord.js";
import Logger from "../util/Logger";

export default class Event {
    public static eventName: string;
    public client: Client;
    public static log: Logger = new Logger("DEBUG");

    public handle(...args: any[]) : void {};
}