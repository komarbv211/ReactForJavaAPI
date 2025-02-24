import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Input, notification, Spin, Upload, Select } from "antd";
import { useGetProductQuery, useUpdateProductMutation } from "../../services/apiProduct";
import { useGetCategoriesQuery } from "../../services/apiCategory"; // Імпортуємо запит на категорії
import { APP_ENV } from "../../env";
import { UploadFile } from "antd/es/upload/interface";

const EditProductPage = () => {
    const { id } = useParams<{ id: string }>();
    const { data: product, isLoading: isProductLoading } = useGetProductQuery(Number(id));
    const { data: categories, isLoading: isCategoriesLoading } = useGetCategoriesQuery();
    const [updateProduct] = useUpdateProductMutation();
    const navigate = useNavigate();

    const [editedProduct, setEditedProduct] = useState({
        id: 0,
        name: "",
        price: 0,
        categoryId: "",
        images: [] as File[],
    });

    const [fileList, setFileList] = useState<UploadFile[]>([]);

    useEffect(() => {
        if (product) {
            setEditedProduct({
                id: Number(id),
                name: product.name || "",
                price: product.price || 0,
                categoryId: product.categoryId || "",
                images: [],
            });

            // Формуємо список файлів для відображення
            const initialFiles = product.images?.map((img, index) => ({
                uid: String(index),
                name: img.name,
                url: `${APP_ENV.REMOTE_LARGE_IMAGES_URL}${img.name}`,
            })) || [];

            setFileList(initialFiles);
        }
    }, [product, id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedProduct({ ...editedProduct, [e.target.name]: e.target.value });
    };

    const handleCategoryChange = (value: string) => {
        setEditedProduct({ ...editedProduct, categoryId: value });
    };

    const handleImageChange = (info: { fileList: UploadFile[] }) => {
        setFileList(info.fileList);
        const newImages = info.fileList
            .filter(file => file.originFileObj) 
            .map(file => file.originFileObj as File);

        console.log("New images added:", newImages); 
        setEditedProduct({
            ...editedProduct,
            images: newImages,
        });
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append("id", String(editedProduct.id));
        formData.append("name", editedProduct.name);
        formData.append("price", String(editedProduct.price));
        formData.append("categoryId", String(editedProduct.categoryId));

        // Додаємо всі файли (нові)
        editedProduct.images.forEach((file) => {
            formData.append("images", file);
        });

        // Логування для перевірки даних, що відправляються
        for (const [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }

        try {
            await updateProduct(formData).unwrap();
            notification.success({ message: "Продукт оновлено" });
            navigate("/products");
        } catch {
            notification.error({ message: "Помилка оновлення продукту" });
        }
    };

    if (isProductLoading || isCategoriesLoading) {
        return <Spin tip="Завантаження..." />;
    }

    return (
        <div className="max-w-lg mx-auto my-6">
            <h1 className="text-3xl font-bold mb-4">Редагувати продукт</h1>
            <Input
                name="name"
                value={editedProduct.name}
                placeholder="Назва"
                onChange={handleChange}
                className="mb-2"
            />
            <Input
                name="price"
                value={editedProduct.price}
                placeholder="Ціна"
                type="number"
                onChange={handleChange}
                className="mb-2"
            />

            <Select
                value={editedProduct.categoryId}
                onChange={handleCategoryChange}
                className="mb-2 block"
                placeholder="Виберіть категорію"
            >
                {categories?.map((category) => (
                    <Select.Option key={category.id} value={category.id}>
                        {category.name}
                    </Select.Option>
                ))}
            </Select>


            <Upload
                multiple
                beforeUpload={() => false}
                onChange={handleImageChange}
                className="mb-2 block"
                accept="image/*"
                fileList={fileList}
                listType="picture"
            >
                <Button>Вибрати зображення</Button>
            </Upload>

            <Button type="primary" onClick={handleSubmit}>
                Зберегти
            </Button>
        </div>
    );
};

export default EditProductPage;
