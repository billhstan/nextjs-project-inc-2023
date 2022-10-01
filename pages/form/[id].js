import React, { useState, useRef, useMemo, useEffect} from 'react'
import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid';
 


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import IconButton from '@material-ui/core/IconButton';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';


import { useForm } from "react-hook-form";



import dynamic from 'next/dynamic';
const importJodit = () => import('jodit-react');
const JoditEditor = dynamic(importJodit, {
    ssr: false,
});


 
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL 
const supabaseAnonKey = process.env.SUPABASE_SERVICE_ROLE_KEY
 
const supabaseAdmin =  createClient(
    supabaseUrl || '',
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvaHpmdm94eHJldHJ0bWpyZGh3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY2Mjk1NTU5NCwiZXhwIjoxOTc4NTMxNTk0fQ.j-tMNS-yzCUd3ckIZPYV7xMA6zlCVDtU7fC_BHREfTY"
)


 
 export const getStaticPaths = async () => {
   const { data, error } = await supabaseAdmin.from('applications').select('email, nano_id') //can remove email??
   const paths = data.map(item => {
     return {
       params: {id: item.nano_id.toString()} // THIS WILL OUTPUT THE ID TO GETSTATICPROPS, context.params.id
     }
   })
   return {
     paths,
     fallback: false
   }
   
}
  

export const getStaticProps = async (context) => {
  var id = context.params.id
  const { data, error } = await supabaseAdmin.from('applications').select('*, partner_preferences!inner(*)').eq('nano_id', id) //need to join table to get partner preferences. BUT THERE IS NOTHING IN PARTNER PREFERENCES BECAUSE I NEVER ADD, WHEN REGISTER USER. DID NOT INITIALISE THE VALUE. SO WHEN I GET THE STATE, IT IS UNDEFINED.
  return {
    props: { item: data },
    revalidate: 1
   }
}

 
export default function Home({ item }) {
  

 

 
 
 //set state of current data in database
  const [classInput, setClassInput] = useState(item[0].class);
  const [admission_idInput, setAdmissionIdInput] = useState(item[0].admission_id);
  const [nameInput, setNameInput] = useState(item[0].name);
  const [mobileInput, setMobileInput] = useState(item[0].mobile);
  const [emailInput, setEmailInput] = useState(item[0].email);
  const [personal_tutorInput, setPersonalTutorInput] = useState(item[0].personal_tutor);
  const [reasonInput, setReasonInput] = useState(item[0].reason);
  const [describe_yourselfInput, setDescribeYourselfInput] = useState(item[0].describe_yourself);
  const [technical_interestsInput, setTechnicalInterestsInput] = useState(item[0].technical_interests);


// Jodi Editor
const editor = useRef(null)
     
const config = useMemo(
    () => ({
        readonly: false, 
    }),
    []
  );
  
// END Jodi Editor 


//programmingInputs
  const [programmingInputs, setInputs] = useState([
    { id: uuidv4(), firstItem: '', secondItem: '' },
  ]);

  const handleChangeInput = (id, event) => {
    const newInputs = programmingInputs.map(i => {
      if(id === i.id) {
        i[event.target.name] = event.target.value
      }
      return i;
    })
    setInputs(newInputs);
  }

  const handleAddFields = () => {
    setInputs([...programmingInputs, { id: uuidv4(),  firstItem: '', secondItem: ''}])
  }

  const handleRemoveFields = id => {
    const values  = [...programmingInputs];
    values.splice(values.findIndex(value => value.id === id), 1);
    setInputs(values);
  }
  //END programminginputfields

  
//add member partner input field
  var current_partner_preferences = []
  if (item[0].partner_preferences) {
    for (var i = 0; i < item[0].partner_preferences.length; i++) {
    current_partner_preferences[i] = { id: uuidv4(), firstItem: item[0].partner_preferences[i].name, secondItem: item[0].partner_preferences[i].email, thirdItem: item[0].partner_preferences[i].partner_admission_id}
  }
  }
  const [memberPartnerInputs, setMemberPartnerInputs] = useState(
    current_partner_preferences   //set the member partners state
);
  
 

  const handleMemberPartnerInputChangeInput = (id, event) => {
    const newInputs = memberPartnerInputs.map(i => {
      if(id === i.id) {
        i[event.target.name] = event.target.value
      }
      return i;
    })
    setMemberPartnerInputs(newInputs);
  }

  const handleMemberPartnerInputAddFields = () => {
    setMemberPartnerInputs([...memberPartnerInputs, { id: uuidv4(),  firstItem: '', secondItem: '', thirdItem: ''}])
  }

  const handleMemberPartnerInputRemoveFields = id => {
    const values  = [...memberPartnerInputs];
    values.splice(values.findIndex(value => value.id === id), 1);
    setMemberPartnerInputs(values);
  }
// END OF member partner input field

  
  //react form hook
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();


  //submit form
  const onSubmit = async (e) => {
    
    if (classInput=='') {
      toast.error("Fill up", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
      console.log(1)
      return
    }
    // if form filled up correctly
    toast.success("Form submitted!", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
    });


    console.log('TESTING')
    console.log(nameInput)
    
    //insert form data to applications table
    const { data, error } = await supabaseAdmin.from("applications").update(
      {
        class: classInput, name: nameInput, admission_id: admission_idInput, mobile: mobileInput,
        personal_tutor: personal_tutorInput, reason: reasonInput, describe_yourself: describe_yourselfInput,
        technical_interests: technical_interestsInput
      }
    ).eq('nano_id', item[0].nano_id)

    console.log(data)
    

    if (error) {
      console.log(error)
    }  
  

    //delete all records in partner preference first. PREVENT DUPLICATE
    await supabaseAdmin.from("partner_preferences").delete().eq('student_insert_id', item[0].nano_id)

    const deleteAllPartners = async () => { 

      console.log(item[0].nano_id)
      
      if (memberPartnerInputs.length == 0) { // IF THE STUDENT NEVER KEY IN ANY MEMBER PARTNER INPUTS, ADD A BLANK DATA. to make the state not null. if state is empty, it will crash
        console.log('data length is 0 executed')
        await supabaseAdmin.from("partner_preferences").insert([ //initialising the state of child tables. so GET wont be undefined
                                {
                                    student_insert_id: item[0].nano_id, //use the insertData() nano id
                                    name: '',
                                    email: '',
                                    partner_admission_id: '',
                                    admission_id: ''
                                    
              }])
       
      } else {
        for (let i = 0; i < memberPartnerInputs.length; i++) {
  const { error } = await supabaseAdmin.from("partner_preferences").insert([
      {
        name: memberPartnerInputs[i].firstItem,
        email: memberPartnerInputs[i].secondItem,
        partner_admission_id: memberPartnerInputs[i].thirdItem,
      admission_id: admission_idInput,
        student_insert_id: item[0].nano_id
      }
    ])
    if (error) {
      console.log(error)
    }  
  }
    }
      }
      
  deleteAllPartners()

  
    
  // insert to programming_skills table
  for (let i = 0; i < programmingInputs.length; i++) {
  const { error } = await supabaseAdmin.from("programming_skills").insert([
      {
        languages: programmingInputs[i].firstItem,
        comments: programmingInputs[i].secondItem,
        student_insert_id: item[0].nano_id
      }
    ])
    if (error) {
      console.log(error)
    }  
}
  
 
 

  };//end of submit formm

  




  





  return (


    
    <div className='mx-auto max-w-2xl py-16 px-4 lg:max-w-7xl lg:px-8'> {/*wrapper for all*/}
      

      
       
 















      
      

      
      <h1 className="text-4xl font-bold text-center mx-auto max-w-2xl pt-32 px-4  lg:max-w-7xl lg:px-8 pb-16">Application for SOC-PROJECT INC PATHWAY</h1>
      <h3 className="font-bold text-center mx-auto max-w-2xl  px-4  lg:max-w-7xl lg:px-8 pb-16">Email: {item[0].email}</h3>
   <form onSubmit={handleSubmit(onSubmit)}> 
        <div className="overflow-hidden shadow sm:rounded-md"> {/*form wrapper*/}
        <div className="bg-white px-4 py-5 sm:p-6">

          <div className="flex flex-wrap -mx-3 mb-5"> {/*class row*/}
    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
        Name
      </label>
      <label className="block  tracking-wide text-gray-700 text-xs mb-2">
        Full Name
      </label>
            <input className="appearance-none block w-full  text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-city" type="text" placeholder=" "
            value={nameInput} {...register("Name", {required: 'true'})}
              onInput={e => setNameInput(e.target.value)}
            />
          </div>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-city">
        Class
                </label>
                <label className="block  tracking-wide text-gray-700 text-xs mb-2">
        Class
      </label>
            <input className="appearance-none block w-full  text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-city" type="text" placeholder="DIT/2A/01"
              name="class"
              value={classInput} {...register("Class", {required: 'true'})}
              onInput={e => { setClassInput(e.target.value);   } }/>
    </div>
    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-city">
        Admission Number
                </label>
                <label className="block  tracking-wide text-gray-700 text-xs mb-2">
        Without the "p"
      </label>
            <input className="appearance-none block w-full  text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"  type="number" placeholder="2000000"   
              value={admission_idInput} {...register("admin_id", {required: 'true' })}
                  onInput={e => { e.target.value = e.target.value.slice(0, 7); setAdmissionIdInput(e.target.value) }} //set max length
            
            />
    </div>
        </div>


        <div className="flex flex-wrap -mx-3 mb-6"> {/*mobile row*/}
    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-city">
        Mobile
      </label>
            <input className="appearance-none block w-full  text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-city" type="number" placeholder="91234567"
              name="class"
              value={mobileInput} {...register("Mobile", {required: 'true'})}
                  onInput={e => { e.target.value = e.target.value.slice(0, 8); setMobileInput(e.target.value) }}/>
    </div>
    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-city">
        Email
      </label>
            <input className="appearance-none block w-full  text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-city" type="text" placeholder=" "
              value={item[0].email}  {...register("Email", {required: 'true', pattern: /^\S+@\S+$/i})}
              onInput={e => setEmailInput(e.target.value)}
            />
    </div>
    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-city">
        Personal Tutor
      </label>
            <input className="appearance-none block w-full  text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-city" type="text" placeholder=""
              value={personal_tutorInput} {...register("pt", {required: 'true'})}
              onInput={e => setPersonalTutorInput(e.target.value)}
            />
    </div>
        </div>

            <div className="mb-10"></div>


        {/*reason row*/}
        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 " htmlFor="grid-city">
        Reason for applying: 
      </label>
        {/* <textarea  {...register("reason", {required: 'true'})}
      className="
        form-control
        block
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
      "
      id="exampleFormControlTextarea1"
      rows="3"
          placeholder="Your message"
          value={reasonInput}
              onInput={e => setReasonInput(e.target.value)}
        ></textarea> */}
            <JoditEditor
                ref={editor}
                value={reasonInput}
                config={config}
                onChange={newContent => {setReasonInput(newContent)}}
            />
        

            <div className="mb-10"></div>
        {/*describe urself row*/}
        <label className="mt-5 block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-city">
        Describe about yourself and your attitude towards self-learning with minimal supervision
      </label>
        {/* <textarea {...register("describe", {required: 'true'})}
      className="
        form-control
        block
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
      "
      id="exampleFormControlTextarea1"
      rows="3"
      placeholder="Your message"
      value={describe_yourselfInput}
              onInput={e => setDescribeYourselfInput(e.target.value)}
    ></textarea> */}
            <JoditEditor
                ref={editor}
                value={describe_yourselfInput}
                config={config}
                onChange={newContent => {setDescribeYourselfInput(newContent)}}
            />
        
            
            <div className="mb-10"></div>
            
         


 
        {/*tech interest row*/}
        <label className="mt-7 block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-city">
        Technical interests
      </label>
        {/* <textarea {...register("tech_interest", {required: 'true'})}
      className="
        form-control
        block
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
      "
      id="exampleFormControlTextarea1"
      rows="3"
          placeholder="Your message"
          value={technical_interestsInput}
              onInput={e => setTechnicalInterestsInput(e.target.value)}
    ></textarea> */}
            <JoditEditor
                ref={editor}
                value={technical_interestsInput}
                config={config}
                onChange={newContent => {setTechnicalInterestsInput(newContent)}}
            />

            
<div className="mb-10"></div>

            {/*add languages row*/}
        <label className="mt-7 block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-city">
        Programming Skills and Interest
      </label>
        {programmingInputs.map(inputField => (
          <div key={inputField.id}>
            <input
              className="mr-2  text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              placeholder="Languages"
              name="firstItem"
              value={inputField.firstItem}   
              onChange={event => handleChangeInput(inputField.id, event)}
            />
            <input
               
              className="mr-2  text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              placeholder="Comments"
              name="secondItem"
              value={inputField.secondItem} 
              onChange={event => handleChangeInput(inputField.id, event)}
            />
            <IconButton disabled={programmingInputs.length === 1} onClick={() => handleRemoveFields(inputField.id)}>
              <RemoveIcon />
            </IconButton>
            <IconButton
              onClick={handleAddFields}
            >
              <AddIcon />
            </IconButton>
          </div>
        ))}


            <div className="mb-10"></div>
            

        {/*add partners row*/}
        <label className="mt-7 block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-city">
        Do you have a member partner you prefer to work with? Please indicate here for PROJECT INC team to take this input as consideration.
      </label>
        {memberPartnerInputs.map(inputField => (
          <div key={inputField.id}>
            <input className="mr-2  text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              placeholder="Full Name"
              name="firstItem"
              value={inputField.firstItem}  
              onChange={event => handleMemberPartnerInputChangeInput(inputField.id, event)}
            />
            <input className="mr-2 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              placeholder="Email"
              name="secondItem"
              value={inputField.secondItem} 
              onChange={event => handleMemberPartnerInputChangeInput(inputField.id, event)}
            />
            <input className="mr-2  text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              type="number"
              placeholder="Admission ID"
              name="thirdItem"
              value={inputField.thirdItem} 
              onChange={event => { event.target.value = event.target.value.slice(0, 7); handleMemberPartnerInputChangeInput(inputField.id, event) }}
            />
            <IconButton disabled={memberPartnerInputs.length === 1} onClick={() => handleMemberPartnerInputRemoveFields(inputField.id)}>
              <RemoveIcon />
            </IconButton>
            <IconButton
              onClick={handleMemberPartnerInputAddFields}
            >
              <AddIcon />
            </IconButton>
          </div>
        ))}
        </div>
        
                  <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                    <button onClick={handleSubmit} type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Submit</button>
                  </div>
                </div>
             
</form>
      

   <ToastContainer/>
    </div>
   
  )
}