import { RequestHandler } from '../utils/AxiosConfig';

export const getAllProducts = (query: string) => {

    return RequestHandler({
        url: `/product?${query}`,
        method: 'GET'
    })
};

export const CreateProduct = (data: any) => {
    return RequestHandler({
        url: `/product/create`,
        data,
        method: 'POST'
    })
};

export const UpdateProduct = (data: any, id: string) => {
    return RequestHandler({
        url: `/product/update/${id}`,
        data,
        method: 'PUT'
    })
};

export const DeleteProduct = (id: string) => {
    return RequestHandler({
        url: `/product/delete/${id}`,
        method: 'DELETE'
    })
};

export const getAllOrders = (id: string | null) => {
    
    return RequestHandler({
        url:  id ? `/order?id=${id}` : `/order`,
        method: 'GET'
    })
};


export const LoginFarmer = (data: any) => {
    return RequestHandler({
        url: `/farmer/login`,
        data,
        method: 'POST'
    })
};

export const RegisterFarmer = (data: any) => {
    return RequestHandler({
        url: `/farmer/create`,
        data,
        method: 'POST'
    })
};

export const LoginAdmin = (data: any) => {
    return RequestHandler({
        url: `/admin/login`,
        data,
        method: 'POST'
    })
};


export const UpdateFarmer = (data: any, id: string) => {
    return RequestHandler({
        url: `/farmer/update/${id}`,
        data,
        method: 'PUT'
    })
};

export const PlaceOrder = (data: any) => {
    return RequestHandler({
        url: `/order/create`,
        data,
        method: 'POST'
    })
};

export const UpdateOrder = (data: any, id: string) => {
    return RequestHandler({
        url: `/order/update/${id}`,
        data,
        method: 'PUT'
    })
};




