/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Search } from "lucide-react";

import { useState } from "react";
import { DataTable } from "@/app/components/DataTable/DataTable";
import { useMainStore } from "@/app/lib/StoreProvider";
import { columns } from "./Columns";
import { getAllTransaction } from "@/app/api/transactionApi";
import { useQuery } from "@tanstack/react-query";
import TransactionModal from "@/app/components/TransactionModal/TransactionModal";

const renderSubComponent = ({ row }: { row: any }) => {
  const transaction = row.original;

  return (
    <div className='p-4'>
      <h3 className='text-lg font-semibold mb-2'>Item Penjualan</h3>
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='bg-gray-50'>
          <tr>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Nota
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Kode Barang
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Quantity
            </th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {transaction?.product_transactions?.map(
            (item: any, index: number) => (
              <tr key={index}>
                <td className='px-6 py-4 whitespace-nowrap'>
                  {transaction.bill_id}
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  {item.product.product_code}
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>{item.quantity}</td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default function TransactionPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const { isOpen, setIsOpen, setType } = useMainStore((state) => state);

  const { data: transactionData, isLoading } = useQuery({
    queryKey: ["TRANSACTION", page, perPage, searchTerm],
    queryFn: () => getAllTransaction(page, perPage, searchTerm),
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const createButtonHandler = () => {
    setIsOpen(true);
    setType("create");
  };
  return (
    <div className='flex flex-col w-full '>
      <div className='flex flex-col justify-center mx-4 my-8 space-y-4'>
        <h1 className='text-3xl font-semibold'>Transaction Management</h1>
        <div className='flex justify-between items-center'>
          <Button
            className='bg-green-700 text-white w-[30%] lg:w-[10%]'
            onClick={createButtonHandler}
          >
            Create
          </Button>
          <div className='relative w-full max-w-md'>
            <Search className='absolute z-10 top-0 bottom-0 w-6 h-6 my-auto text-slate-800 left-3' />
            <Input
              type='text'
              placeholder='Search Items'
              className='pl-12 pr-4'
              value={searchTerm}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className='border'>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <DataTable
              columns={columns}
              data={transactionData?.data || []}
              pagination={transactionData?.pagination}
              onPageChange={setPage}
              onPerPageChange={setPerPage}
              expandable={true}
              renderSubComponent={renderSubComponent}
            />
          )}
        </div>
        {isOpen && <TransactionModal />}
      </div>
    </div>
  );
}
