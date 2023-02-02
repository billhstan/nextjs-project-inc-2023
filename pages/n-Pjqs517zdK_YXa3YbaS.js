import React, { useState , useEffect} from 'react'
import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid';


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

 


// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";


import Link from 'next/link'


 
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL 
const supabaseAnonKey = process.env.SUPABASE_SERVICE_ROLE_KEY
 
const supabaseAdmin =  createClient(
    supabaseUrl || '',
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvaHpmdm94eHJldHJ0bWpyZGh3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY2Mjk1NTU5NCwiZXhwIjoxOTc4NTMxNTk0fQ.j-tMNS-yzCUd3ckIZPYV7xMA6zlCVDtU7fC_BHREfTY"
)





export default function Home() {
 
  const [studentData, setStudentData] = useState()
const [totalApplications, setTotalApplications] = useState()
 

  const getAllData = async () => {

    const { data, error } = await supabaseAdmin.from('applications').select('*, partner_preferences!inner(*), programming_skills!inner(*), matches(*)')

    if (data) {
      setTotalApplications(Object.keys(data).length)
      setStudentData(data)
    }

     if (error) {
      console.log(error)
    }  
  }   

  
   useEffect(() => {
    getAllData()
  }, []);
    
 
  return (
    <div className="mx-auto px-4  ">
      {' '}
      {/*wrapper for all*/}
      <h1 className="mx-auto max-w-2xl px-4 pt-16 pb-8 text-center text-4xl font-bold lg:max-w-7xl lg:px-8">
        Student Applications for SOC-PROJECT INC PATHWAY
      </h1>
      <h2 className="mx-auto max-w-2xl px-4 pb-8  text-center  font-bold lg:max-w-7xl lg:px-8">
        Total Applicants: {totalApplications}
      </h2>
    
      <div className="mb-6">
        <ReactTable
          style={{ overflow: 'scroll' }}
          data={studentData}
          columns={[
            {
               columns: [
             
                {
                  id: 'date',
                  Header: 'Date Registered',
                  width: 220,
                  accessor: (row) =>
                    `${new Date(row.created_at).toLocaleString('en-sg')}`,
                },
                {
                  id: 'date_update',
                  Header: 'Last Updated',
                  width: 220,
                  accessor: (row) =>
                    `${new Date(row.last_updated).toLocaleString('en-sg')}`,
                },
                {
                  id: 'name',
                  Header: 'Name',
                  width: 300,
                  accessor: (row) => `${row.name}`,
                  filterMethod: (filter, row) =>
                    row._original.name?.toLowerCase().startsWith(filter.value),
                  Cell: ({ row }) => (
                    <Link href={'comments/' + row._original.nano_id}>
                      <a><b>{row._original.name}</b></a>
                    </Link>
                  ),
                },

                {
                  id: 'class',
                  Header: 'Class',
                  width: 150,
                  accessor: (row) => `${row.class} `,
                  filterMethod: (filter, row) =>
                    row._original.class?.toLowerCase().startsWith(filter.value),
                },
                {
                  id: 'admission_id',
                  Header: 'Admission ID',
                  width: 150,
                  accessor: (row) => `${row.admission_id}`,
                  filterMethod: (filter, row) =>
                    row._original.admission_id
                      ?.toLowerCase()
                      .startsWith(filter.value),
                },
                {
                  id: 'mobile',
                  Header: 'Mobile',
                  width: 200,
                  accessor: (row) => `${row.mobile}`,
                  filterMethod: (filter, row) =>
                    row._original.mobile
                      ?.toLowerCase()
                      .startsWith(filter.value),
                },
                {
                  id: 'email',
                  Header: 'Email',
                  width: 300,
                  accessor: (row) => `${row.email}`,
                  filterMethod: (filter, row) =>
                    row._original.email?.toLowerCase().startsWith(filter.value),
                },
                {
                  id: 'personal_tutor',
                  Header: 'Personal Tutor',
                  width: 300,
                  accessor: (row) => `${row.personal_tutor}`,
                  filterMethod: (filter, row) =>
                    row._original.personal_tutor
                      ?.toLowerCase()
                      .startsWith(filter.value),
                },
              ],
            },
         
          ]}
          defaultSorted={[
            {
              id: 'admission_id',
              desc: false,
            },
          ]}
          filterable={true}
          defaultFiltered={[
            {
              id: 'namee',
              value: 'acc',
            },
          ]}
          defaultPageSize={100}
          className="-striped -highlight"
        /> 
        {/** onFilteredChange={filtered => setData({ filtered })}*/}
      </div>
      <ToastContainer />
    </div>
  )
}