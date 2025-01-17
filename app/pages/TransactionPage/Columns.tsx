/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/app/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/app/components/ui/checkbox";
import { useMainStore } from "@/app/lib/StoreProvider";

export type ProductTransaction = {
  id: number;
  transaction_id: number;
  product_id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    product_code: string;
    category: string;
  };
};

type Customer = {
  id: number;
  id_customer: string;
  name: string;
};
export type Transaction = {
  id: number;
  bill_id: string;
  date: string;
  customer: Customer[];
  subtotal: number;
  product_transactions: ProductTransaction[];
};

export const columns: ColumnDef<Transaction>[] = [
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
    accessorKey: "bill_id",
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          id_nota
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tanggal
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    accessorKey: "customer.id_customer",
    header: "Kode pelanggan",
  },
  {
    accessorKey: "subtotal",
    header: "Subtotal",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const customer = row.original;
      const { setIsOpen, setType, setTransactionId, setIsDelete } =
        useMainStore((state) => state);

      return (
        <div className='flex gap-2'>
          <Button
            className='bg-green-300'
            onClick={() => {
              setTransactionId(customer?.id);
              setIsOpen(true);
              setType("update");
            }}
          >
            Update
          </Button>
          <Button
            className='bg-red-300'
            onClick={() => {
              setTransactionId(customer?.id);
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
