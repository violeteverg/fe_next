/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Search } from "lucide-react";
import { columns } from "./Columns";
import { useState } from "react";
import { DataTable } from "@/app/components/DataTable/DataTable";
import { useMainStore } from "@/app/lib/StoreProvider";
import ItemModal from "@/app/components/ItemModal/ItemModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllProduct, removeProduct } from "@/app/api/productApi";
import { DeleteModal } from "@/app/components/DeleteModal/DeleteModal";

export default function ItemPage() {
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const { productId, isOpen, isDelete, setIsOpen, setType } = useMainStore(
    (state) => state
  );

  const { data: productData, isLoading } = useQuery({
    queryKey: ["PRODUCT", page, perPage, searchTerm],
    queryFn: () => getAllProduct(page, perPage, searchTerm),
  });
  const { mutate: removeProductMutation } = useMutation({
    mutationFn: (id: any) => removeProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["CUSTOMER"] });
    },
    onError: () => {
      alert("something when wrong");
    },
  });

  const deleteButtonHandler = () => {
    removeProductMutation(productId);
  };
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
        <h1 className='text-3xl font-semibold'>Items Management</h1>
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
              data={productData?.data || []}
              pagination={productData?.pagination}
              onPageChange={setPage}
              onPerPageChange={setPerPage}
            />
          )}
        </div>
      </div>
      {isOpen && <ItemModal />}
      {isDelete && (
        <DeleteModal
          title={`delete product`}
          description='are you sure delete this product'
          onDelete={deleteButtonHandler}
        />
      )}
    </div>
  );
}
