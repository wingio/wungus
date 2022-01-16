import { Client, Collection } from "discord.js";
import { guilds } from "..";
import User from "../api/models/User";
import { addMember, createUser, getUser, updateUser } from "../util/api/APIUtils";

export default class UserManager {
    public cache: Collection<string, User> = new Collection();

    public constructor(private client: Client) {
        client.on("message", msg => {
            if(msg.author.bot) return;
            if(!this.cache.has(msg.author.id)) {
                createUser(msg.author.id, msg.author.username, msg.author.discriminator).then(user => {
                    this.cache.set(user.userId, user);
                    if(msg.inGuild()){
                        guilds.get(msg.guild.id).then(guild => {
                            if(!guild) return;
                            guild.addMember(user).catch(err => {
                                console.error(err);
                            }).catch(err => {
                                console.error(err);
                            });
                        }).catch(err => {
                            console.error(err);
                        });
                    }
                }).catch(err => {
                    console.error(err);
                });
            }
        })

        this.handleUserUpdate();
        this.handleMemberAdd();
    }

    private handleUserUpdate() {
        this.client.on("userUpdate", (oldUser, newUser) => {
            if(newUser.bot) return;
            let updatedUser = new User(newUser.id, newUser.username, newUser.discriminator);
            updateUser(updatedUser).then(user => {
                this.cache.set(user.userId, user);
            }).catch(err => {
                console.error(err);
            });
        });
    }

    private handleMemberAdd(): void {
        this.client.on("guildMemberAdd", member => {
            if(member.user.bot) return;
            if(!this.cache.has(member.id)) {
                createUser(member.id, member.user.username, member.user.discriminator).then(user => {
                    this.cache.set(user.userId, user);
                    guilds.get(member.guild.id).then(guild => {
                        if(!guild) return;
                        guild.addMember(user).then(mem => {
                            guild.members.cache.set(mem.id, mem);
                        }).catch(err => {
                            console.error(err);
                        });
                    }).catch(err => {
                        console.error(err);
                    });
                }).catch(err => {
                    console.error(err);
                });
            }
        });
    }

    public async get(id: string) : Promise<User> {
        if(this.cache.has(id)) return this.cache.get(id);
        let user = await getUser(id);
        if(!user) return null;
        this.cache.set(user.userId, user);
        return user;
    }

}