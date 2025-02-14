import { useDeleteCategoryMutation, useGetCategoriesQuery } from "../../services/apiCategory.ts";
import { Link } from "react-router-dom";
import { Button, Dropdown, MenuProps, notification, Spin } from "antd";
import { MoreOutlined } from "@ant-design/icons";

const CategoryListPage = () => {
    const { data: list, isLoading, error } = useGetCategoriesQuery();
    const [deleteCategory] = useDeleteCategoryMutation();

    const handleDelete = async (id: number) => {
        try {
            await deleteCategory(id).unwrap();
            notification.success({
                message: "Категорія видалена",
                description: "Категорія успішно видалена!",
            });
        } catch {
            notification.error({
                message: "Помилка видалення категорії",
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
            <h1 className="text-center text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 my-6">
                Список категорій
            </h1>

            <div className="flex justify-end mb-4">
                <Link
                    to={"create"}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Додати
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
                                <th scope="col" className="px-6 py-3">Опис</th>
                                <th scope="col" className="px-6 py-3 text-center">Дії</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list?.map((category) => (
                                <tr
                                    key={category.id}
                                    className="odd:bg-white even:bg-gray-50 border-b dark:border-gray-700"
                                >
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                        {category.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        <img src={category.image} alt={category.name} className="w-16 h-16 object-cover" />
                                    </td>
                                    <td className="px-6 py-4">{category.description}</td>
                                    <td className="px-6 py-4 text-center">{renderActions(category.id)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
};

export default CategoryListPage;
