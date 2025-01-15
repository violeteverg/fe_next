/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Controller, useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useMainStore } from "@/app/lib/StoreProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct, updateProduct } from "@/app/api/productApi";

export default function ItemForm({ defaultValues }: { defaultValues: any }) {
  const queryClient = useQueryClient();
  const { type, setIsOpen } = useMainStore((state) => state);

  const { handleSubmit, control, reset } = useForm({
    defaultValues: defaultValues || { name: "", category: "", price: 0 },
  });

  const { mutate: createProductMutation } = useMutation({
    mutationFn: (val: any) => createProduct(val),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["PRODUCT"] });
      setIsOpen(false);
      reset();
    },
    onError: () => {
      console.log("Error creating product");
    },
  });

  const { mutate: updateProductMutation } = useMutation({
    mutationFn: ({ id, val }: { id: number; val: any }) =>
      updateProduct(id, val),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["PRODUCT"] });
      setIsOpen(false);
      reset();
    },
    onError: () => {
      console.log("Error updating product");
    },
  });

  const onSubmit = async (val: any) => {
    const productData = {
      name: val.name,
      category: val.category,
      price: val.price,
    };

    if (type === "update") {
      updateProductMutation({ id: val.productCode, val: productData });
    } else {
      createProductMutation(productData);
    }
  };

  return (
    <form
      className='grid items-start gap-4 mx-4 my-2'
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className='grid gap-2'>
        <Label>Nama</Label>
        <Controller
          control={control}
          name='name'
          render={({ field }) => (
            <Input
              {...field}
              value={field.value || ""}
              placeholder='Masukkan Nama Barang'
            />
          )}
        />
      </div>

      <div className='grid gap-2'>
        <Label>Kategori</Label>
        <Controller
          control={control}
          name='category'
          render={({ field: { onChange, value } }) => (
            <Select onValueChange={onChange} value={value || ""}>
              <SelectTrigger className='border rounded px-4 py-2'>
                <SelectValue placeholder='Pilih Kategori' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='ATK'>ATK</SelectItem>
                <SelectItem value='RT'>RT</SelectItem>
                <SelectItem value='MASAK'>Masak</SelectItem>
                <SelectItem value='Elektronik'>Elektronik</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className='grid gap-2'>
        <Label>Harga</Label>
        <Controller
          control={control}
          name='price'
          render={({ field }) => (
            <Input
              {...field}
              value={field.value || ""}
              placeholder='Masukkan Harga barang'
            />
          )}
        />
      </div>

      <Button type='submit'>
        {type === "update" ? "Update Data" : "Simpan Data"}
      </Button>
    </form>
  );
}
