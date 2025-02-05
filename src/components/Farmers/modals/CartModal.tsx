import { FC, useEffect, useState } from 'react'
import { XIcon } from 'lucide-react';
import Modal from 'react-modal';
import { useMutation } from '@tanstack/react-query';
import { PlaceOrder } from '../../../backend/api';
import useAuth from '../../../hooks/useAuth';


interface Props {
    isOpen: boolean;
    closeModal: () => void;
    cart: any;
}

const CartModal: FC<Props> = ({ isOpen, closeModal, cart }) => {

    const { user: { user } } = useAuth();

    const { cart: items, setCart } = cart;


    const [error, setError] = useState({
        isError: false,
        message: ''
    });



    const { mutateAsync, isPending } = useMutation({
        mutationFn: async (values: any) => {
            return await PlaceOrder(values);
        },
        retry: false,
        onSettled: (_data: any, error: any) => {

            if (!error) {
                setCart([]);
                setError({
                    isError: false,
                    message: 'Order placed successfully'
                });
            } else {

                setError({
                    isError: true,
                    message: error?.response ? `${error.response.data.message}` : error?.message
                });
            }

        }
    })

    useEffect(() => {
        if (items?.length == 0) closeModal();
    }, [items])

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={() => closeModal()}
            className={`modal w-1/3 h-auto rounded text-gray-600 outline-none`}
            overlayClassName="overlay"
            contentLabel="Modal"
        >
            <div className='flex flex-col p-2 rounded h-full'>
                <div className='flex justify-between items-center mb-2'>

                    <div className='flex flex-col'>

                        <span className='text-lg font-bold'>Items in cart</span>
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

                <div className='flex flex-col'>
                    {items.map((item: any, index: number) => (
                        <div key={index} className='flex justify-between items-center mb-2'>
                            <span className='font-bold'>{item.name}</span>



                            <div className='flex flex-col bg-gray-200 p-3 rounded relative'>

                                <span
                                    className="absolute -top-2 -right-2 secondary-bg-color text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full cursor-pointer"
                                    onClick={() => {
                                        const updatedData = items.filter((it: any) => it.id !== item.id);

                                        setCart(() => {
                                            return [...updatedData]
                                        })
                                    }}
                                >
                                    <XIcon size={15} />
                                </span>

                                <span className='text-sm'>Quantity: {item.amount}</span>
                                <span className='text-sm'>Price: {item.price} RWF</span>
                                <span className='text-sm'>Total: {item.total} RWF</span>
                            </div>

                        </div>
                    ))}

                    <div className='flex justify-end items-end mt-5'>
                        <span className='text-lg font-bold'>Total: {items.reduce((acc: number, item: any) => acc + item.total, 0)} RWF</span>

                    </div>

                    {items?.length > 0 && <div className='w-full flex justify-center items-center mt-5'>

                        <button type='submit' className='secondary-bg-color text-white rounded p-2 w-1/2 cursor-pointer' onClick={async () => {
                            items.map(async (item: any) => {

                                const body = {
                                    farmerId: user?._id,
                                    productId: item?.itemId,
                                    quantity: item?.amount,
                                }


                                await mutateAsync({
                                    ...body
                                })
                            });
                        }}
                        >
                            {
                                isPending ? 'Loading...' : 'Checkout'
                            }

                        </button>

                    </div>}


                </div>



            </div>

        </Modal >
    )
}

export default CartModal
