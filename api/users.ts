import { type User } from "@/types/models";
import { api } from "./base";

export function getUsers() {
    return api.get<User[]>('/users')
}