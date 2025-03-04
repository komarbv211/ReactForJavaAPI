import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, notification, Upload, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useCreateProductMutation } from "../../services/apiProduct";
import { useGetCategoriesQuery } from "../../services/apiCategory";
import { IProductPostRequest } from "../../services/types";
import { UploadFile } from "antd/es/upload/interface";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { DropResult } from "@hello-pangea/dnd";

const CreateProductPage = () => {
    const [createProduct, {isLoading: isLoadingCreate}] = useCreateProductMutation();
    const { data: categories, isLoading } = useGetCategoriesQuery();
    const navigate = useNavigate();

    const [product, setProduct] = useState<IProductPostRequest>({
        name: "",
        price: 0,
        categoryId: "",
        images: [],
    });

    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProduct({
            ...product,
            [name]: name === "price" ? parseFloat(value) || 0 : value
        });
    };

    const handleCategoryChange = (value: string) => {
        setProduct({ ...product, categoryId: value });
    };

    const handleImageChange = (info: { fileList: UploadFile[] }) => {
        const newFileList = info.fileList.map((file, index) => ({
            ...file,
            uid: file.uid || Date.now().toString(),
            order: index,
        }));

        setFileList([...fileList, ...newFileList]);
        // setProduct({
        //     ...product,
        //     images: newFileList.map(file => file.originFileObj as File),
        // });
    };

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const reorderedFiles = Array.from(fileList);
        const [movedFile] = reorderedFiles.splice(result.source.index, 1);
        reorderedFiles.splice(result.destination.index, 0, movedFile);

        setFileList(reorderedFiles);
        setProduct({
            ...product,
            images: reorderedFiles.map(file => file.originFileObj as File),
        });
    };

    const handleSubmit = async () => {
        if (!product.name || !product.price || !product.categoryId) {
            notification.error({ message: "Будь ласка, заповніть всі поля!" });
            return;
        }

        try {
            product.images=fileList.map(x=> x.originFileObj as File);
            await createProduct(product).unwrap();
            notification.success({ message: "Продукт створено" });
            navigate("/products");
        } catch {
            notification.error({ message: "Помилка створення продукту" });
        }
    };

    return (
        <div className="max-w-lg mx-auto my-6">
            <h1 className="text-3xl font-bold mb-4">Додати продукт</h1>
            <Input
                name="name"
                placeholder="Назва"
                onChange={handleChange}
                className="mb-2"
                value={product.name}
            />
            <Input
                name="price"
                placeholder="Ціна"
                type="number"
                onChange={handleChange}
                className="mb-2"
                value={product.price}
            />

            <Select
                placeholder="Оберіть категорію"
                onChange={handleCategoryChange}
                loading={isLoading}
                className="mb-2 w-full"
                options={categories?.map((category) => ({
                    value: category.id,
                    label: category.name,
                }))}
                value={product.categoryId || undefined}
            />

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="upload-list" direction="horizontal">
                    {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-wrap gap-2">
                            {fileList.map((file, index) => (
                                <Draggable key={file.uid} draggableId={file.uid} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <Upload
                                                listType="picture-card"
                                                fileList={[file]}
                                                onRemove={() => {
                                                    const newFileList = fileList.filter(f => f.uid !== file.uid);
                                                    setFileList(newFileList);
                                                    setProduct({
                                                        ...product,
                                                        images: newFileList.map(f => f.originFileObj as File),
                                                    });
                                                }}
                                            />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            <Upload
                multiple
                listType="picture-card"
                beforeUpload={() => false}
                onChange={handleImageChange}
                fileList={[]}
                accept="image/*"
            >
                <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Додати</div>
                </div>
            </Upload>

            <Button type="primary" disabled={isLoadingCreate} onClick={handleSubmit} className="mt-4 w-full">
                {isLoadingCreate ? <span>Збереження ...</span> : <span>Зберегти</span>}
            </Button>
        </div>
    );
};

export default CreateProductPage;