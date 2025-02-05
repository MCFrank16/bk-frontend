import { FC, useState } from 'react'
import Modal from 'react-modal';

import { XIcon } from 'lucide-react';

import { Form, Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { useMutation } from '@tanstack/react-query';
import useAuth from '../../../hooks/useAuth';
import { UpdateProduct, CreateProduct, DeleteProduct } from '../../../backend/api';

interface Props {
    isOpen: boolean;
    closeModal: () => void;
    editItem?: any;
}


const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    type: Yup.string().required('Type is required'),
    stock: Yup.number().required('Stock is required'),
    land: Yup.object().shape({
        type: Yup.string().required('Land type is required'),
        quantity: Yup.number().required('Quantity is required')
    }).required('Land details is required')
});


const NewProduct: FC<Props> = ({ isOpen, closeModal, editItem }) => {

    const [error, setError] = useState({
        isError: false,
        message: ''
    });

    const { mutateAsync, isPending } = useMutation({
        mutationFn: async (values: any) => {

            if (editItem) {
                return await UpdateProduct(values, editItem.itemId);
            }
            return await CreateProduct(values);
        },
        retry: false,
        onSettled: (_data: any, error: any) => {

            if (!error) {
                setError({
                    isError: false,
                    message: editItem ? 'Products updated successfully' : 'Products added successfully'
                });
            } else {
                setError(error?.response ? `${error.response.data.message}` : error?.message);
            }

        }
    })


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

                        <span className='text-lg font-bold'>Product</span>
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

                <Formik
                    initialValues={{
                        name: editItem ? editItem.name : '',
                        type: editItem ? editItem.type : '',
                        price: editItem ? editItem.price : '',
                        stock: editItem ? editItem.stock : null,
                        land: {
                            type: editItem ? editItem.landType : '',
                            quantity: editItem ? editItem.landAmount : null
                        }
                    }}
                    validationSchema={validationSchema}
                    onSubmit={async (values) => {
                        const body = { ...values, landDetails: values.land };
                        await mutateAsync(body);
                    }}

                >

                    {() => {
                        return (
                            <Form className=' flex flex-col'>

                                <div className={`flex justify-center items-center  mb-2 ${error.isError ? 'text-red-500' : 'text-green-500'}`}>
                                    {error.message}
                                </div>

                                <div className='flex flex-col mb-3'>
                                    <span className='mb-2 font-bold'>Type</span>
                                    <Field
                                        as='select'
                                        name="type"
                                        className="bg-gray-100 p-2 rounded outline-none"

                                    >
                                        <option value=''>Select product type</option>
                                        <option value='fertilizer'>Fertilizer</option>
                                        <option value='seed'>Seeds</option>
                                    </Field>

                                    <ErrorMessage name='type' render={msg => <span className='text-red-500 text-xs'>{msg}</span>} />
                                </div>

                                <div className='bg-white p-2'>

                                    <div className='flex flex-col mb-5'>
                                        <span className='mb-2 font-bold'>Name</span>
                                        <Field
                                            name="name"
                                            className="bg-gray-100 p-2 rounded outline-none"
                                            placeholder="name"
                                        />

                                        <ErrorMessage name='name' render={msg => <span className='text-red-500 text-xs'>{msg}</span>} />

                                    </div>



                                    <div className='flex flex-col mb-5'>
                                        <span className='mb-2 font-bold'>Stock in KGs</span>
                                        <Field
                                            name="stock"
                                            type='number'
                                            className="bg-gray-100 p-2 rounded outline-none"
                                            placeholder="stock"
                                        />

                                        <ErrorMessage name='stock' render={msg => <span className='text-red-500 text-xs'>{msg}</span>} />

                                    </div>

                                    <div className='flex flex-col mb-5'>
                                        <span className='mb-2 font-bold'>Price per KG</span>
                                        <Field
                                            name="price"
                                            className="bg-gray-100 p-2 rounded outline-none"
                                            placeholder="price"
                                        />

                                        <ErrorMessage name='price' render={msg => <span className='text-red-500 text-xs'>{msg}</span>} />

                                    </div>


                                    <div className='flex flex-col mb-5'>
                                        <span className='mb-2 font-bold'>Land type</span>
                                        <Field
                                            as='select'
                                            name="land.type"
                                            className="bg-gray-100 p-2 rounded outline-none"

                                        >
                                            <option value=''>Select land type to use it on</option>
                                            <option value='wet'>Wet</option>
                                            <option value='dry'>Dry</option>
                                        </Field>

                                        <ErrorMessage name='land.type' render={msg => <span className='text-red-500 text-xs'>{msg}</span>} />
                                    </div>

                                    <div className='flex flex-col mb-5'>
                                        <span className='mb-2 font-bold'>Amount on land in KGs</span>
                                        <Field
                                            name="land.quantity"
                                            type='number'
                                            className="bg-gray-100 p-2 rounded outline-none"
                                            placeholder="Amount to use on land"
                                        />

                                        <ErrorMessage name='land.quantity' render={msg => <span className='text-red-500 text-xs'>{msg}</span>} />

                                    </div>


                                    <div className='flex justify-center items-center'>
                                        <button
                                            type="submit"
                                            className='secondary-bg-color px-8 py-2 text-white rounded'
                                        >

                                            {
                                                isPending ? 'Loading...' : 'Save'
                                            }

                                        </button>
                                    </div>
                                </div>


                            </Form>
                        )
                    }}

                </Formik>


            </div>

        </Modal >
    )
}

export default NewProduct