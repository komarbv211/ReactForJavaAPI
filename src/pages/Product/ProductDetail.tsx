import { useParams } from "react-router-dom";
import { useGetProductQuery } from "../../services/apiProduct";
import { Spin, Typography } from "antd";
import ImagesViewer from "../../components/images_viewer";

const { Title, Paragraph } = Typography;

const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { data: product, isLoading, error } = useGetProductQuery(Number(id));

    if (isLoading) {
        return <div className="flex justify-center py-10"><Spin size="large" /></div>;
    }

    if (error || !product) {
        return <p className="text-red-500 text-center py-4">Помилка завантаження даних</p>;
    }

    return (
        <div className="container mx-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ImagesViewer advertImages={product.images} className="h-96" />
                <div>
                    <Title level={2}>{product.name}</Title>
                    <Paragraph className="text-lg font-bold">Ціна: {product.price} грн</Paragraph>
                    <Paragraph className="text-gray-700">Категорія: {product.categoryId}</Paragraph>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
