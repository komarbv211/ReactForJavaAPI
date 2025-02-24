import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, notification, Upload, Select } from "antd";
import { useCreateProductMutation } from "../../services/apiProduct";
import { useGetCategoriesQuery } from "../../services/apiCategory";
import { IProductPostRequest } from "../../services/types";
import { UploadChangeParam, UploadFile } from "antd/es/upload/interface";
const CreateProductPage = () => {
    const [createProduct] = useCreateProductMutation();
    const { data: categories, isLoading } = useGetCategoriesQuery();
    const navigate = useNavigate();
    const [product, setProduct] = useState<IProductPostRequest>({
        name: "",
        price: 0,
        categoryId: "",
        images: [] as File[],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleCategoryChange = (value: string) => {
        setProduct({ ...product, categoryId: value });
    };

    const handleImageChange = (info: UploadChangeParam<UploadFile<IProductPostRequest>>) => {
        const { fileList } = info;
    
        setProduct({
            ...product,
            images: fileList.map(file => file.originFileObj as File),
        });
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append("name", product.name);
        formData.append("price", product.price.toString());
        formData.append("categoryId", product.categoryId);
        product.images?.forEach((image) => {
            formData.append("images", image);
        });

        try {
            await createProduct(formData).unwrap();
            notification.success({ message: "Продукт створено" });
            navigate("/products");
        } catch {
            notification.error({ message: "Помилка створення продукту" });
        }
    };

    return (
        <div className="max-w-lg mx-auto my-6">
            <h1 className="text-3xl font-bold mb-4">Додати продукт</h1>
            <Input name="name" placeholder="Назва" onChange={handleChange} className="mb-2" />
            <Input name="price" placeholder="Ціна" type="number" onChange={handleChange} className="mb-2" />

            {/* Вибір категорії */}
            <Select
                placeholder="Оберіть категорію"
                onChange={handleCategoryChange}
                loading={isLoading}
                className="mb-2 w-full"
                options={categories?.map((category) => ({
                    value: category.id,
                    label: category.name,
                }))}
            />

            <Upload 
                multiple 
                beforeUpload={() => false} 
                onChange={handleImageChange} 
                className="mb-2" accept="image/*">
                <Button>Вибрати зображення</Button>
            </Upload>
            <Button type="primary" onClick={handleSubmit}>
                Зберегти
            </Button>
        </div>
    );
};

export default CreateProductPage;
