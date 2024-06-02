'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { barangSchema, type BarangFormValues } from '@/lib/form-brg-schema';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangleIcon, Trash, Trash2Icon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { BrowserMultiFormatReader } from "@zxing/library";
import axios from 'axios';

interface ProfileFormType {
  initialData: any | null;
  categories: any;
}


const urut_satuan = [{ id: 1, name: 'urutan Ke-1'},{id: 2, name: 'urutan Ke-2'},{id: 3, name: 'urutan Ke-3'} ];
const sat_utama = [{ id: 1, name: 'Ya' },{ id: 2, name: 'Tidak' }];

export const CreateDataBarang: React.FC<ProfileFormType> = ({
  initialData,
  categories
}) => {
  const params = useParams();
  const router = useRouter();
  const codeReader = useRef(new BrowserMultiFormatReader());
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const title = initialData ? 'Edit product' : 'Master Barang';
  const description = initialData
    ? 'Edit a product.'
    : 'Masukkan informasi untuk master barang.';
  const toastMessage = initialData ? 'Product updated.' : 'Product created.';
  const action = initialData ? 'Save changes' : 'Create';
  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState({});
  const delta = currentStep - previousStep;

  const getDataById = async () => {
    const results = await axios.get('url', {
      headers: {
        Authorization: 'Bearer ' // Add token
      }
    })

    setData(results)
  }

  const defaultValues = {
    satuan: [
      {
        satuan: '',
        qty: 0,
        urutan_satuan: 0,
        satuan_utama: 0        
      }
    ]
  };

  const form = useForm<BarangFormValues>({
    resolver: zodResolver(barangSchema),
    defaultValues,
    mode: 'onChange'
  });

  const {
    control,
    formState: { errors }
  } = form;
  const { append, remove, fields } = useFieldArray({
    control,
    name: 'satuan'
  });

  const startScanner = () => {
    setIsScanning(true);
  };

  const stopScanner = () => {
    codeReader.current.reset();
    setIsScanning(false);
  };

  useEffect(() => {
    getDataById()
  }, [params.id])

  useEffect(() => {
    if (isScanning && videoRef.current) {
      codeReader.current.decodeFromVideoDevice(
        null,
        videoRef.current,
        (result, err) => {
          if (result) {
            form.setValue('barcode', result.getText())
            stopScanner();
          }
          if (err) {
            console.error(err);
          }
        }
      );
    }
  }, [isScanning]);

  useEffect(() => {
    return () => {
      stopScanner(); // Clean up the scanner on unmount
    };
  }, []);

  const onSubmit: SubmitHandler<BarangFormValues> = async (data: BarangFormValues) => {
    const payload = {
      barang: {
        code: data.code,
        nama: data.nama,
        barcode: data.barcode
      },
      satuan: data.satuan.map((item: any) => {
        return {
          code: data.code,
          satuan: item.satuan,
          qty: item.qty,
          urutan_satuan: parseInt(item.urutan_satuan),
          satuan_utama: parseInt(item.satuan_utama)
        }
      })
    }

    try {
      setLoading(true);
      console.log('payload create', payload)
      if (params.id === 'new') {
        // axios post create
      } else {
        // axios post update
      }
    } catch (error: any) {
      console.log('error')
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      //   await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      router.refresh();
      router.push(`/${params.storeId}/products`);
    } catch (error: any) {
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  type FieldName = keyof BarangFormValues;

  const steps = [
    {
      id: 'Step 1',
      name: 'Informasi Barang',
      fields: ['code', 'nama', 'barcode']
    },
    {
      id: 'Step 2',
      name: 'Masukkan Item Barang',
      fields: fields
        ?.map((_, index) => [
          `satuan.${index}.satuan`,
          `satuan.${index}.qty`,
          `satuan.${index}.urutan_satuan`,
          `satuan.${index}.satuan_utama`
        ])
        .flat()
    }
  ];

  const next = async () => {
    const fields = steps[currentStep].fields;

    const output = await form.trigger(fields as FieldName[], {
      shouldFocus: true
    });

    if (!output) return;

    if (currentStep === 0) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step - 1);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <div>
        <ul className="flex gap-4">
          {steps.map((step, index) => (
            <li key={step.name} className="md:flex-1">
              {currentStep > index ? (
                <div className="group flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                  <span className="text-sm font-medium text-sky-600 transition-colors ">
                    {step.id}
                  </span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              ) : currentStep === index ? (
                <div
                  className="flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                  aria-current="step"
                >
                  <span className="text-sm font-medium text-sky-600">
                    {step.id}
                  </span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              ) : (
                <div className="group flex h-full w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                  <span className="text-sm font-medium text-gray-500 transition-colors">
                    {step.id}
                  </span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <div
            className={cn(
              currentStep === 1
                ? 'w-full md:inline-block'
                : 'gap-8 md:grid md:grid-cols-3'
            )}
          >
            {currentStep === 0 && (
              <>
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kode Barang</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Kode Barang"
                          defaultValue={params.id === 'new' ? '' : 'state data'}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nama"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Produk</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Nama Produk"
                          defaultValue={params.id === 'new' ? '' : 'state data'}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="barcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Scan Barcode</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Barcode"
                          defaultValue={params.id === 'new' ? '' : 'state data'}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  disabled={loading}
                  onClick={startScanner}
                  className="lg:absolute lg:right-4 lg:top-[46%] lg:h-[43px] md:self-end px-4"
                >
                  Scan
                </Button>
                {isScanning && (
                  <div className="col-span-3 ml-32">
                    <video
                      ref={videoRef}
                      style={{ width: "70%" }}
                      className="mt-4 border border-gray-300 rounded-lg"
                    />
                  </div>
                )}
              </>
            )}
            {currentStep === 1 && (
              <>
                {fields?.map((field, index) => (
                  <Accordion
                    type="single"
                    collapsible
                    defaultValue="item-1"
                    key={field.id}
                  >
                    <AccordionItem value="item-1">
                      <AccordionTrigger
                        className={cn(
                          'relative !no-underline [&[data-state=closed]>button]:hidden [&[data-state=open]>.alert]:hidden',
                          errors?.satuan?.[index] && 'text-red-700'
                        )}
                      >
                        {`Item Satuan ${index + 1}`}

                        <Button
                          variant="outline"
                          size="icon"
                          className="absolute right-8"
                          onClick={() => remove(index)}
                        >
                          <Trash2Icon className="h-4 w-4 " />
                        </Button>
                        {errors?.satuan?.[index] && (
                          <span className="alert absolute right-8">
                            <AlertTriangleIcon className="h-4 w-4   text-red-700" />
                          </span>
                        )}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div
                          className={cn(
                            'relative mb-4 gap-8 rounded-md border p-4 md:grid md:grid-cols-3'
                          )}
                        >
                          <FormField
                            control={form.control}
                            name={`satuan.${index}.satuan`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Jenis Satuan</FormLabel>
                                <FormControl>
                                  <Input
                                    type="text"
                                    disabled={loading}
                                    placeholder="KG / PCS / DUS"
                                    defaultValue={params.id === 'new' ? '' : 'state data'}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`satuan.${index}.qty`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Qty Barang</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    disabled={loading}
                                    placeholder="Quantity Barang"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`satuan.${index}.urutan_satuan`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Urutan Satuan</FormLabel>
                                <Select
                                  disabled={loading}
                                  onValueChange={field.onChange}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue
                                        defaultValue={field.value}
                                        placeholder="Select Order Unit"
                                      />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {urut_satuan.map((item) => (
                                      <SelectItem
                                        key={item.id}
                                        value={item.id.toString()}
                                      >
                                        {item.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`satuan.${index}.satuan_utama`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Satuan Utama</FormLabel>
                                <Select
                                  disabled={loading}
                                  onValueChange={field.onChange}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue
                                        defaultValue={field.value}
                                        placeholder="Select Main Unit"
                                      />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {sat_utama.map((item) => (
                                      <SelectItem key={item.id} value={item.id.toString()}>
                                        {item.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ))}

                <div className="mt-4 flex justify-center">
                  <Button
                    type="button"
                    className="flex justify-center"
                    size={'lg'}
                    onClick={() =>
                      append({
                        satuan: '',
                        qty: 0,
                        urutan_satuan: 0,
                        satuan_utama: 0
                      })
                    }
                  >
                    Add Satuan
                  </Button>
                </div>
              </>
            )}
          </div>

          {
            currentStep === 1 && <div className='flex justify-end'>
              <Button disabled={loading} type="submit">
                {action}
              </Button>
            </div>
          }
        </form>
      </Form>
      {/* Navigation */}
      <div className="mt-8 pt-5">
        <div className="flex justify-between">
          <button
            type="button"
            onClick={prev}
            disabled={currentStep === 0}
            className="rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={next}
            disabled={currentStep === steps.length - 1}
            className="rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};