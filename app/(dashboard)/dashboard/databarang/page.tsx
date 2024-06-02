import BreadCrumb from '@/components/breadcrumb';
import { ListBarang } from '@/components/tables/barang-tables/client';
import { databarang } from '@/constants/data';

const breadcrumbItems = [{ title: 'Data Barang', link: '/dashboard/databarang' }];
export default function page() {
  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <ListBarang data={databarang} />
      </div>
    </>
  );
}
