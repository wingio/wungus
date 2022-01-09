import { Client, Message } from "discord.js";
import Event from "./Event";

export default class DebugEvent extends Event {
    public static eventName: string = "debug";

    public static handle(client: Client, msg : string) {
        this.log.debug(msg);
    }
}