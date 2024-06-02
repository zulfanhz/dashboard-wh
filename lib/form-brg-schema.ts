import * as z from 'zod';

export const barangSchema = z.object({
  code: z.string()
    .min(3, { message: 'Code must be at least 3 characters' }),
  nama: z.string()
    .min(3, { message: 'Name must be at least 3 characters' }),
  barcode: z.string()
    .min(3,{ message: 'Barcode must be at least 3 characters' }).optional(),
  satuan: z.array(
    z.object({
      satuan: z.string()
        .min(2, { message: 'Unit must be at least 2 characters' }),
      qty: z.preprocess(
        (a) => parseInt(z.string().parse(a), 10),
        z.number().positive().min(1, { message: 'Quantity must be at least 1 characters' })
      ),
      urutan_satuan: z.preprocess(
        (a) => parseInt(z.string().parse(a), 10),
        z.number().positive().min(1, { message: 'Unit Order must be at least 1 characters' })
      ),
      satuan_utama: z.preprocess(
        (a) => parseInt(z.string().parse(a), 10),
        z.number().positive().min(1, { message: 'Main Unit must be at least 1 characters' })
      ),
    })
  )
});

export type BarangFormValues = z.infer<typeof barangSchema>;