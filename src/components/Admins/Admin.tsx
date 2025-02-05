import { FC, useEffect, useState } from 'react'
import { useLocation, Navigate } from 'react-router';

import Navbar from '../Navbar'
import useAuth from '../../hooks/useAuth';

import Products from './Products';
import Orders from './Orders';


const Admin: FC = () => {


  const location = useLocation();

  const { user: { user } } = useAuth();

  const [activeTab, setActiveTab] = useState("products")
  const [redirect, setRedirect] = useState(false);

  const activeColor = 'secondary-bg-color px-8 py-4 rounded text-white text-lg cursor-pointer';
  const inactiveColor = 'border border-gray-600 px-8 py-4 rounded text-gray-600 cursor-pointer';

  useEffect(() => {
    if ((user && user?.type !== 'admin')) {
      localStorage.removeItem('user');
      setRedirect(true);
    }
  }, [user])

  if (redirect) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return (
    <div className='flex flex-col bg-gray-100 '>
      <Navbar />

      <div className='flex justify-center items-center flex-grow'>

        <div className='w-5/6 mt-20 mb-10'>

          <div className='flex justify-between items-center'>
            <div className='flex space-x-4 mb-5'>
              <span
                className={`${activeTab === 'products' ? activeColor : inactiveColor}`}
                onClick={() => setActiveTab("products")}
              >Products</span>
              <span
                className={`${activeTab === 'mine' ? activeColor : inactiveColor}`}
                onClick={() => setActiveTab("mine")}
              >Orders</span>
            </div>

          </div>



          {activeTab == 'products' ? <Products /> : <Orders />}
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  )

}

export default Admin
