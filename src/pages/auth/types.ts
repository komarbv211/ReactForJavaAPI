import {ReactNode} from "react";

export interface IUserRegisterRequest {
    username: string;      
    password: string;
}


export interface IUserLoginRequest {
    username: string;         
    password: string;
}


export interface LoginButtonProps{
    title:string
    onLogin:(token: string) => void
    icon:ReactNode
}

export interface LoginGoogleRequest{
    token:string
}

export interface AuthResponse{
    token:string
}

export interface IUser {
    id: number;
    email: string;
    roles: string[];
}
//Авторизований користувач у системі
export interface IUserAuth {
    isAdmin: boolean
    isUser: boolean
    isAuth: boolean,
    roles: string[]
}
//Повна інформація про користувача
export interface IUserState {
    user: IUser | null
    auth: IUserAuth
    token: string | null
}