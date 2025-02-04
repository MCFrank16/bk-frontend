import { FC, useState } from 'react'
import Footer from '../Footer'
import Products from './Products';
import MyProducts from './MyProducts';
import Navbar from '../Navbar';



const Farmer: FC = () => {

    const [activeTab, setActiveTab] = useState("products")

    const activeColor = 'secondary-bg-color px-8 py-4 rounded text-white text-lg cursor-pointer';
    const inactiveColor = 'border border-gray-600 px-8 py-4 rounded text-gray-600 cursor-pointer';

    return (
        <div className='flex flex-col bg-gray-100 h-screen'>
            <Navbar user={null} />
            <div className='flex-grow flex justify-center h-1'>
                
                <div className='w-5/6 mt-20 mb-10 h-1'>

                    <div className='flex space-x-4 mb-5'>
                        <span
                            className={`${activeTab === 'products' ? activeColor : inactiveColor}`}
                            onClick={() => setActiveTab("products")}
                        >All Products</span>
                        <span
                            className={`${activeTab === 'mine' ? activeColor : inactiveColor}`}
                            onClick={() => setActiveTab("mine")}
                        >My products</span>
                    </div>

                    {activeTab == 'products' ? <Products /> : <MyProducts />}
                </div>
            </div>
            <Footer />
        </div>
    )

}

export default Farmer


