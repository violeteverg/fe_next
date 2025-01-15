"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Search } from "lucide-react";
import { columns } from "./Columns";
import { DataTable } from "@/app/components/DataTable/DataTable";
import CustomerModal from "@/app/components/CustomerModal/CustomerModal";

import { useMainStore } from "@/app/lib/StoreProvider";
import { useQuery } from "@tanstack/react-query";
import { getAllCustomer } from "@/app/api/customerApi";

export default function CustomerPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const { isOpen, setIsOpen, setType } = useMainStore((state) => state);

  const { data: customerData, isLoading } = useQuery({
    queryKey: ["CUSTOMER", page, perPage, searchTerm],
    queryFn: () => getAllCustomer(page, perPage, searchTerm),
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
    <div className='flex flex-col w-full'>
      <div className='flex flex-col justify-center mx-4 my-8 space-y-4'>
        <h1 className='text-3xl font-semibold'>Customer Management</h1>
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
              placeholder='Search Customer'
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
              data={customerData?.data || []}
              pagination={customerData?.pagination}
              onPageChange={setPage}
              onPerPageChange={setPerPage}
            />
          )}
        </div>
      </div>
      {isOpen && <CustomerModal />}
    </div>
  );
}
