import { FC } from "react";

const Footer: FC = () => {

  const currentYear = new Date().getFullYear();


  return (
    <div className='main-bg-color h-16 flex justify-center items-center p-4'>

      <div className='h-10 flex items-center space-x-4'>
        <p className='text-xs'>© {currentYear} Agro-input store</p>
      </div>

    </div>
  )
}

export default Footer