import { users } from "..";
import User from "../api/models/User";
import { updateMemberXp } from "../util/api/APIUtils";
import { getXPToNextLevel, updateUserXp } from "../util/XPUtils";

export default class GuildMember {
    public xp: number;
    public totalXp: number;
    public level: number;
    public guildId: string;
    public rank: number;
    public id: string;
    public user: User;

    constructor(id: string, guildId: string, xp: number, totalXp: number, level: number, rank: number) {
        this.xp = xp;
        this.totalXp = totalXp;
        this.level = level;
        this.guildId = guildId;
        this.rank = rank;
        this.id = id;
        this.user = users.cache.get(id);
    }

    public addXp(xp: number): boolean {
        this.xp += xp;
        this.totalXp += xp;
        let didLevelUp = false;
        if(this.xp >= getXPToNextLevel(this.level)) {
            didLevelUp = true;
            this.xp = this.xp - getXPToNextLevel(this.level);
            this.level++;
        }
        updateMemberXp(this.id, this.guildId, this.xp, this.totalXp, this.level).catch(err => {
            console.error(err);
        });
        return didLevelUp;
    }

}