import { FC } from 'react'
import Modal from 'react-modal';

import { XIcon } from 'lucide-react';

interface Props {
    isOpen: boolean;
    closeModal: () => void;
}
const BuyModal: FC<Props> = ({ isOpen, closeModal }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={() => closeModal()}
            className={`modal w-1/3 h-auto rounded text-gray-600`}
            overlayClassName="overlay"
            contentLabel="Modal"
        >
            <div className='flex flex-col p-2 rounded h-full '>
                <div className='flex justify-between items-center mb-2'>

                    <div className='flex flex-col'>

                        <span className='text-lg font-bold'>Place order</span>
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

                {/* <Formik
                    initialValues={{
                        type: item?.type,
                        service: {
                            en: item?.details?.newService['en'],
                            fr: item?.details?.newService['fr'],
                        },
                        provider: {
                            en: item?.type !== 'existing' ? item?.details?.userDetails['name'] : item?.service?.provider?.details?.['en'],
                            fr: item?.type !== 'existing' ? item?.details?.userDetails['name'] : item?.service?.provider?.details?.['fr'],
                        },
                        number: item?.type === 'existing' ? item?.service?.details?.number : '',
                    }}
                    validationSchema={Yup.object().shape({
                        service: Yup.object().shape({
                            en: Yup.string().required(`${lang === 'en' ? 'Service name in english is required' : 'Nom de service en anglais est requis'}`),
                            fr: Yup.string().required(`${lang === 'en' ? 'Service name in french is required' : 'Nom de service en français est requis'}`)
                        }),
                        provider: Yup.object().shape({
                            en: Yup.string().required(`${lang === 'en' ? 'Provider name in english is required' : 'Nom du fournisseur en anglais est requis'}`),
                            fr: Yup.string().required(`${lang === 'en' ? 'Provider name in french is required' : 'Nom du fournisseur en français est requis'}`),
                        }),
                        number: Yup.string().matches(/^\d+$/, `${lang === 'en' ? 'Only numbers are allowed' : 'Seuls les chiffres sont autorisés'}`).when('type', ([type], schema) => {
                            return (type !== 'existing') ? schema.required(`${lang === 'en' ? 'Associated form number is required' : 'Le numéro de formulaire associé est requis'}`) : schema;
                        })

                    })}
                    onSubmit={async (values, _actions) => {
                        const obj = {
                            provider: { ...values["provider"], id: item?.type === 'existing' ? 'edit' : 'new' },
                            details: { ...values["service"], number: values["number"] },
                            reviewer: { ...item?.details?.userDetails, status: 'disabled' },
                            requestId: item?.id,
                        }

                        await mutateAsync(obj);

                    }}
                >
                    {({ values }) => {
                        return (
                            <Form className='flex flex-col flex-grow text-gray-600'>


                                {
                                    item?.type === 'existing' ?
                                        <div className='flex flex-col'>
                                            <span className=''>
                                                {ReactHtmlParser(lang ===  'en' ? `Are you sure you want to add <b>${item?.details?.userDetails?.name}</b> as a reviewer on <b>${item?.service?.details?.en}</b>?` : `Voulez-vous ajouter <b>${item?.details?.userDetails?.name}</b> en tant que reviseur de <b>${item?.service?.details?.en}</b>?`)}
                                            </span>
                                        </div>
                                        :
                                        <>
                                            <div className='flex flex-col mb-3'>
                                                <span className='font-bold mb-1'>{lang === 'en' ? 'Service owner' : 'Propriétaire du service'}</span>

                                                <div className='grid grid-cols-2 gap-2'>

                                                    <div className='flex flex-col'>
                                                        <Field
                                                            name="provider.en"
                                                            disabled={values?.type === 'existing'}
                                                            className="bg-gray-200 p-2 rounded outline-none"
                                                            placeholder={lang === 'en' ? 'Provider name in english' : 'Nom du fournisseur en anglais'}
                                                        />

                                                        <ErrorMessage name='provider.en' render={msg => <span className='text-red-500 text-xs'>{msg}</span>} />
                                                    </div>

                                                    <div className='flex flex-col'>
                                                        <Field
                                                            name="provider.fr"
                                                            disabled={values?.type === 'existing'}
                                                            className="bg-gray-200 p-2 rounded outline-none"
                                                            placeholder={lang === 'en' ? 'Provider name in french' : 'Nom du fournisseur en français'}
                                                        />

                                                        <ErrorMessage name='provider.fr' render={msg => <span className='text-red-500 text-xs'>{msg}</span>} />
                                                    </div>

                                                </div>

                                            </div>

                                            <div className='flex flex-col mb-3'>
                                                <span className='font-bold mb-1'>{ lang === 'en' ? 'Service details' : 'Details du service'}</span>

                                                <div className='grid grid-cols-2 gap-2'>

                                                    <div className='flex flex-col'>
                                                        <Field
                                                            name="service.en"
                                                            disabled={values?.type === 'existing'}
                                                            className="bg-gray-200 p-2 rounded outline-none"
                                                            placeholder={lang === 'en' ? 'Service name in english' : 'Nom du service en anglais'}
                                                        />

                                                        <ErrorMessage name='service.en' render={msg => <span className='text-red-500 text-xs'>{msg}</span>} />
                                                    </div>

                                                    <div className='flex flex-col'>
                                                        <Field
                                                            name="service.fr"
                                                            disabled={values?.type === 'existing'}
                                                            className="bg-gray-200 p-2 rounded outline-none"
                                                            placeholder={lang === 'en' ? 'Service name in french' : 'Nom du service en français'}
                                                        />

                                                        <ErrorMessage name='service.fr' render={msg => <span className='text-red-500 text-xs'>{msg}</span>} />
                                                    </div>

                                                </div>



                                            </div>

                                            <div className='flex flex-col mb-5'>

                                                <div className='flex justify-between items-center mb-2'>

                                                    <span className='font-bold'>{lang === 'en' ? 'Associated form number' : 'Le numéro de formulaire associé'}</span>

                                                    <Tooltip
                                                        title={
                                                            <span className='text-sm'>
                                                                {lang === 'en' ? 'The associated form number is generated and managed by the system developers.' : "Le numéro de formulaire associé est généré et géré par les développeurs du système."}
                                                            </span>

                                                        }
                                                    >
                                                        <span className='bg-gray-200 rounded-full p-2 cursor-pointer'>
                                                            <FaInfo size={10} color='grey' />
                                                        </span>

                                                    </Tooltip>

                                                </div>

                                                <Field
                                                    name="number"
                                                    disabled={values?.type === 'existing'}
                                                    className='bg-gray-200 p-2 rounded outline-none'
                                                    placeholder={lang === 'en' ? 'Associated form number' : 'Le numéro de formulaire associé'}
                                                />

                                                <ErrorMessage name='number' render={msg => <span className='text-red-500 text-xs'>{msg}</span>} />
                                            </div>
                                        </>
                                }




                                <div className='flex justify-center items-center'>
                                    <button
                                        type="submit"
                                        className='secondary-bg-color px-8 py-2 text-white rounded'
                                    >
                                        {
                                            isPending ? <Oval height="15" width="15" color='white' /> : lang === 'en' ? 'Submit' : 'Soumettre'
                                        }

                                    </button>
                                </div>
                            </Form>
                        )
                    }}

                </Formik> */}



            </div>

        </Modal >
    )
}

export default BuyModal