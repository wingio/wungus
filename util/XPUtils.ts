import { Collection } from "discord.js";
import { memberCache, userCache } from "..";
import Member from "../api/models/Member";
import { addMember, createUser, updateMemberXp } from "./api/APIUtils";

export function getXPToNextLevel(currentLevel: number): number {
    return 5 * (currentLevel * currentLevel) + (50 * currentLevel) + 100;
}

export function getLevelFromXP(totalXp: number): number {
    if(totalXp < 100) {
        return 0;
    }
    let counter = 0;
    let total = 0;
    while(true) {
        let neededForNextLevel = getXPToNextLevel(counter);
        if(neededForNextLevel > totalXp) {
            return counter;
        }
        total += neededForNextLevel;
        if(total >= totalXp) {
            return counter;
        }
        counter++;
    }
}

export function getTotalXpNeeded(level: number): number {
    let x = 0;
    for(let i = 0; i < level; i++) {
        x += getXPToNextLevel(i);
    }
    return x;
}

export async function updateUserXp(userId: string, guildId: string, username: string, discriminator: string, xp: number, totalXp: number, level: number): Promise<Member> {
    if(!memberCache.has(guildId)) memberCache.set(guildId, new Collection());
    if(userCache.has(userId)) {
        if(memberCache.get(guildId)?.has(userId)) {
            return updateMemberXp(userId, guildId, xp, totalXp, level);
        } else {
            addMember(userId, guildId).then(member => {
                memberCache.get(guildId)?.set(userId, member);
                return updateMemberXp(userId, guildId, xp, totalXp, level);
            });
        }
    } else {
        createUser(userId, username, discriminator).then(user => {
            userCache.set(userId, user);
            if(memberCache.get(guildId)?.has(userId)) {
                return updateMemberXp(userId, guildId, xp, totalXp, level);
            } else {
                addMember(userId, guildId).then(member => {
                    memberCache.get(guildId)?.set(userId, member);
                    return updateMemberXp(userId, guildId, xp, totalXp, level);
                });
            }
        });
    }
}