
import { Link } from "react-router-dom";
import { Button, Dropdown, MenuProps, notification, Spin } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import defaultProductImage from "../../assets/images/defolt.webp";
import { APP_ENV } from "../../env/index.ts";
import { useDeleteProductMutation, useGetProductsQuery } from "../../services/apiProduct.ts";

const ProductList = () => {
    const { data: list, isLoading, error } = useGetProductsQuery();
    const [deleteProduct] = useDeleteProductMutation();

    const handleDelete = async (id: number) => {
        try {
            await deleteProduct(id).unwrap();
            notification.success({
                message: "Продукт видалено",
                description: "Продукт успішно видалено!",
            });
        } catch {
            notification.error({
                message: "Помилка видалення продукту",
            });
        }
    };

    const renderActions = (id: number) => {
        const items: MenuProps["items"] = [
            {
                key: "edit",
                label: <Link to={`edit/${id}`}>Редагувати</Link>,
            },
            {
                key: "delete",
                danger: true,
                label: (
                    <span onClick={() => handleDelete(id)}>Видалити</span>
                ),
            },
        ];

        return (
            <Dropdown menu={{ items }} trigger={["click"]}>
                <Button icon={<MoreOutlined />} shape="circle" />
            </Dropdown>
        );
    };

    return (
        <>
            <h1 className="text-center text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-500 my-6">
                Список продуктів
            </h1>

            <div className="flex justify-end mb-4">
                <Link
                    to={"create"}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                    Додати продукт
                </Link>
            </div>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                {isLoading ? (
                    <div className="flex justify-center py-10">
                        <Spin size="large" />
                    </div>
                ) : error ? (
                    <p className="text-red-500 text-center py-4">Помилка завантаження даних</p>
                ) : (
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Назва</th>
                                <th scope="col" className="px-6 py-3">Зображення</th>
                                <th scope="col" className="px-6 py-3">Ціна</th>
                                <th scope="col" className="px-6 py-3 text-center">Дії</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list?.map((product) => (
                                <tr
                                    key={product.id}
                                    className="odd:bg-white even:bg-gray-50 border-b dark:border-gray-700"
                                >
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                        {product.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        <img 
                                            src={product.images[0].name ? `${APP_ENV.REMOTE_LARGE_IMAGES_URL}${product.images[0].name }` : defaultProductImage} 
                                            alt={product.name} className="w-16 h-16 object-cover"
                                        />
                                    </td>
                                    <td className="px-6 py-4">{product.price} грн</td>
                                    <td className="px-6 py-4 text-center">{renderActions(product.id)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
};

export default ProductList;
