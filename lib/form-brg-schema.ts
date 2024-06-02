import * as z from 'zod';

export const barangSchema = z.object({
  code: z
    .string()
    .min(3, { message: 'Code must be at least 3 characters' }),
  nama: z
    .string()
    .min(3, { message: 'Name must be at least 3 characters' }),
  barcode: z
    .string()
    .min(3,{ message: 'Barcode must be at least 3 characters' }),
//   contactno: z.coerce.number(),
//   country: z.string().min(1, { message: 'Please select a category' }),
//   city: z.string().min(1, { message: 'Please select a category' }),
  // jobs array is for the dynamic fields
  satuan: z.array(
    z.object({
        satuan: z
        .string()
        .min(2, { message: 'Product Name must be at least 3 characters' }),
        qty: z
        .number()
        .min(1, { message: 'Product Name must be at least 1 characters' }),
      urutan_satuan: z.string().min(1, { message: 'Please select a category' }),
      satuan_utama: z.string().min(1, { message: 'Please select a category' }),
    //   startdate: z
    //     .string()
    //     .refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value), {
    //       message: 'Start date should be in the format YYYY-MM-DD'
    //     }),
    //   enddate: z.string().refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value), {
    //     message: 'End date should be in the format YYYY-MM-DD'
    //   })
    })
  )
});

export type BarangFormValues = z.infer<typeof barangSchema>;