import { FC, useEffect } from "react";
import { Route, Routes } from 'react-router';
import Admin from './Admins/Admin';
import Farmer from './Farmers/Farmer';
import NotFound from './NotFound';
import Login from "../components/Farmers/Login";
import Register from "../components/Farmers/Register";
import useAuth from "../hooks/useAuth";
import AdminLogin from "./Admins/AdminLogin";


const Routing: FC = () => {

    const { user: { setUser } } = useAuth();

    useEffect(() => {
        const localStorageUser = localStorage.getItem('user')

        console.log('the user', localStorageUser);

        if (localStorageUser) {
            setUser(JSON.parse(localStorageUser));
        }


    }, [])

    return (
        <Routes>
            <Route path="*" element={<NotFound />} />

            <Route path='/' element={<Farmer />} />

            <Route path='/signin' element={<Login />} />

            <Route path='/admin/login' element={<AdminLogin />} />

            <Route path='/signup' element={<Register />} />

            <Route path='/admin' element={<Admin />} />

        </Routes>
    )
}

export default Routing;
