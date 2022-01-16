import { ObjectId } from "mongodb";

export default class User {
    constructor(public username: string, public discriminator: string, public userId: string, public id?: ObjectId) {}
}