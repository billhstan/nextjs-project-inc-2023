import React, { useState , useEffect} from 'react'
import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid';


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

 

 

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

 



 
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL 
const supabaseAnonKey = process.env.SUPABASE_SERVICE_ROLE_KEY
 
const supabaseAdmin =  createClient(
    supabaseUrl || '',
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvaHpmdm94eHJldHJ0bWpyZGh3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY2Mjk1NTU5NCwiZXhwIjoxOTc4NTMxNTk0fQ.j-tMNS-yzCUd3ckIZPYV7xMA6zlCVDtU7fC_BHREfTY"
)








 

export default function Home() {
   

 
  
   
// match students
  const matchStudents = async () => {

    const deleteAllMatches = async () => { 
      const { data, error } = await supabaseAdmin.from("matches").delete().neq('student_insert_id', '0')
      if (error) {
        console.log(error)
      }
      if (data) {
        console.log(data, "deleted")
      }
    }
  deleteAllMatches()
 
     
 
    const { data, error } = await supabaseAdmin.from('applications').select('*, partner_preferences!inner(*), programming_skills!inner(*)')
 
    var matched_students = []
        
     for (var j = 0; j < data.length; j++) { // nested loop, compare every array item with each other
       for (var i = 0;  i < data.length; i++) {
       if (data) {
         var result = data[j].partner_preferences.filter(o1 => data[i].partner_preferences.some(o2 => o1.partner_admission_id == o2.admission_id && o1.admission_id == o2.partner_admission_id)); //need the and &&, to match
         if (result.length !== 0) {
           matched_students.push(result)
         }
       }
     }
     }
     

    // remove duplicates
     if (matched_students.partner_admission_id) {
      for (var k = 0; k < matched_students.length; k++) {
       var matched_students = matched_students.filter((tag, index, array) => array.findIndex(t => t[k].partner_admission_id == tag[k].partner_admission_id) == index);
     }
    }
     
      

      //insert to matches table. IT WILL ONLY UPDATE IF STUDENT SUBMITS, then match. It RE-MATCHES the whole table.
       for (var x = 0; x < data.length; x++) {
         if (data[x]) {
           for (let i = 0; i < matched_students.length; i++) {
                if (parseInt(data[x].admission_id) == matched_students[i][0].admission_id) {
                    
                    const { error } = await supabaseAdmin.from("matches").insert([
                    {
                      admission_id: data[x].admission_id,
                      partner_admission_id: matched_students[i][0].partner_admission_id,
                      student_insert_id: data[x].nano_id
                    }
                  ])
                  if (error) {
                    console.log(error)
                  } 
                  }
                }
                      }
                  }  

     if (error) {
      console.log(error)
    }  
  }  // END OF matchStudents()  
  





 
  const [studentData, setStudentData] = useState()
const [totalApplications, setTotalApplications] = useState()
  const [isOpen, setIsOpen] = useState(false);

  function toggleModal() {
    setIsOpen(!isOpen);
  }
 

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
    <div className='mx-auto px-4  '> {/*wrapper for all*/}

      <h1 className="text-4xl font-bold text-center mx-auto max-w-2xl pt-16 px-4 lg:max-w-7xl lg:px-8 pb-8">Student Applications for SOC-PROJECT INC PATHWAY</h1>
      <h2 className="mx-auto max-w-2xl px-4 pb-8  text-center  font-bold lg:max-w-7xl lg:px-8">
        Total Applicants: {totalApplications}
      </h2> 
      <button onClick={matchStudents} className="text-4xl text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Match Students</button>
       
      <div className='mb-6'>
        <ReactTable
          style={{ overflow: "scroll" }}
          data={studentData}
          columns={[
            {
              Header: "Personal Information",
              columns: [
              {
                  id: "date",
                  Header: "Date Registered",
                  width: 300,
                  accessor: row => `${new Date(row.created_at).toLocaleString("en-sg")}`,
            
                },
                {
                  id: "date_update",
                  Header: "Last Updated",
                  width: 300,
                  accessor: row => `${new Date(row.last_updated).toLocaleString("en-sg")}`,
                
                },
                {
                  id: "name",
                  Header: "Name",
                  width: 300,
                  accessor: row => `${row.name}`,
                  filterMethod: (filter, row) =>
                    row._original.name?.toLowerCase().startsWith(filter.value) 
                },
                {
                  id: "class",
                  Header: "Class",
                  width: 150,
                  accessor: row => `${row.class} `,
                  filterMethod: (filter, row) =>
                    row._original.class?.toLowerCase().startsWith(filter.value)  
                },
                {
                  id: "admission_id",
                  Header: "Admission ID",
                  width: 150,
                  accessor: row => `${row.admission_id}`,
                  filterMethod: (filter, row) =>
                    row._original.admission_id?.toLowerCase().startsWith(filter.value)  
                },
                {
                  id: "mobile",
                  Header: "Mobile",
                  width: 200,
                  accessor: row => `${row.mobile}`,
                  filterMethod: (filter, row) =>
                    row._original.mobile?.toLowerCase().startsWith(filter.value)   
                },
                {
                  id: "email",
                  Header: "Email",
                  width: 300,
                  accessor: row => `${row.email}`,
                  filterMethod: (filter, row) =>
                    row._original.email?.toLowerCase().startsWith(filter.value)  
                },
                {
                  id: "personal_tutor",
                  Header: "Personal Tutor",
                  width: 300,
                  accessor: row => `${row.personal_tutor}`,
                  filterMethod: (filter, row) =>
                    row._original.personal_tutor?.toLowerCase().startsWith(filter.value)  
                }
              ]
            },
            {
              Header: "Info",
              columns: [
                {
                 id: "Reason for applying",
                  Header: "Reason for applying",
                  style: {'whiteSpace': 'unset'},
                  width: 500,
                  accessor: row => `${row.reason}`,
                  filterMethod: (filter, row) =>
                    row._original.reason?.toLowerCase().startsWith(filter.value),
                  Cell: ({row}) => <div dangerouslySetInnerHTML={{__html: row._original.reason}} /> // SET THE TEXT EDITOR HTML
                  
                },
                {
                 id: "Describe yourself",
                  Header: "Describe yourself",
                  width: 500,
                  style: {'whiteSpace': 'unset'},
                  accessor: row => `${row.describe_yourself}`,
                  filterMethod: (filter, row) =>
                    row._original.describe_yourself?.toLowerCase().startsWith(filter.value),
                   Cell: ({row}) => <span dangerouslySetInnerHTML={{__html: row._original.describe_yourself}} /> // SET THE TEXT EDITOR HTML
                },
                {
                 id: "Tech interests",
                  Header: "Tech interests",
                  width: 500,
                  style: {'whiteSpace': 'unset'},
                  accessor: row => `${row.technical_interests}`,
                  filterMethod: (filter, row) =>
                    row._original.technical_interests?.toLowerCase().startsWith(filter.value),
                  Cell: ({row}) =>  <div dangerouslySetInnerHTML={{__html: row._original.technical_interests}} /> 
                },
                {
                 id: "Programming Skills",
                  Header: "Programming Skills",
                  width: 800,
                  style: {'whiteSpace': 'unset'},
                  //accessor: row => `${row.programming_skills[0].languages, row.programming_skills[0].comments}`,
                  Cell: (row) => {
                    if (row.original.programming_skills) {
                      const programming_skills_data = row.original.programming_skills 
                    for (var i = 0; i < programming_skills_data.length; i++) {
                      //"Language: " + programming_skills_data[i].languages + ", --- " +"Comments: "+programming_skills_data[i].comments
                      return <table>
                              <tr>
                                <th>Languages</th>
                                <th>Comments</th>
                              </tr>
                              {programming_skills_data.map(i => (
                                                <tbody key={i.id}>
                                                    <tr>
                                                        <td>{i.languages}</td>
                                                        <td>{i.comments}</td>
                                                    </tr>
                                                </tbody>
                                            ))}
                                </table>
                    }}
                    }
                    
                }
              ]
            },
            {
              Header: "Member Partner",
              style: {'whiteSpace': 'unset'},
              columns: [
                {
                 id: "Preferred partner",
                  Header: "Preferred partners (filter based on FIRST partner name)",
                  width: 800,
                  Cell: (row) => {
                    const partner_data = row.original.partner_preferences
                    for (var i = 0; i < partner_data.length; i++) {
                      //"Language: " + programming_skills_data[i].languages + ", --- " +"Comments: "+programming_skills_data[i].comments
                      return <table>
                              <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Partner Admission ID</th>
                              </tr>
                              {partner_data.map(i => (
                                                <tbody key={i.id}>
                                                    <tr>
                                                        <td>{i.name}</td>
                                                        <td>{i.email}</td>
                                                        <td>{i.partner_admission_id}</td>
                                                    </tr>
                                                </tbody>
                                            ))}
                                </table>
                    }},
                    filterMethod: (filter, row) =>
                    row._original.partner_preferences[0].name?.toLowerCase().startsWith(filter.value) 
                }
              ]
            },
            {
              Header: "Matches",
              style: {'whiteSpace': 'unset'},
              columns: [
                {
                 id: "Matches",
                  Header: "Matches(filter based on FIRST partner name)",
                  width: 500,
                  Cell: (row) => {
                    const matches_data = row.original.matches
                    for (var i = 0; i < matches_data.length; i++) {
                      //"Language: " + programming_skills_data[i].languages + ", --- " +"Comments: "+programming_skills_data[i].comments
                      return <table>
                              <tr>
                           
                                <th>Partner Admission ID</th>
                              </tr>
                              {matches_data.map(i => (
                                                <tbody key={i.id}>
                                                    <tr>
             
                                                        <td>{i.partner_admission_id}</td>
                                                    </tr>
                                                </tbody>
                                            ))}
                                </table>
                    }},
                    filterMethod: (filter, row) =>
                    row._original.matches[0].name?.toLowerCase().startsWith(filter.value) 
                }
              ]
            }
          ]}
          defaultSorted={[
            {
              id: "fullName",
              desc: false
            }
          ]}
          filterable={true}
          defaultFiltered={[
            {
              "id": "fullName",
              "value": "acc"
            }]}
 
          defaultPageSize={10}
          className="-striped -highlight"
          
        /> {/** onFilteredChange={filtered => setData({ filtered })}*/} 
       </div>
       


      
      
      
    
   <ToastContainer/>
    </div>
   
  )
}