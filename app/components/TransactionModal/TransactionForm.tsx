/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllCustomerDropdown } from "@/app/api/customerApi";
import { getAllProductDropdown } from "@/app/api/productApi";
import { createTransaction, updateTransaction } from "@/app/api/transactionApi";
import { useMainStore } from "@/app/lib/StoreProvider";

export default function TransactionForm({
  defaultValues,
}: {
  defaultValues: any;
}) {
  const queryClient = useQueryClient();
  const { type, setIsOpen } = useMainStore((state) => state);
  const { handleSubmit, control, reset, watch } = useForm({
    defaultValues: {
      ...defaultValues,
      products: defaultValues.products || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });

  const { mutate: createTransactionMutation, isPending: isPendingCreate } =
    useMutation({
      mutationFn: (val: any) => createTransaction(val),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["TRANSACTION"] });
        setIsOpen(false);
        reset();
      },
      onError: () => {
        console.log("Error creating product");
      },
    });
  const { mutate: updateTransactionMutation, isPending: isPendingUpdate } =
    useMutation({
      mutationFn: ({ id, val }: { id: number; val: any }) =>
        updateTransaction(id, val),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["TRANSACTION"] });
        setIsOpen(false);
        reset();
      },
      onError: () => {
        console.log("Error creating product");
      },
    });

  const { data: customers, isLoading: isLoadingCustomers } = useQuery({
    queryKey: ["CUSTOMER_LIST"],
    queryFn: () => getAllCustomerDropdown(),
  });

  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["PRODUCT_LIST"],
    queryFn: () => getAllProductDropdown(),
  });

  const selectedProducts = watch("products") || [];

  const isProductSelected = (productId: string, currentIndex: number) => {
    return selectedProducts.some(
      (product: any, index: any) =>
        product.product_id?.toString() === productId && index !== currentIndex
    );
  };

  const onSubmit = (data: any) => {
    const formattedData = {
      ...data,
      customer_id: Number(data.customer_id),
      products: data.products.map((product: any) => ({
        ...product,
        product_id: Number(product.product_id),
      })),
    };
    if (type === "update") {
      console.log(formattedData.id);
      updateTransactionMutation({ id: data.id, val: formattedData });
    } else {
      createTransactionMutation(formattedData);
      console.log(formattedData);
    }
  };
  const pending = isPendingCreate || isPendingUpdate;

  return (
    <form
      className='grid items-start gap-4 mx-4 my-2'
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className='grid gap-2'>
        <Label htmlFor='date'>Tanggal</Label>
        <Controller
          control={control}
          name='date'
          render={({ field }) => (
            <Input
              {...field}
              id='date'
              type='date'
              value={field.value ?? ""}
              placeholder='Pilih Tanggal'
            />
          )}
        />
      </div>

      <div className='grid gap-2'>
        <Label htmlFor='customer'>Customer</Label>
        <Controller
          control={control}
          name='customer_id'
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              value={field.value?.toString() || undefined}
            >
              <SelectTrigger id='customer' className='border rounded px-4 py-2'>
                <SelectValue placeholder='Pilih Customer' />
              </SelectTrigger>
              <SelectContent>
                {isLoadingCustomers ? (
                  <SelectItem value='loading'>Loading...</SelectItem>
                ) : (
                  customers?.data?.map((customer: any) => (
                    <SelectItem
                      key={customer.id}
                      value={customer.id.toString()}
                    >
                      {customer.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className='grid gap-2'>
        <Label>Produk</Label>
        <div className='h-[90%] p-3 space-y-3 overflow-y-auto w-full '>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className='grid grid-cols-12 gap-2 items-center'
            >
              <div className='col-span-5'>
                <Controller
                  control={control}
                  name={`products.${index}.product_id`}
                  render={({ field: productField }) => (
                    <Select
                      onValueChange={productField.onChange}
                      value={productField.value?.toString() || undefined}
                    >
                      <SelectTrigger className='border rounded px-4 py-2'>
                        <SelectValue placeholder='Pilih Product' />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingProducts ? (
                          <SelectItem value='loading'>Loading...</SelectItem>
                        ) : (
                          products?.map((product: any) => {
                            const isSelected = isProductSelected(
                              product.id.toString(),
                              index
                            );
                            return (
                              <SelectItem
                                key={product.id}
                                value={product.id.toString()}
                                disabled={isSelected}
                                className={isSelected ? "opacity-50" : ""}
                              >
                                {product.name}
                              </SelectItem>
                            );
                          })
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className='col-span-4'>
                <Controller
                  control={control}
                  name={`products.${index}.quantity`}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type='number'
                      min={1}
                      placeholder='Jumlah'
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 1)
                      }
                    />
                  )}
                />
              </div>

              <div className='col-span-2'>
                <Button
                  type='button'
                  onClick={() => remove(index)}
                  variant='destructive'
                >
                  Hapus
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Button
          type='button'
          onClick={() =>
            append({
              product_id: undefined,
              quantity: 1,
            })
          }
          className='bg-black text-white hover:bg-gray-800'
        >
          Tambah Produk
        </Button>
      </div>

      <Button
        type='submit'
        className='mt-4 bg-black text-white hover:bg-gray-800'
        disabled={pending}
      >
        Simpan Transaksi
      </Button>
    </form>
  );
}
