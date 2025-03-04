import {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Button, Input, Upload, Select, Form} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {useGetProductQuery, useUpdateProductMutation} from "../../services/apiProduct";
import {useGetCategoriesQuery} from "../../services/apiCategory";
import {UploadFile} from "antd/es/upload/interface";
import {DragDropContext, Droppable, Draggable} from "@hello-pangea/dnd";
import {DropResult} from "@hello-pangea/dnd";
import {APP_ENV} from "../../env";
import {IProductPutRequest} from "../../services/types";
import Item from "antd/es/list/Item";


const EditProductPage = () => {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const {data: productData} = useGetProductQuery(Number(id));
    const {data: categories, isLoading: isCategoriesLoading, error: categoriesError} = useGetCategoriesQuery();
    const [updateProduct] = useUpdateProductMutation();

    const [form] = Form.useForm<IProductPutRequest>();

    const [fileList, setFileList] = useState<UploadFile[]>([]);

    useEffect(() => {
        if (productData) {

            console.log("Category id", productData.categoryId);
            form.setFieldsValue({
                ...form.getFieldsValue(),
                ...productData
            });

            const updatedFileList: UploadFile[] = productData.images?.map((image) => ({
                uid: image.id.toString(),
                name: image.name,
                url: `${APP_ENV.REMOTE_LARGE_IMAGES_URL}${image.name}`,
                originFileObj: new File([new Blob([''])],image.name,{type: 'old-image'})
            } as UploadFile)) || [];

            setFileList(updatedFileList);
        }
    }, [productData]);


    const handleImageChange = (info: { fileList: UploadFile[] }) => {
        const newFileList = info.fileList.map((file, index) => ({
            ...file,
            uid: file.uid || Date.now().toString(),
            order: index,
        }));

        setFileList([...fileList, ...newFileList]);
    };

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const reorderedFiles = Array.from(fileList);
        const [movedFile] = reorderedFiles.splice(result.source.index, 1);
        reorderedFiles.splice(result.destination.index, 0, movedFile);
        setFileList(reorderedFiles);
    };


    const onFinish = async (values: IProductPutRequest) => {
        try {
            values.id = Number(id);
            values.images=fileList.map(x=> x.originFileObj as File);
            console.log("Submit Form", values);
            await updateProduct(values).unwrap();
            navigate("..");
        } catch (error) {
            console.error("Помилка під час створення категорії:", error);
        }
    }




    return (
        <div className="max-w-lg mx-auto my-6">
            <h1 className="text-3xl font-bold mb-4">Редагування продукт</h1>
            <Form
                form={form}
                onFinish={onFinish}
                layout="vertical">

                <Form.Item name="name" label="Назва" rules={[{ required: true, message: 'Будь ласка, введіть назву групи!' }]}>
                    <Input placeholder="Назва" />
                </Form.Item>

                <Form.Item name="price" label="Ціна" rules={[{ required: true, message: 'Будь ласка, введіть назву групи!' }]}>
                    <Input placeholder="Ціна" />
                </Form.Item>

                {isCategoriesLoading ? (
                    <p>Loading categories...</p>
                ) : categoriesError ? (
                    <p className="text-red-500">Failed to load categories</p>
                ) : (
                    <Form.Item
                        label="Категорія"
                        name="categoryId"
                        htmlFor="categoryId"
                        rules={[{required: true, message: "Це поле є обов'язковим!"}]}
                    >
                        <Select placeholder="Оберіть категорію: " options={categories?.map(category =>
                        {
                            return {
                                value: category.id,
                                label: category.name,
                            };

                        })}/>
                    </Form.Item>
                )}



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
                                                        // setProduct({
                                                        //     ...product,
                                                        //     images: newFileList.map(f => f.originFileObj as File),
                                                        // });
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
                        <PlusOutlined/>
                        <div style={{marginTop: 8}}>Додати</div>
                    </div>
                </Upload>

                <Item>
                    <Button type="primary" htmlType="submit" block>
                        Зберегти
                    </Button>
                </Item>
            </Form>
        </div>
    );
};

export default EditProductPage;