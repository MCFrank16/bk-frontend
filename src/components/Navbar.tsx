import { FC, useEffect, useState } from 'react'
import { CircleUser, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router';

type props = {
  user: any,
}

const Navbar: FC<props> = ({ user }) => {

  const navigate = useNavigate();



  const [drop, setDrop] = useState(true);

  const handleDrop = () => {
    setDrop(!drop);
  };

  useEffect(() => {
    // setUser({
    //   name: "Frank Mutabazi",
    //   email: "mecfrank@yahoo.fr",
    //   phone: "+2500788715109",
    //   land: {
    //     size: 1,
    //     measurements: 'acres',
    //     location: "Kicukiro"
    //   }
    // })
  })

  return (
    <header className='main-bg-color flex justify-between items-center px-4 py-2'>
      <span className='text-xl Lato cursor-pointer' onClick={() => navigate("/")}>
        Agro-farm
      </span>

      <div className='flex space-x-4'>

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


            <span
              className="block px-4 py-2 text-gray-600 cursor-pointer hover:bg-gray-400 hover:text-white"
              onClick={() => {
                console.log("ndaje");
              }
              }
            >
              My account
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
            Sign in
          </button>

          <button
            className="border border-gray-600 text-gray-600 px-8 py-2 rounded cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </button>


        </div>}



      </div>

    </header>
  )

}

export default Navbar
