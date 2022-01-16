import { ObjectId } from "mongodb";
import LevelRole from "./LevelRole";

export default class Guild {
    constructor(public name: string, public id: string, public levelRoles: LevelRole[], public _id?: ObjectId) {}
}