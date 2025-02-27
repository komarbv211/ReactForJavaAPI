import { Form, Input, Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import TextArea from "antd/es/input/TextArea";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import { ICategoryPutRequest } from '../../services/types';
import { useGetCategoryQuery, useUpdateCategoryMutation } from '../../services/apiCategory';
import { APP_ENV } from '../../env';

const { Item } = Form;

const EditCategoryPage = () => {
    const { id } = useParams();
    const { data: category, isLoading } = useGetCategoryQuery(Number(id));
    const [updateCategory] = useUpdateCategoryMutation();
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        if (category) {
            form.setFieldsValue({
                name: category.name,
                description: category.description,
            });
        }
    }, [category, form]);

    const onFinish = async (values: ICategoryPutRequest) => {
        try {
            values.id = Number(id);
            values.image = imageFile; 
            if (!values.image) {
                delete values.image;
            }
            const response = await updateCategory(values).unwrap();
            console.log("Response:", response);
            navigate("..");
        } catch (err) {
            console.error("Помилка оновлення категорії:", err);
        }
    };


    const beforeUpload = (file: File) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            alert('Будь ласка, завантажте зображення');
        }
        setImageFile(file);
        return false;
    };

    if (isLoading) return <p>Завантаження...</p>;

    return (
        <div className="max-w-md mx-auto">
            <h1 className="text-center text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 my-6">
                Редагувати групу
            </h1>
            <Form form={form} onFinish={onFinish} layout="vertical">
                <Item name="name" label="Назва групи" rules={[{ required: true, message: 'Будь ласка, введіть назву групи!' }]}>
                    <Input placeholder="Назва" />
                </Item>
                <Item name="description" label="Вкажіть опис">
                    <TextArea rows={4} placeholder="Текст..." />
                </Item>
                <Item label="Фото групи">
                    <Upload beforeUpload={beforeUpload} showUploadList={false}>
                        <Button icon={<UploadOutlined />}>Завантажити фото</Button>
                    </Upload>
                    {imageFile && <img src={URL.createObjectURL(imageFile)} alt="Групове фото" className="mt-2 w-full max-h-48 object-cover rounded-lg" />}
                    {!imageFile && category?.image && <img src={category.image ? `${APP_ENV.REMOTE_LARGE_IMAGES_URL}${category.image}` : ""} alt="Групове фото" className="mt-2 w-full max-h-48 object-cover rounded-lg" />}
                </Item>
                <Item>
                    <Button type="primary" htmlType="submit" block>
                        Оновити групу
                    </Button>
                </Item>
            </Form>
        </div>
    );
};

export default EditCategoryPage;