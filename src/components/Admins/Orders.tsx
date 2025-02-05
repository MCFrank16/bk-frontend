import { useState } from 'react'

import { createColumnHelper, useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, flexRender, ColumnDef, SortingState } from '@tanstack/react-table';
import { User, TypeIcon, ActivityIcon, Search, ArrowUpDown, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';
import { getAllOrders } from '../../backend/api';
import { useQuery } from '@tanstack/react-query';
import StatusModal from './modals/StatusModal';

const Orders = () => {

  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const [openStatusModal, setOpenStatusModal] = useState({
    open: false,
    item: null,
    title: ''
  });


  const { isLoading, isError, error, refetch, data } = useQuery({
    queryKey: ['all orders'],
    queryFn: async () => {
      return await getAllOrders(null);
    },
    select: (data: any) => {
      let newData = data.data.data.map((item: any, index: number) => {
        return {
          itemId: item?._id,
          id: index + 1,
          name: item.product?.name,
          quantity: item.quantity,
          paid: item?.quantity * item?.product?.price,
          status: item.status,
          stock: item.stock
        }
      });
      return newData;
    },
    retry: false,
    enabled: openStatusModal?.open == false
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
          <User className="mr-2" size={16} /> Item
        </span>
      ),
    }),
    columnHelper.accessor("quantity", {
      cell: (info) => info.getValue(),
      header: () => (
        <span className="flex items-center">
          <User className="mr-2" size={16} /> Quantity
        </span>
      ),
    }),
    columnHelper.accessor("paid", {
      cell: (info) => `${info.getValue()} RWF`,
      header: () => (
        <span className="flex items-center">
          <User className="mr-2" size={16} /> Quantity
        </span>
      ),
    }),
    columnHelper.accessor("status", {
      id: "status",
      cell: (info) => info.getValue(),
      header: () => (
        <span className="flex items-center">
          <TypeIcon className="mr-2" size={16} /> Status
        </span>
      ),
    }),
    columnHelper.accessor("Action", {
      header: () => (
        <span className="flex items-center">
          <ActivityIcon className="mr-2" size={16} /> Action
        </span>
      ),
      cell: (info) => {
        const status: string = info.row.original?.status;
        return (
          <div className='flex space-x-3'>

            {(status == 'pending' || status == 'rejected') &&
              <button
                className="bg-blue-500 text-white px-8 py-2 rounded cursor-pointer"
                onClick={() => {
                  setOpenStatusModal({
                    open: true,
                    item: info.row.original,
                    title: 'Approve order'
                  })
                }}
              >
                Approve
              </button>}

            {(status == 'pending' || status == 'approved') && <button
              className="bg-red-500 text-white px-8 py-2 rounded cursor-pointer"
              onClick={() => {
                setOpenStatusModal({
                  open: true,
                  item: info.row.original,
                  title: 'Reject order'
                })
              }}
            >
              Reject
            </button>}
          </div>

        )
      }

    }),
  ];

  const table = useReactTable({
    data: data ?? [],
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
      </div>

      {
        openStatusModal && <StatusModal isOpen={openStatusModal.open} closeModal={() => {
          setOpenStatusModal({
            open: false,
            item: null,
            title: ''
          });
        }} title={openStatusModal?.title ?? ''} editItem={openStatusModal?.item ?? ''} />
      }
    </div>

  )
}

export default Orders
