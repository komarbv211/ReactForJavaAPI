import React, { useState } from "react";
import { Button, Form, Input } from "antd";
import { IUserRegisterRequest } from "./types.ts";
import { useNavigate } from "react-router-dom";
import { useRegisterUserMutation } from "../../services/authApi.ts";
import ImageCropper from "../../components/ImageCropper"; 

const { Item } = Form;

const RegisterPage: React.FC = () => {
    const [form] = Form.useForm<IUserRegisterRequest>();
    const navigate = useNavigate();
    const [registerUser] = useRegisterUserMutation();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [croppedImage, setCroppedImage] = useState<string | null>(null);

    const onFinish = async (values: IUserRegisterRequest) => {
        try {
            const dataToSend = { ...values, avatar: croppedImage }; 
            console.log("Register user", dataToSend);
            const response = await registerUser(dataToSend).unwrap();
            console.log("Користувача успішно зареєстровано", response);
            navigate("..");
        } catch (error) {
            console.error("Помилка при реєстрації", error);
        }
    };
    

    return (
        <>
            <h1 className="text-center text-4xl font-bold text-blue-500">Реєстрація на сайті</h1>

            <div style={{ maxWidth: "400px", margin: "0 auto" }}>
                <Form form={form} onFinish={onFinish} layout="vertical">
                    <Item
                        name="username"
                        label="Електронна пошта"
                        rules={[
                            { required: true, message: "Вкажіть свою пошту" },
                            { type: "email", message: "Введіть коректний email" },
                        ]}
                    >
                        <Input placeholder="Електронна пошта" />
                    </Item>

                    <Item
                        name="password"
                        label="Пароль"
                        rules={[
                            { required: true, message: "Введіть пароль" },
                            { min: 6, message: "Пароль має містити щонайменше 6 символів" },
                        ]}
                    >
                        <Input.Password placeholder="Введіть пароль" />
                    </Item>

                    <label htmlFor="fileSelect" className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800">
                        Обрати фото
                    </label>
                    <input
                        id="fileSelect"
                        type="file"
                        style={{ display: "none" }}
                        onChange={(e) => {
                            if (e.target.files?.[0]) {
                                setSelectedImage(URL.createObjectURL(e.target.files[0]));
                            }
                        }}
                    />

                    {selectedImage && <ImageCropper image={selectedImage} onCrop={setCroppedImage} />}

                    <Item>
                        <Button type="primary" htmlType="submit">
                            Реєстрація
                        </Button>
                    </Item>
                </Form>
            </div>
        </>
    );
};

export default RegisterPage;
