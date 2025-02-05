import { FC, useState } from 'react'
import { useNavigate } from 'react-router';
import Footer from '../Footer';
import { Form, Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import useAuth from '../../hooks/useAuth';
import { LoginAdmin } from '../../backend/api';

interface FormValues {
  email: string;
  password: string;
}


const AdminLogin: FC = () => {

  const { user: { setUser} } = useAuth();

  const navigate = useNavigate();
  const [error, setError] = useState("");

  const initialValues: FormValues = {
      email: '',
      password: '',
  };

  const validationSchema = Yup.object({
      email: Yup.string()
          .email('Invalid email address')
          .required('Email is required'),
      password: Yup.string().required('Password is required'),
  });

  const { mutateAsync, isPending, isError } = useMutation({
      mutationFn: async (values: any) => {
          const body = {
              email: values["email"],
              password: values["password"]
          };

          return await LoginAdmin(body);
      },
      retry: false,
      onSettled: (data: any, error: any) => {
          if (!error) {
              setError("");
              setUser({ ...data.data.data, type: 'admin' });
              localStorage.setItem('user', JSON.stringify({ ...data.data.data, type: 'admin' }));
              navigate('/admin');
          } else {
              setError(error?.response ? `${error.response.data.message}` : error?.message);
          }
      }
  })

  return (
    <div className='h-full flex flex-col'>

        <div className='flex-grow flex justify-center items-center'>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={async (values) => {
                    setError("");
                    await mutateAsync(values);
                }}

            >

                {() => {
                    return (
                        <Form className='w-1/3 flex flex-col'>

                            { isError && <div className='flex justify-center items-center text-red-500 mb-2'>
                                {error}
                            </div>}

                            <div className='bg-white p-2'>
                                <div className='flex flex-col mb-3'>
                                    <span className='mb-2 font-bold'>Email</span>
                                    <Field
                                        name="email"
                                        className="bg-gray-100 p-2 rounded outline-none"
                                        placeholder="email"
                                    />

                                    <ErrorMessage name='email' render={msg => <span className='text-red-500 text-xs'>{msg}</span>} />

                                </div>

                                <div className='flex flex-col mb-5'>
                                    <span className='mb-2 font-bold'>Password</span>
                                    <Field
                                        name="password"
                                        type='password'
                                        className="bg-gray-100 p-2 rounded outline-none"
                                        placeholder="password"
                                    />

                                    <ErrorMessage name='password' render={msg => <span className='text-red-500 text-xs'>{msg}</span>} />

                                </div>

                                <div className='flex justify-center items-center'>
                                    <button
                                        type="submit"
                                        className='secondary-bg-color px-8 py-2 text-white rounded cursor-pointer'
                                    >

                                        {
                                            isPending ? 'Loading...' : 'Login'
                                        }

                                    </button>
                                </div>
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

export default AdminLogin