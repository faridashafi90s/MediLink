import { UserRole } from "./user-role.enum";

export interface UserData {
    role: UserRole;
    id: number;
    token: string;
    email: string;
    fullName: string;
}