import { jwtDecode } from "jwt-decode";
import {IUser} from "../pages/auth/types.ts";
export const jwtParse = (token: string): IUser | null => {
    try {
        const data = jwtDecode<IUser>(token);
        return {
            id: data['id'],
            email: data['email'],
            roles: data['roles'] || [],
        }
    }
    catch (error) {
        console.log("Помилка при парсингу токена:", error);
        return null;
    }
}