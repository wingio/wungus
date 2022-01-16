import { Client} from "discord.js";
import { users } from "..";
import LevelRole from "../api/models/LevelRole";
import User from "../api/models/User";
import GuildMemberManager from "../managers/GuildMemberManager";
import { addMember, createUser } from "../util/api/APIUtils";
import { getXPToNextLevel, updateUserXp } from "../util/XPUtils";
import GuildMember from "./GuildMember";

export default class Guild {
    public members: GuildMemberManager

    constructor(public id: string, public name: string, public levelRoles: LevelRole[]) {
        
    }

    public async addMember(user: User): Promise<GuildMember> {
        let usr = await users.get(user.userId);
        if(!usr) return null;
        let member = await addMember(user.userId, this.id);
        if(!member) return null;
        let mem = new GuildMember(member.userId, this.id, member.xp, member.totalXp, member.level, member.rank);
        this.members.cache.set(mem.id, mem);
        return mem;
    }

}