import { FC } from 'react';

const NotFound: FC = () => {
    return (
        <div className="flex items-center justify-center h-screen mainBackground text-4xl">
            <div className='flex flex-col'>
                <span className="flex justify-center items-center font-bold text-gray-600 uppercase">404</span>
                <span className="items-center font-bold text-gray-600 uppercase">Page not found</span>
            </div>
        </div>
    )
}

export default NotFound
