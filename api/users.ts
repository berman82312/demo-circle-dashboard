import { api } from "./base";

export function getUsers() {
    return api.get('/users')
}