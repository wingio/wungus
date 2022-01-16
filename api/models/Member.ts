import { ObjectId } from "mongodb";

export default class Member {
    constructor(public userId: string, public xp: number, public totalXp: number, public level: number, public guildId: string, public rank?: number, public id?: ObjectId) {}
}