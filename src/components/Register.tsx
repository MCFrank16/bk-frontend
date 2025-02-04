import React, { FC } from 'react'
import Navbar from './Navbar';
import Footer from './Footer';
import { Form, Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

interface FormValues {
    name: string;
    email: string;
    phone: string;
    password: string;
}


const Register: FC = () => {

    const initialValues: FormValues = {
        name: '',
        email: '',
        phone: '',
        password: '',
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),
        phone: Yup.string().required('Phone number is required'),
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .required('Password is required'),
    });


    return (
        <div className='h-full flex flex-col'>
            <Navbar user={null} />

            <div className='flex-grow flex justify-center items-center'>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values, action) => {
                        console.log("the values", values);
                    }}

                >

                    {() => {
                        return (
                            <Form className='w-1/3 bg-white flex flex-col p-2'>

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
                                    <span className='mb-2 font-bold'>Email</span>
                                    <Field
                                        name="email"
                                        className="bg-gray-100 p-2 rounded outline-none"
                                        placeholder="email"
                                    />

                                    <ErrorMessage name='email' render={msg => <span className='text-red-500 text-xs'>{msg}</span>} />

                                </div>

                                <div className='flex flex-col mb-5'>
                                    <span className='mb-2 font-bold'>Phone number</span>
                                    <Field
                                        name="phone"
                                        className="bg-gray-100 p-2 rounded outline-none"
                                        placeholder="Phone number"
                                    />

                                    <ErrorMessage name='phone' render={msg => <span className='text-red-500 text-xs'>{msg}</span>} />

                                </div>

                                <div className='flex flex-col mb-5'>
                                    <span className='mb-2 font-bold'>Password</span>
                                    <Field
                                        name="password"
                                        className="bg-gray-100 p-2 rounded outline-none"
                                        placeholder="password"
                                    />

                                    <ErrorMessage name='password' render={msg => <span className='text-red-500 text-xs'>{msg}</span>} />

                                </div>

                                <div className='flex justify-center items-center'>
                                    <button
                                        type="submit"
                                        className='secondary-bg-color px-8 py-2 text-white rounded'
                                    >

                                        Register
                                        {/* {
                                            isPending ? <Oval height="15" width="15" color='white' /> : lang === 'en' ? 'Submit' : 'Soumettre'
                                        } */}

                                    </button>
                                </div>

                            </Form>
                        )
                    }}

                </Formik>

                <div >

                </div>

            </div>
            <Footer />
        </div>
    )
}

export default Register
