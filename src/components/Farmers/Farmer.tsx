import { FC, useState } from 'react'

import { useLocation, Navigate } from 'react-router';

import Products from './Products';
import MyProducts from './MyOrders';
import Navbar from '../Navbar';
import useAuth from '../../hooks/useAuth';

import { ShoppingBag } from 'lucide-react';
import CartModal from './modals/CartModal';

const Farmer: FC = () => {

    const location = useLocation();

    const { user: { user } } = useAuth();


    const [activeTab, setActiveTab] = useState("products")

    const [cart, setCart] = useState<any>([]);
    const [openCart, setOpenCart] = useState(false);
    const [openProfile, setOpenProfile] = useState(false);

    const activeColor = 'secondary-bg-color px-8 py-4 rounded text-white text-lg cursor-pointer';
    const inactiveColor = 'border border-gray-600 px-8 py-4 rounded text-gray-600 cursor-pointer';


    if (activeTab == 'mine' && user == null) {
        return (
            <Navigate to="/signin" state={{ from: location }} replace />
        )
    }

    return (
        <div className='flex flex-col bg-gray-100 '>
            <Navbar showProfile={openProfile} />

            <div className='flex justify-center items-center flex-grow'>

                <div className='w-5/6 mt-20 mb-10'>

                    <div className='flex justify-between items-center'>
                        <div className='flex space-x-4 mb-5'>
                            <span
                                className={`${activeTab === 'products' ? activeColor : inactiveColor}`}
                                onClick={() => setActiveTab("products")}
                            >All Products</span>
                            {user && <span
                                className={`${activeTab === 'mine' ? activeColor : inactiveColor}`}
                                onClick={() => setActiveTab("mine")}
                            >My orders</span>}
                        </div>

                        {cart.length > 0 && <div className={`${inactiveColor} flex space-x-2 items-center relative`} onClick={() => setOpenCart(true)}>

                            <span className="absolute -top-4 -right-4 secondary-bg-color text-white text-xs font-bold w-7 h-7 flex items-center justify-center rounded-full">
                                {cart.length}
                            </span>

                            <ShoppingBag />

                            <span className="">
                                Cart
                            </span>
                        </div>}
                    </div>

                    {(user != null && user?.land == null) && (<div className='flex space-x-1.5'>
                        <span className=' font-bold'>To be able to place order you need to update your profile and add land details.</span>
                        <span className='text-blue-500 cursor-pointer' onClick={() => {
                            setOpenProfile(true);
                        }}>Click here to update.</span>
                    </div>)}


                    {activeTab == 'products' ? <Products cart={{ cart, setCart, openCart }} /> : <MyProducts />}

                    {openCart && <CartModal isOpen={openCart} cart={{ cart, setCart }} closeModal={() => {
                        setOpenCart(false);
                    }} />}

                </div>
            </div>
            {/* <Footer /> */}
        </div>
    )

}

export default Farmer
