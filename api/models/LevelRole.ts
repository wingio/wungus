import { ObjectId } from "mongodb";

export default class LevelRole {
    constructor(public name: string, public id: string, public guildId: string, public level: number ,public _id?: ObjectId ) {}
}