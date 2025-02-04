import { FC } from "react";
import { Route, Routes } from 'react-router';
import Admin from './Admin';
import Farmer from './Farmers/Farmer';
import NotFound from './NotFound';
import Login from "./Login";
import Register from "./Register";


const Routing: FC = () => {

    return (
        <Routes>
            <Route path="*" element={<NotFound />} />

            <Route path='/' element={<Farmer />} />

            <Route path='/signin' element={<Login />} />

            <Route path='/signup' element={<Register />} />

            <Route path='/admin' element={<Admin />} />

        </Routes>
    )
}

export default Routing;
