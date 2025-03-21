import React from "react";
import {Button, Form, Input, message} from "antd";
import {IUserLoginRequest} from "./types.ts";
import {GoogleOAuthProvider} from "@react-oauth/google";
import {APP_ENV} from "../../env";
import GoogleLoginButton from "./GoogleLoginButton.tsx";
import { GoogleOutlined } from '@ant-design/icons';
import { useGoogleLoginUserMutation, useLoginUserMutation } from "../../services/authApi.ts";
import {useNavigate} from "react-router-dom";

const {Item} = Form;

const LoginPage: React.FC = () => {
    const [form] = Form.useForm<IUserLoginRequest>();
    const [loginGoogle] = useGoogleLoginUserMutation(); 
    const [loginUser] = useLoginUserMutation(); 
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
   
    const onFinish = async (values: IUserLoginRequest) => {
        try {
            const response = await loginUser({
                username: values.username,
                password: values.password
            }).unwrap();
            
            localStorage.setItem("token", response.token);
            messageApi.success("Успішний вхід!");
            navigate("/");
        } catch (error) {
            console.error("Помилка входу", error);
            messageApi.error("Невірні облікові дані");
        }
    };

    const onLoginGoogleResult = async (tokenGoogle: string) => {
        try {
            const response = await loginGoogle({ token: tokenGoogle }).unwrap();
            localStorage.setItem("token", response.token);
            messageApi.success("Успішний вхід через Google!");
            navigate("/");
        } catch (error) {
            console.error("Помилка входу через Google", error);
            messageApi.error("Помилка автентифікації Google");
        }
    };

    return (
        <>
            {contextHolder}
            <GoogleOAuthProvider clientId={APP_ENV.CLIENT_ID}>
                <h1 className={"text-center text-4xl font-bold text-blue-500"}>Вхід на сайт</h1>

                <div style={{maxWidth: '400px', margin: '0 auto'}}>
                    <Form
                        form={form}
                        onFinish={onFinish}
                        layout="vertical">

                        <Item
                            name="username"
                            label={"Електронна пошта або логін"}
                            rules={[
                                {required: true, message: "Будь ласка, введіть email або логін"},
                                {
                                    validator(_, value) {
                                        if (!value || value.trim().length === 0) {
                                            return Promise.reject(new Error("Будь ласка, введіть email або логін"));
                                        }
                                        return Promise.resolve();
                                    }
                                }
                            ]}>
                            <Input placeholder={"Введіть email або логін"}/>
                        </Item>

                        <Item
                            name="password"
                            label="Пароль"
                            rules={[
                                {required: true, message: "Введіть пароль"},
                                {min: 6, message: "Пароль має містити щонайменше 6 символів"}
                            ]}
                        >
                            <Input.Password placeholder="Введіть пароль"/>
                        </Item>

                        <Item>
                            <Button type="primary" htmlType="submit">
                                Вхід
                            </Button>
                        </Item>

                        <GoogleLoginButton 
                            icon={<GoogleOutlined />} 
                            title='Увійти з Google' 
                            onLogin={onLoginGoogleResult} 
                        />

                    </Form>
                </div>
            </GoogleOAuthProvider>
        </>
    )
}

export default LoginPage;