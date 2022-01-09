import axios from "axios";
import User from "../../api/models/User";

const BASE_URL = 'http://localhost:3000';

export async function getUser(id: number) : Promise<User> {
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
        let user = new User(username, discriminator, userId, 0, 0, 0);
        return (await axios.post(`${BASE_URL}/users`, user)).data;
    } catch (error) {
        return null;
    }
}