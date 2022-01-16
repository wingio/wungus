import { GuildChannelResolvable, GuildMember, PermissionResolvable } from "discord.js";

export function checkPermissions(member: GuildMember, channel?: GuildChannelResolvable ,...permissions: string[]): boolean {
    for (const permission of permissions) {
        if (!member.permissions.has(permission as PermissionResolvable)) return false;
        if(channel){
            if(!member.permissionsIn(channel).has(permission as PermissionResolvable)) return false;
        }
    }
    return true;
}