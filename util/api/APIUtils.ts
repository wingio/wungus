import axios from "axios";
import { Collection } from "discord.js";
import { memberCache } from "../..";
import Guild from "../../api/models/Guild";
import Member from "../../api/models/Member";
import User from "../../api/models/User";

export const BASE_URL = 'http://localhost:3000';

export async function getUser(id: string) : Promise<User> {
    try {
        return (await axios.get(`${BASE_URL}/users/${id}`)).data;
    } catch (error) {
        return null;
    }
}

export async function getUsers() : Promise<User[]> {
    return (await axios.get(`${BASE_URL}/users`)).data;
}

export async function createUser(userId: string, username: string, discriminator: string) : Promise<User> {
    try {
        let user = new User(username, discriminator, userId);
        return (await axios.post(`${BASE_URL}/users`, user)).data;
    } catch (error) {
        return null;
    }
}

export async function updateUser(user: User) : Promise<User> {
    return (await axios.put(`${BASE_URL}/users/${user.userId}`, user)).data;
}

export async function getMembers(guildId: string) : Promise<Member[]> {
    return (await axios.get(`${BASE_URL}/guilds/${guildId}/members`)).data;
}

export async function addMember(userId, guildId) : Promise<Member> {
    if(!memberCache.has(guildId)) memberCache.set(guildId, new Collection());
    if(memberCache.get(guildId)?.has(userId)) return getGuildMember(guildId, userId);
    return (await axios.post(`${BASE_URL}/guilds/${guildId}/members`, { userId })).data;
}

export async function updateMemberXp(userId, guildId, xp?: number, totalXp?: number, level?: number) : Promise<Member> {
    return (await axios.put(`${BASE_URL}/guilds/${guildId}/members/${userId}`, { xp, totalXp, level })).data;
}

export async function getGuildMember(guildId: string, userId: string) : Promise<Member> {
    return (await axios.get(`${BASE_URL}/guilds/${guildId}/members/${userId}`)).data;
}

export async function addGuild(name: string, id: string) : Promise<Guild> {
    try {
        return (await axios.post(`${BASE_URL}/guilds`, { id, name })).data;
    } catch (error) {
        return null;
    }
}

export async function getGuilds() : Promise<Guild[]> {
    return (await axios.get(`${BASE_URL}/guilds`)).data;
}

export async function getGuild(id: string) : Promise<Guild> {
    return (await axios.get(`${BASE_URL}/guilds/${id}`)).data;
}
