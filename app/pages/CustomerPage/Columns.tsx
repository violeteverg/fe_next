/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/app/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/app/components/ui/checkbox";
import { useMainStore } from "@/app/lib/StoreProvider";

export type Customer = {
  id_customer: number;
  name: string;
  address: string;
  gender: string;
};

export const columns: ColumnDef<Customer>[] = [
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
    accessorKey: "id_customer",
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
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
    accessorKey: "address",
    header: "Domisili",
  },
  {
    accessorKey: "gender",
    header: "Gender",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const customer = row.original;
      const { setIsOpen, setType, setCustomerId } = useMainStore(
        (state) => state
      );

      return (
        <div className='flex gap-2'>
          <Button
            className='bg-green-300'
            onClick={() => {
              setIsOpen(true);
              setType("update");
              setCustomerId(String(customer.id_customer));
            }}
          >
            Update
          </Button>
          <Button
            className='bg-red-300'
            // onClick={() => console.log(customer.pelanggan_id)}
          >
            Delete
          </Button>
        </div>
      );
    },
  },
];
