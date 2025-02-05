import { FC, useState } from 'react'
import Modal from 'react-modal';

import { XIcon } from 'lucide-react';

import { Form, Formik, Field, ErrorMessage } from 'formik';

import { useMutation } from '@tanstack/react-query';
import useAuth from '../../../hooks/useAuth';
import { UpdateFarmer } from '../../../backend/api';

interface Props {
    isOpen: boolean;
    closeModal: () => void;
}

const ProfileModal: FC<Props> = ({ isOpen, closeModal }) => {

    const { user: { setUser, user } } = useAuth();

    const [error, setError] = useState({
        isError: false,
        message: ''
    });

    const { mutateAsync, isPending } = useMutation({
        mutationFn: async (values: any) => {
            let body: { name: string; landDetails?: any } = {
                name: values["name"],
            };

            if (values["land"] != null) {
                body["landDetails"] = values["land"];
            }

            return await UpdateFarmer(body, user?._id);
        },
        retry: false,
        onSettled: (data: any, error: any) => {

            if (!error) {
                setError({
                    isError: false,
                    message: 'Profile updated successfully'
                });
                setUser(data.data.data);
                localStorage.setItem('user', JSON.stringify(data.data.data));

            } else {
                setError(error?.response ? `${error.response.data.message}` : error?.message);
            }

        }
    })

    return (
        // @ts-ignore
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

                        <span className='text-lg font-bold'>My profile</span>
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
                        name: user?.name,
                        land: { ...user?.land }
                    }}
                    onSubmit={async (values) => {
                        await mutateAsync(values);
                    }}

                >

                    {() => {
                        return (
                            <Form className=' flex flex-col'>

                                <div className={`flex justify-center items-center  mb-2 ${error.isError ? 'text-red-500' : 'text-green-500'}`}>
                                    {error.message}
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
                                        <span className='mb-2 font-bold'>Land size in acres</span>
                                        <Field
                                            name="land.size"
                                            className="bg-gray-100 p-2 rounded outline-none"
                                            placeholder="Land size"
                                        />

                                    </div>

                                    <div className='flex flex-col mb-5'>
                                        <span className='mb-2 font-bold'>Land type</span>
                                        <Field
                                            as='select'
                                            name="land.type"
                                            className="bg-gray-100 p-2 rounded outline-none"

                                        >
                                            <option value=''>Select land type</option>
                                            <option value='wet'>Wet land</option>
                                            <option value='dry'>Dry land</option>
                                        </Field>


                                    </div>

                                    <div className='flex flex-col mb-5'>
                                        <span className='mb-2 font-bold'>Land location</span>
                                        <Field
                                            name="land.location"
                                            className="bg-gray-100 p-2 rounded outline-none"
                                            placeholder="Land location"
                                        />

                                    </div>

                                    <div className='flex justify-center items-center'>
                                        <button
                                            type="submit"
                                            className='secondary-bg-color px-8 py-2 text-white rounded'
                                        >

                                            {
                                                isPending ? 'Loading...' : 'Update'
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

export default ProfileModal