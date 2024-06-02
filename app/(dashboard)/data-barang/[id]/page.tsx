import BreadCrumb from '@/components/breadcrumb';
import { CreateDataBarang } from '@/components/forms/databarang-stepper/create-barang';
import { ScrollArea } from '@/components/ui/scroll-area';
import React from 'react';

export default function Page() {
  const breadcrumbItems = [
    { title: 'Data barang', link: '/data-barang' },
    { title: 'Create', link: '/data-barang/create' }
  ];
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <CreateDataBarang categories={[]} initialData={null} />
      </div>
    </ScrollArea>
  );
}
