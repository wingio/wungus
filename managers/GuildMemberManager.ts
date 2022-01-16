import { Client, Collection } from "discord.js";
import Member from "../api/models/Member";
import Guild from "../structures/Guild";
import GuildMember from "../structures/GuildMember";
import { addMember, getGuildMember, getMembers } from "../util/api/APIUtils";

export default class GuildMemberManager {
    public cache : Collection<string, GuildMember> = new Collection();

    public constructor(public readonly client: Client, public guild: Guild) {
        this.getInitalMembers();
    }

    private getInitalMembers() {
        getMembers(this.guild.id).then(members => {
            this.client.emit("debug", `GuildMemberManager: ${members.length} members found`);
            members.forEach(member => {
                this.cache.set(member.userId, this.createGuildMemberFromModel(member));
            });
        }).catch(err => {
            console.error(err);
        });
    }

    public createGuildMemberFromModel(member: Member) : GuildMember {
        return new GuildMember(member.userId, member.guildId, member.xp, member.totalXp, member.level, member.rank);
    }

    public async get(id: string) : Promise<GuildMember> {
        if(this.cache.has(id)) return this.cache.get(id);
        let member = await getGuildMember(this.guild.id, id);
        if(!member) return null;
        return this.createGuildMemberFromModel(member);
    }
}