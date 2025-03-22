import React, { useState, useEffect } from "react";
import { useAppSelector } from "../../store";
import { Button, Form, Upload, message, Card, Descriptions, Spin } from "antd";
import { UploadOutlined, DeleteOutlined, CloseOutlined } from "@ant-design/icons";
import { 
  useCreatePhotoUserMutation, 
  useGetPhotoUserQuery, 
  useRemovePhotoUserMutation 
} from "../../services/apiUser";
import { APP_ENV } from "../../env";

const ProfilePage: React.FC = () => {
  const { user } = useAppSelector((state) => state.user);
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null); 
  const [createPhoto, { isLoading: isUploading }] = useCreatePhotoUserMutation();
  const [removePhoto, { isLoading: isDeleting }] = useRemovePhotoUserMutation();


  const {data: photoData, refetch, isLoading: isPhotoLoading} = useGetPhotoUserQuery(Number(user?.id), {
    skip: !user?.id 
  });

  const handleUpload = async () => {
    if (!file || !user?.id) return;

    try {
      await createPhoto({ 
        userId: user.id, 
        photo: file 
      }).unwrap();
      
      message.success("Фото успішно оновлено");
      setFile(null);
      setImageUrl(null); 
      refetch(); 
    } catch (error) {
      console.error("Помилка оновлення фото:", error);
      message.error("Не вдалось оновити фото");
    }
  };

  const handleDeletePhoto = async () => {
    if (!user?.id) return;

    try {
      await removePhoto(user.id).unwrap();
      message.success("Фото видалено");
      setImageUrl(null); 
      refetch(); 
    } catch (error) {
      console.error("Помилка видалення фото:", error);
      message.error("Не вдалось видалити фото");
    }
  };

  const handleCancel = () => {
    setFile(null);
    setImageUrl(null);
  };

  useEffect(() => {
    if (user?.id) {
      refetch();
    }
  }, [user?.id, refetch]);

  
  const handlePreview = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result as string); 
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="container mx-auto p-4 flex justify-end">
      <div style={{ width: "300px" }}> 
        <Card title="Профіль користувача" variant="borderless">
          <Descriptions column={1}>
            <Descriptions.Item label="ID">{user?.id}</Descriptions.Item>
            <Descriptions.Item label="Email">{user?.email}</Descriptions.Item>
            <Descriptions.Item label="Ролі">
              {user?.roles?.join(", ")}
            </Descriptions.Item>
          </Descriptions>

          <div className="mt-6">
            <Form layout="vertical">
              <Form.Item label="Аватар">
                <Spin spinning={isPhotoLoading || isDeleting}>
                  {photoData?.photo ? (
                    <div className="mb-4 relative">
                      <img
                        src={`${APP_ENV.REMOTE_MEDIUM_IMAGES_URL}${photoData.photo}`}
                        alt="Avatar"
                        className="w-32 h-32 rounded-full object-cover"
                      />
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={handleDeletePhoto}
                        className="absolute bottom-0 light-0"
                        disabled={isDeleting}
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-gray-400">Немає фото</span>
                    </div>
                  )}
                </Spin>

                <Upload
                  beforeUpload={(file) => {
                    setFile(file);
                    handlePreview(file); 
                    return false;
                  }}
                  showUploadList={false} 
                  disabled={isUploading}
                >
                  <Button 
                    icon={<UploadOutlined />}
                    loading={isUploading}
                  >
                    Вибрати файл
                  </Button>
                </Upload>

                {imageUrl && (
                  <div style={{ marginTop: 16 }}>
                    <h3>Зміниться на:</h3>
                    <img
                      src={imageUrl}
                      alt="preview"
                      style={{ maxWidth: "100%", maxHeight: 150 }}
                    />
                  </div>
                )}

                {file && (
                  <div className="mt-4">
                    <Button
                      type="primary"
                      onClick={handleUpload}
                      className="mr-2"
                      loading={isUploading}
                    >
                      Завантажити
                    </Button>
                    <Button
                      type="default"
                      onClick={handleCancel}
                      icon={<CloseOutlined />}
                    >
                      Скасувати
                    </Button>
                  </div>
                )}
              </Form.Item>
            </Form>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
