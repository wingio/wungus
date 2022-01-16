import { BaseGuild, Client, Collection, User } from "discord.js";
import Member from "../api/models/Member";
import Guild from "../structures/Guild";
import GuildMember from "../structures/GuildMember";
import { addGuild, addMember, getGuild, getMembers } from "../util/api/APIUtils";
import GuildMemberManager from "./GuildMemberManager";

export default class GuildManager {
    public cache : Collection<string, Guild> = new Collection();

    public constructor(private readonly client: Client) {
        this.getInitialGuilds();
        this.handleGuildAdd();
    }

    public getInitialGuilds() {
        this.client.guilds.cache.forEach(guild => {
            addGuild(guild.name, guild.id).then(g => {
                let newGuild = this.createGuild(guild);
                newGuild.levelRoles = g.levelRoles;
                this.cache.set(guild.id, newGuild);
            }).catch(err => {
                console.error(err);
            });
        });
    }

    public handleGuildAdd(): void {
        this.client.on("guildCreate", guild => {
            addGuild(guild.name, guild.id).then(g => {
                let newGuild = this.createGuild(guild);
                newGuild.levelRoles = g.levelRoles;
                this.cache.set(guild.id, newGuild);
            }).catch(err => {
                console.error(err);
            });
        });
    }

    public createGuild(guild: BaseGuild){
        let g = new Guild(guild.id, guild.name, []);
        g.members = new GuildMemberManager(this.client, g);
        return g;
    }

    public async get(id: string) : Promise<Guild> {
        if(this.cache.has(id)) return this.cache.get(id);
        let g = await this.client.guilds.fetch({guild: id})
        if(!g) return null;
        let guild = await getGuild(id);
        if(!guild) return null;
        let newGuild = this.createGuild(g);
        newGuild.levelRoles = guild.levelRoles;
        this.cache.set(id, newGuild);
        return newGuild;
    }
}