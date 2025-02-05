import { FC, useState } from 'react'
import Modal from 'react-modal';

import { XIcon } from 'lucide-react';

import { useMutation } from '@tanstack/react-query';
import { UpdateOrder } from '../../../backend/api';

interface Props {
    isOpen: boolean;
    closeModal: () => void;
    editItem?: any;
    title: string;
}


const StatusModal: FC<Props> = ({ isOpen, closeModal, editItem, title }) => {

    const [error, setError] = useState({
        isError: false,
        message: ''
    });

    const { mutateAsync, isPending } = useMutation({
        mutationFn: async (values: any) => {
            return await UpdateOrder(values, editItem?.itemId);
        },
        retry: false,
        onSettled: (_data: any, error: any) => {

            if (!error) {
                setError({
                    isError: false,
                    message: 'Order updated successfully'
                });
            } else {
                setError({
                    isError: true,
                    message: error?.response ? `${error.response.data.message}` : error?.message
                });

            }

        }
    })


    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={() => {
                setError({
                    isError: false,
                    message: ''
                });
                closeModal();
            }}
            className={`modal w-1/3 h-auto rounded text-gray-600 outline-none`}
            overlayClassName="overlay"
            contentLabel="Modal"
        >
            <div className='flex flex-col p-2 rounded h-full'>
                <div className='flex justify-between items-center mb-2'>

                    <div className='flex flex-col'>

                        <span className='text-lg font-bold'>{title}</span>
                    </div>

                    <button
                        type='button'
                        className='w-9 h-9 bg-gray-200 rounded-full flex justify-center items-center cursor-pointer'
                        onClick={() => {
                            closeModal()
                        }}
                    >
                        <XIcon color='gray' />
                    </button>

                </div>

                <div className='border border-gray-200 mb-5'></div>

                <div className={`flex justify-center items-center  mb-2 ${error.isError ? 'text-red-500' : 'text-green-500'}`}>
                        {error.message}
                    </div>


                <span className='font-bold text-lg flex justify-center items-center mb-5'>
                    {
                        title.toLowerCase() == 'approve order' ? 'Do you want to approve this order?' : 'Do you want to reject this order?'
                    }
                </span>



                <div className='flex justify-center items-center'>
                    <button
                        type="submit"
                        className='secondary-bg-color px-8 py-2 text-white rounded'
                        onClick={async () => {
                            await mutateAsync({
                                ...editItem,
                                status: title.toLowerCase() == 'approve order' ? 'approved' : 'rejected'
                            })
                        }}
                    >

                        {
                            isPending ? 'Loading...' : 'Save'
                        }

                    </button>



                </div>


            </div>

        </Modal >
    )
}

export default StatusModal