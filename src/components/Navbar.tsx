import { FC, useState, useEffect } from 'react'
import { CircleUser, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router';
import useAuth from '../hooks/useAuth';
import ProfileModal from './Farmers/modals/ProfileModal';

interface Props {
  showProfile?: boolean;
}

const Navbar: FC<Props> = ({ showProfile }) => {

  const navigate = useNavigate();

  const { user: { user, setUser } } = useAuth();

  const [openProfile, setOpenProfile] = useState(false);

  const [drop, setDrop] = useState(true);

  const handleDrop = () => {
    setDrop(!drop);
  };

  useEffect(() => {
    if (showProfile) {
      setOpenProfile(true)
    }
  }, [showProfile])


  return (
    <header className='main-bg-color flex items-center px-4 py-2'>
      <span className='text-xl Lato cursor-pointer' onClick={() => {
        if (user?.type != 'admin') navigate("/")
      }}>
        Agro-farm
      </span>

      <div className='flex-grow flex justify-end items-center space-x-4'>

        {user && <div
          className=" flex cursor-pointer items-center font-medium relative space-x-4"
          onClick={() => handleDrop()}
        >
          <CircleUser color='#4A6B6F' size="40" />

          <span className="">{user?.["name"]}</span>

          {drop ? <ChevronDown /> : <ChevronUp />}

          <div
            className={`absolute bg-white rounded shadow-xl z-10 w-full top-12 ${drop && "hidden"
              }`}
          >


            {user?.type != 'admin' && <span
              className="block px-4 py-2 text-gray-600 cursor-pointer hover:bg-gray-400 hover:text-white"
              onClick={() => {
                setOpenProfile(true);
              }
              }
            >
              My account
            </span>}

            <span
              className="block px-4 py-2 text-gray-600 cursor-pointer hover:bg-gray-400 hover:text-white"
              onClick={() => {
                setUser(null);
                localStorage.removeItem('user');
                navigate('/');
              }
              }
            >
              Logout
            </span>

          </div>
        </div>}

        {!user && <div
          className=" flex justify-between cursor-pointer items-center space-x-3"
          onClick={() => handleDrop()}
        >
          

          <button
            className="secondary-bg-color text-white px-8 py-2 rounded cursor-pointer"
            onClick={() => navigate("/signin")}
            >
             login
          </button>

          <button
            className="border border-gray-600 text-black px-8 py-2 rounded cursor-pointer"
            onClick={() => navigate("/signup")}
            >
            signup
          </button>


          <button
            className="border border-gray-600 text-black px-8 py-2 rounded cursor-pointer"
            onClick={() => navigate("/admin/login")}
            >
            admin
          </button>


        </div>}

        {
          openProfile && <ProfileModal isOpen={openProfile} closeModal={() => {
            setOpenProfile(false);
          }} />
        }



      </div>

    </header>
  )

}

export default Navbar
