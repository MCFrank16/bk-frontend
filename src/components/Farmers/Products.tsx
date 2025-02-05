import { createColumnHelper, useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, flexRender, ColumnDef, SortingState } from '@tanstack/react-table';
import { User, TypeIcon, ActivityIcon, Search, ArrowUpDown, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';
import { useState, FC, useEffect } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router';


import { getAllProducts } from '../../backend/api';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../hooks/useAuth';
import { Formik } from 'formik';

interface Props {  
    cart: any;
}
const Products: FC<Props> = ({ cart }) => {

    const { user: { user } } = useAuth();

    const location = useLocation();
    const navigate = useNavigate();

    const [data, setData] = useState([]);
    const [redirect, setRedirect] = useState(false);

    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState("");

    const [openModal, setOpenModal] = useState(false);

    const { isLoading, isError, error, refetch } = useQuery({
        queryKey: ['all products', cart.openCart],
        queryFn: async () => {
            const data = await getAllProducts(``);
            let newData = data.data.data.map((item: any, index: number) => {
                return {
                    itemId: item?._id,
                    id: index + 1,
                    name: item.name,
                    type: item.type,
                    status: item.status,
                    stock: item.stock,
                    price: item.price,
                    landType: item.landDetails.type,
                    landAmount: item.landDetails.quantity
                }
            });

            setData(newData);
            return data;
        },
        retry: false,
        enabled: cart.openCart == false
    });


    const columnHelper = createColumnHelper<any>();

    const columns: ColumnDef<any, any>[] = [
        columnHelper.accessor("id", {
            cell: (info) => info.getValue(),
            header: () => (
                <span className="flex items-center">
                    <User className="mr-2" size={16} /> ID
                </span>
            ),
        }),

        columnHelper.accessor("name", {
            cell: (info) => info.getValue(),
            header: () => (
                <span className="flex items-center">
                    <User className="mr-2" size={16} /> Name
                </span>
            ),
        }),
        columnHelper.accessor("type", {
            id: "type",
            cell: (info) => info.getValue(),
            header: () => (
                <span className="flex items-center">
                    <TypeIcon className="mr-2" size={16} /> Type
                </span>
            ),
        }),
        columnHelper.accessor("stock", {
            id: "stock",
            cell: (info) => `${info.getValue()} KGs`,
            header: () => (
                <span className="flex items-center">
                    <TypeIcon className="mr-2" size={16} /> Stock
                </span>
            ),
        }),
        columnHelper.accessor("price", {
            id: "price",
            cell: (info) => `${info.getValue()} RWF`,
            header: () => (
                <span className="flex items-center">
                    <TypeIcon className="mr-2" size={16} /> Price per kg
                </span>
            ),
        }),
        columnHelper.accessor("landType", {
            id: "landType",
            cell: (info) => info.getValue(),
            header: () => (
                <span className="flex items-center">
                    <TypeIcon className="mr-2" size={16} /> Land type
                </span>
            ),
        }),
        columnHelper.accessor("landAmount", {
            id: "landAmount",
            cell: (info) => `${info.getValue()} KGs`,
            header: () => (
                <span className="flex items-center">
                    <TypeIcon className="mr-2" size={16} /> Land amount
                </span>
            ),
        }),
        columnHelper.accessor("Action", {
            header: () => (
                <span className="flex items-center">
                    <ActivityIcon className="mr-2" size={16} /> Action
                </span>
            ),
            cell: (info) => (
            <div>
                <Formik
                    initialValues={{ amount: 1 * user?.land?.size }}
                    onSubmit={(values) => {
                        if (user == null) {
                            navigate('/signin', {
                                state: { from: location }
                            });
                        } else {
                            const totalToPay = values.amount * info.row.original.price;
                            const productWithAmount = { ...info.row.original, amount: values.amount, total: totalToPay };
                            cart.setCart([...cart.cart, productWithAmount]);
                            const updatedData = data.filter((item: any) => item.id !== info.row.original.id);
                            setData(updatedData);
                        }
                    }}
                >
                    {({ values, handleChange, handleSubmit }) => (
                        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                            <input
                                type="number"
                                name="amount"
                                disabled
                                value={values.amount}
                                onChange={handleChange}
                                min="1"
                                className="w-16 p-2 border border-gray-300 rounded-md"
                            />
                            <button
                                type="submit"
                                disabled={user && user?.land == null}
                                className="secondary-bg-color text-white px-4 py-2 rounded cursor-pointer"
                            >
                                Add to cart
                            </button>
                        </form>
                    )}
                </Formik>
            </div>
            ),
        }),
    ];


    const table = useReactTable({
        data: data,
        columns,
        state: {
            sorting,
            globalFilter,
        },
        initialState: {
            pagination: {
                pageSize: 5,
            },
        },
        getCoreRowModel: getCoreRowModel(),

        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),

        onGlobalFilterChange: setGlobalFilter,
        getFilteredRowModel: getFilteredRowModel(),
    });

    useEffect(() => {
        if ((user && user?.type === 'admin')) {
          setRedirect(true);
        }
      }, [user])
    
      if (redirect) {
        return <Navigate to="/admin" state={{ from: location }} replace />;
      }

    if (isLoading) {
        return (
            <div className='flex justify-center items-center h-screen'>
                <span>loading...</span>
            </div>
        )

    }

    if (isError && error) {
        return (
            <div className='flex justify-center items-center h-screen'>
                <div className='flex flex-col'>
                    <span className='text-lg mb-3'>Something went wrong...</span>

                    <div className='w-full flex justify-center items-center'>
                        <button
                            type='button'
                            className='secondary-bg-color w-1/2 px-8 py-2 rounded text-white'
                            onClick={() => refetch()}
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        )
    }


    return (
        <div className='w-full'>

            <div className="mb-4 relative">
                <input
                    value={globalFilter ?? ""}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md shadow-sm outline-none"
                />
                <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                />
            </div>

            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        <div
                                            {...{
                                                className: header.column.getCanSort()
                                                    ? "cursor-pointer select-none flex items-center"
                                                    : "",
                                                onClick: header.column.getToggleSortingHandler(),
                                            }}
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            <ArrowUpDown className="ml-2" size={14} />
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id} className="hover:bg-gray-50">
                                {row.getVisibleCells().map((cell) => (
                                    <td
                                        key={cell.id}
                                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-sm text-gray-700">
                <div className="flex items-center mb-4 sm:mb-0">
                    <span className="mr-2">Items per page</span>
                    <select
                        className="border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2"
                        value={table.getState().pagination.pageSize}
                        onChange={(e) => {
                            table.setPageSize(Number(e.target.value));
                        }}
                    >
                        {[5, 10, 20, 30].map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                                {pageSize}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronsLeft size={20} />
                    </button>

                    <button
                        className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <span className="flex items-center">
                        <input
                            min={1}
                            max={table.getPageCount()}
                            type="number"
                            value={table.getState().pagination.pageIndex + 1}
                            onChange={(e) => {
                                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                                table.setPageIndex(page);
                            }}
                            className="w-16 p-2 rounded-md border border-gray-300 text-center"
                        />
                        <span className="ml-1">of {table.getPageCount()}</span>
                    </span>

                    <button
                        className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronRight size={20} />
                    </button>

                    <button
                        className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronsRight size={20} />
                    </button>
                </div>

                {
                    openModal && <BuyModal isOpen={openModal} closeModal={() => {
                        setOpenModal(false);
                    }} />
                }
            </div>


        </div>
    )
}

export default Products
