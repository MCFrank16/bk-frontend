import axios, { AxiosRequestConfig } from 'axios';

// const baseURL = import.meta.env.VITE_APP_BACKEND_URL;

const baseURL = import.meta.env.VITE_APP_PROD_URL;

const axiosInstance = axios.create({
	baseURL: baseURL,
	headers: {
		"Content-Type": "application/json",
	}
});

const RequestHandler = (props: AxiosRequestConfig) => {
    return axiosInstance({ ...props });
}

export {
    RequestHandler,
    axiosInstance
};
