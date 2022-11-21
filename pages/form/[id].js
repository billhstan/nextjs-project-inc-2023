import React, { useState, useRef, useMemo } from 'react'
import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import IconButton from '@material-ui/core/IconButton'
import RemoveIcon from '@material-ui/icons/Remove'
import AddIcon from '@material-ui/icons/Add'

import { useForm } from 'react-hook-form'

import dynamic from 'next/dynamic'
const importJodit = () => import('jodit-react')
const JoditEditor = dynamic(importJodit, {
  ssr: false,
})

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabaseAdmin = createClient(
  supabaseUrl || '',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvaHpmdm94eHJldHJ0bWpyZGh3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY2Mjk1NTU5NCwiZXhwIjoxOTc4NTMxNTk0fQ.j-tMNS-yzCUd3ckIZPYV7xMA6zlCVDtU7fC_BHREfTY'
)

 

export const getServerSideProps = async (context) => {
  var id = context.params.id
  const { data, error } = await supabaseAdmin
    .from('applications')
    .select('*, partner_preferences!inner(*), programming_skills!inner(*)')
    .eq('nano_id', id) //need to join table to get partner preferences. BUT THERE IS NOTHING IN PARTNER PREFERENCES BECAUSE I NEVER ADD, WHEN REGISTER USER. DID NOT INITIALISE THE VALUE. SO WHEN I GET THE STATE, IT IS UNDEFINED.
  return {
    props: { item: data },
  }
}

export default function Home({ item }) {
  //set state of current data in database
  
  const [classInput, setClassInput] = useState(item[0].class)
  const [admission_idInput, setAdmissionIdInput] = useState(
    item[0].admission_id
  )
  const [nameInput, setNameInput] = useState(item[0].name)
  const [mobileInput, setMobileInput] = useState(item[0].mobile)
  const [emailInput, setEmailInput] = useState(item[0].email)
  const [personal_tutorInput, setPersonalTutorInput] = useState(
    item[0].personal_tutor
  )
  const [reasonInput, setReasonInput] = useState(item[0].reason)
  const [describe_yourselfInput, setDescribeYourselfInput] = useState(
    item[0].describe_yourself
  )
  const [technical_interestsInput, setTechnicalInterestsInput] = useState(
    item[0].technical_interests
  )

  // Jodi Editor
  const editor = useRef(null)

  const config = useMemo(
    () => ({
      readonly: false,
    }),
    []
  )

  // END Jodi Editor

  //add programming skills input field
  var current_programming_skills = []
   if (item[0].programming_skills) {
    for (var i = 0; i < item[0].programming_skills.length; i++) {
      current_programming_skills[i] = {
        id: uuidv4(),
        firstItem: item[0].programming_skills[i].languages,
        secondItem: item[0].programming_skills[i].comments,
      }
    }
  }
  const [programmingInputs, setInputs] = useState(
    current_programming_skills //set the member partners state
  )

  const handleChangeInput = (id, event) => {
    const newInputs = programmingInputs.map((i) => {
      if (id === i.id) {
        i[event.target.name] = event.target.value
      }
      return i
    })
    setInputs(newInputs)
  }

  const handleAddFields = () => {
    setInputs([
      ...programmingInputs,
      { id: uuidv4(), firstItem: '', secondItem: '' },
    ])
  }

  const handleRemoveFields = (id) => {
    const values = [...programmingInputs]
    values.splice(
      values.findIndex((value) => value.id === id),
      1
    )
    setInputs(values)
  }
  //END programminginputfields


  //add member partner input field
  var current_partner_preferences = []
   if (item[0].partner_preferences) {
    for (var i = 0; i < item[0].partner_preferences.length; i++) {
      current_partner_preferences[i] = {
        id: uuidv4(),
        firstItem: item[0].partner_preferences[i].name,
        secondItem: item[0].partner_preferences[i].email,
        thirdItem: item[0].partner_preferences[i].partner_admission_id,
      }
    }
  }
  const [memberPartnerInputs, setMemberPartnerInputs] = useState(
    current_partner_preferences //set the member partners state
  )

  const handleMemberPartnerInputChangeInput = (id, event) => {
    const newInputs = memberPartnerInputs.map((i) => {
      if (id === i.id) {
        i[event.target.name] = event.target.value
      }
      return i
    })
    setMemberPartnerInputs(newInputs)
  }

  const handleMemberPartnerInputAddFields = () => {
    setMemberPartnerInputs([
      ...memberPartnerInputs,
      { id: uuidv4(), firstItem: '', secondItem: '', thirdItem: '' },
    ])
  }

  const handleMemberPartnerInputRemoveFields = (id) => {
    const values = [...memberPartnerInputs]
    values.splice(
      values.findIndex((value) => value.id === id),
      1
    )
    setMemberPartnerInputs(values)
  }
  // END OF member partner input field

  //react form hook
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  //submit form
  const onSubmit = async (e) => {
    if (classInput == '') {
      toast.error('Fill up', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
      return
    }
    // if form filled up correctly
    toast.success('Form submitted!', {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })

    //insert form data to applications table
    const { data, error } = await supabaseAdmin
      .from('applications')
      .update({
        class: classInput,
        name: nameInput,
        admission_id: admission_idInput,
        mobile: mobileInput,
        personal_tutor: personal_tutorInput,
        reason: reasonInput,
        describe_yourself: describe_yourselfInput,
        technical_interests: technical_interestsInput,
        last_updated: new Date()
      })
      .eq('nano_id', item[0].nano_id)

    if (data.length == 1) {
      const {
        admission_id,
        name,
        mobile,
        email,
        personal_tutor,
        reason,
        describe_yourself,
        technical_interests,
      } = data[0]
      setClassInput(data[0].class)
      setAdmissionIdInput(admission_id)
      setNameInput(name)
      setMobileInput(mobile)
      setEmailInput(email)
      setPersonalTutorInput(personal_tutor)
      setReasonInput(reason)
      setDescribeYourselfInput(describe_yourself)
      setTechnicalInterestsInput(technical_interests)
      //set state of current data in database
    }
    if (error) {
      console.log(error)
    }


    

    //delete all records in partner preference first. PREVENT DUPLICATE
    await supabaseAdmin
      .from('partner_preferences')
      .delete()
      .eq('student_insert_id', item[0].nano_id)
    
    await supabaseAdmin
      .from('programming_skills')
      .delete()
      .eq('student_insert_id', item[0].nano_id)

    
    
    
    
    const insertProgrammingSkillsData = async () => {
      if (programmingInputs.length == 0) {
        // IF THE STUDENT NEVER KEY IN ANY MEMBER PARTNER INPUTS, ADD A BLANK DATA. to make the state not null. if state is empty, it will crash
        await supabaseAdmin.from('programming_skills').insert([
          //initialising the state of child tables. so GET wont be undefined
          {
            student_insert_id: item[0].nano_id, //use the insertData() nano id
            languages: '',
            comments: '',
          },
        ])
      }
    else {
        for (let i = 0; i < programmingInputs.length; i++) {
          const { data,error } = await supabaseAdmin
            .from('programming_skills')
            .insert([
              {
                languages: programmingInputs[i].firstItem,
                comments: programmingInputs[i].secondItem,
                student_insert_id: item[0].nano_id,
              },
            ])
          if (error) {
            console.log(error)
          }
        }
      }
    }
     
  
    
    
    const insertPartnerPreferencesData = async () => {

      //partner preferences child table
      if (memberPartnerInputs.length == 0) {
        // IF THE STUDENT NEVER KEY IN ANY MEMBER PARTNER INPUTS, ADD A BLANK DATA. to make the state not null. if state is empty, it will crash
        await supabaseAdmin.from('partner_preferences').insert([
          //initialising the state of child tables. so GET wont be undefined
          {
            student_insert_id: item[0].nano_id, //use the insertData() nano id
            name: '',
            email: '',
            partner_admission_id: '',
            admission_id: '',
          },
        ])
      } else {
        for (let i = 0; i < memberPartnerInputs.length; i++) {
          const { data,error } = await supabaseAdmin
            .from('partner_preferences')
            .insert([
              {
                name: memberPartnerInputs[i].firstItem,
                email: memberPartnerInputs[i].secondItem,
                partner_admission_id: memberPartnerInputs[i].thirdItem,
                admission_id: admission_idInput,
                student_insert_id: item[0].nano_id,
              },
            ])

          if (error) {
            console.log(error)
          }
        }
      } 
    }



    insertPartnerPreferencesData()
    insertProgrammingSkillsData()

 
  } //end of submit form

  return (
    <div className="mx-auto max-w-2xl py-16 px-4 lg:max-w-7xl lg:px-8">
      {' '}
      {/*wrapper for all*/}
      <h1 className="mx-auto max-w-2xl px-4 pt-32 pb-12 text-center text-5xl  font-bold lg:max-w-7xl lg:px-8">
        Registration is closed. Form has been disabled from submitting.
      </h1>
      <h3 className="mx-auto max-w-2xl px-4 pb-16  text-center  font-bold lg:max-w-7xl lg:px-8">
        Your Email: {item[0].email}
        <br></br>
        Please email to kohzhenye.16@ichat.sp.edu.sg if you encounter any
        technical issues.
      </h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="overflow-hidden shadow sm:rounded-md">
          {' '}
          {/*form wrapper*/}
          <div className="bg-white px-4 py-5 sm:p-6">
            <div className="-mx-3 mb-5 flex flex-wrap">
              {' '}
              {/*class row*/}
              <div className="mb-6 w-full px-3 md:mb-0 md:w-1/3">
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700">
                  Name
                </label>
                <label className="mb-2  block text-xs tracking-wide text-gray-700">
                  Full Name (As Shown On Admission Card)
                </label>
                <input
                  className="block w-full appearance-none  rounded border border-gray-200 py-3 px-4 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                  id="grid-city"
                  type="text"
                  placeholder=" "
                  value={nameInput}
                  {...register('Name', { required: 'true' })}
                  onInput={(e) => setNameInput(e.target.value)}
                />
              </div>
              <div className="mb-6 w-full px-3 md:mb-0 md:w-1/3">
                <label
                  className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
                  htmlFor="grid-city"
                >
                  Class
                </label>
                <label className="mb-2  block text-xs tracking-wide text-gray-700">
                  DIT/2A/01
                </label>
                <input
                  className="block w-full appearance-none  rounded border border-gray-200 py-3 px-4 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                  id="grid-city"
                  type="text"
                  placeholder=""
                  name="class"
                  value={classInput}
                  {...register('Class', { required: 'true' })}
                  onInput={(e) => {
                    setClassInput(e.target.value)
                  }}
                />
              </div>
              <div className="mb-6 w-full px-3 md:mb-0 md:w-1/3">
                <label
                  className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
                  htmlFor="grid-city"
                >
                  Admission Number
                </label>
                <label className="mb-2  block text-xs tracking-wide text-gray-700">
                  E.g 2000123, without the "p".
                </label>
                <input
                  className="block w-full appearance-none  rounded border border-gray-200 py-3 px-4 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                  type="number"
                  placeholder=""
                  value={admission_idInput}
                  {...register('admin_id', { required: 'true' })}
                  onInput={(e) => {
                    e.target.value = e.target.value.slice(0, 7)
                    setAdmissionIdInput(e.target.value)
                  }} //set max length
                />
              </div>
            </div>

            <div className="-mx-3 mb-6 flex flex-wrap">
              {' '}
              {/*mobile row*/}
              <div className="mb-6 w-full px-3 md:mb-0 md:w-1/3">
                <label
                  className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
                  htmlFor="grid-city"
                >
                  Mobile
                </label>
                <label className="mb-2  block text-xs tracking-wide text-gray-700">
                  E.g 91234567
                </label>
                <input
                  className="block w-full appearance-none  rounded border border-gray-200 py-3 px-4 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                  id="grid-city"
                  type="number"
                  placeholder=""
                  name="class"
                  value={mobileInput}
                  {...register('Mobile', { required: 'true' })}
                  onInput={(e) => {
                    e.target.value = e.target.value.slice(0, 8)
                    setMobileInput(e.target.value)
                  }}
                />
              </div>
              <div className="mb-6 w-full px-3 md:mb-0 md:w-1/3">
                <label
                  className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
                  htmlFor="grid-city"
                >
                  Email
                </label>
                <label className="mb-2  block text-xs tracking-wide text-gray-700">
                  iChat email.
                </label>
                <input
                  className="block w-full appearance-none  rounded border border-gray-200 py-3 px-4 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                  id="grid-city"
                  type="text"
                  placeholder=" "
                  value={item[0].email}
                  {...register('Email', {
                    required: 'true',
                    pattern: /^\S+@\S+$/i,
                  })}
                  onInput={(e) => setEmailInput(e.target.value)}
                />
              </div>
              <div className="mb-6 w-full px-3 md:mb-0 md:w-1/3">
                <label
                  className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
                  htmlFor="grid-city"
                >
                  Personal Tutor
                </label>
                <label className="mb-2  block text-xs tracking-wide text-gray-700">
                  Full Name of Tutor
                </label>
                <input
                  className="block w-full appearance-none  rounded border border-gray-200 py-3 px-4 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                  id="grid-city"
                  type="text"
                  placeholder=""
                  value={personal_tutorInput}
                  {...register('pt', { required: 'true' })}
                  onInput={(e) => setPersonalTutorInput(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-10"></div>

            {/*reason row*/}
            <label
              className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700 "
              htmlFor="grid-city"
            >
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
              onChange={(newContent) => {
                setReasonInput(newContent)
              }}
            />

            <div className="mb-10"></div>
            {/*describe urself row*/}
            <label
              className="mt-5 mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
              htmlFor="grid-city"
            >
              Describe about yourself and your attitude towards self-learning
              with minimal supervision
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
              onChange={(newContent) => {
                setDescribeYourselfInput(newContent)
              }}
            />

            <div className="mb-10"></div>

            {/*tech interest row*/}
            <label
              className="mt-7 mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
              htmlFor="grid-city"
            >
              Technical interests (In which area you plan to be good in)
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
              onChange={(newContent) => {
                setTechnicalInterestsInput(newContent)
              }}
            />

            <div className="mb-10"></div>

            {/*add languages row*/}
            <label
              className="mt-7 mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
              htmlFor="grid-city"
            >
              Programming Skills and Interest
            </label>
            {programmingInputs.map((inputField) => (
              <div key={inputField.id}>
                <input
                  className="mr-2 rounded border border-gray-200 py-3 px-4 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none md:w-1/3"
                  placeholder="Languages"
                  name="firstItem"
                  value={inputField.firstItem}
                  onChange={(event) => handleChangeInput(inputField.id, event)}
                />
                <input
                  className="mr-2 rounded border border-gray-200 py-3 px-4 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none md:w-1/2"
                  placeholder="Comments"
                  name="secondItem"
                  value={inputField.secondItem}
                  onChange={(event) => handleChangeInput(inputField.id, event)}
                />
                <IconButton
                  disabled={programmingInputs.length === 1}
                  onClick={() => handleRemoveFields(inputField.id)}
                >
                  <RemoveIcon />
                </IconButton>
                <IconButton onClick={handleAddFields}>
                  <AddIcon />
                </IconButton>
              </div>
            ))}

            <div className="mb-10"></div>

            {/*add partners row*/}
            <label
              className="mt-7 mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
              htmlFor="grid-city"
            >
              Do you have a member partner you prefer to work with? Please
              indicate here for PROJECT INC team to take this input as
              consideration.
            </label>
            {memberPartnerInputs.map((inputField) => (
              <div key={inputField.id}>
                <input
                  className="mr-2 rounded border border-gray-200 py-3 px-4 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none md:w-1/4"
                  placeholder="Full Name"
                  name="firstItem"
                  value={inputField.firstItem}
                  onChange={(event) =>
                    handleMemberPartnerInputChangeInput(inputField.id, event)
                  }
                />
                <input
                  className="mr-2 rounded border border-gray-200 py-3 px-4 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none md:w-1/4"
                  placeholder="Email"
                  name="secondItem"
                  value={inputField.secondItem}
                  onChange={(event) =>
                    handleMemberPartnerInputChangeInput(inputField.id, event)
                  }
                />
                <input
                  className="mr-2 rounded border border-gray-200 py-3 px-4 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none md:w-1/4"
                  type="number"
                  placeholder="Admission ID"
                  name="thirdItem"
                  value={inputField.thirdItem}
                  onChange={(event) => {
                    event.target.value = event.target.value.slice(0, 7)
                    handleMemberPartnerInputChangeInput(inputField.id, event)
                  }}
                />
              </div>
            ))}
          </div>
          <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
            {/* <button
              onClick={handleSubmit}
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Submit
            </button> */}
          </div>
        </div>
      </form>
      <ToastContainer />
    </div>
  )
}
