export interface ICategoryItem {
    id: number,
    name: string,
    image: string,
    description: string,
}

// CategoryModel.ts
export interface ICategoryPostRequest {
    name: string;         
    image: File|null;         
    description: string;
}

export interface ICategoryPutRequest extends Partial<ICategoryPostRequest> {
    id: number;
}

export interface IProductItem {
    id: number;
    name: string;
    price: number;
    categoryId: string;
    images: {
        id: number;
        name: string;
        priority: number;
        productId: number | null;
    }[];
}

export interface IProductPostRequest {
    name: string;
    price: number;
    categoryId: string;
    images?: File[];
}
export interface IProductPutRequest {
    id: number;
    name: string;
    price: number;
    categoryId: string;
    images?: File[];
}
export interface IPhotoUserPutRequest {
    userId: number;
    photo: File;
}
