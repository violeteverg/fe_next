/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/app/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/app/components/ui/checkbox";
import { useMainStore } from "@/app/lib/StoreProvider";

export type Items = {
  product_code: number;
  name: string;
  category: string;
  price: string;
};

export const columns: ColumnDef<Items>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "product_code",
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Kode
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nama
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Kategori",
  },
  {
    accessorKey: "price",
    header: "Harga",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const customer = row.original;
      const { setIsOpen, setIsDelete, setType, setProductId } = useMainStore(
        (state) => state
      );

      return (
        <div className='flex gap-2'>
          <Button
            className='bg-green-300'
            onClick={() => {
              setProductId(String(customer.product_code));
              setIsOpen(true);
              setType("update");
            }}
          >
            Update
          </Button>
          <Button
            className='bg-red-300'
            onClick={() => {
              setProductId(String(customer.product_code));
              setIsDelete(true);
            }}
          >
            Delete
          </Button>
        </div>
      );
    },
  },
];
