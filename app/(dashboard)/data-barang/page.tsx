'use client'
import BreadCrumb from '@/components/breadcrumb';
import { ListBarang } from '@/components/tables/barang-tables/client';
import { databarang } from '@/constants/data';
import axios from 'axios';
import { useEffect, useState } from 'react';

const breadcrumbItems = [{ title: 'Data Barang', link: '/data-barang' }];

function DataBarang() {
  const [data, setData] = useState(databarang)

  const getData = async () => {
    const results = await axios.get('url', {
      headers: {
        Authorization: 'Bearer ' // Add token
      }
    })

    // Set results to setData
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <ListBarang data={data} />
      </div>
    </>
  );
}

export default DataBarang