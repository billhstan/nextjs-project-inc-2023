import React, { useState, useRef, useMemo } from 'react'
import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useForm } from 'react-hook-form'
import dynamic from 'next/dynamic'

const importJodit = () => import('jodit-react')
const JoditEditor = dynamic(importJodit, {
  ssr: false,
})
import parse from 'html-react-parser'


// SUPABASE Config
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAdmin = createClient(
  supabaseUrl || '',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvaHpmdm94eHJldHJ0bWpyZGh3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY2Mjk1NTU5NCwiZXhwIjoxOTc4NTMxNTk0fQ.j-tMNS-yzCUd3ckIZPYV7xMA6zlCVDtU7fC_BHREfTY'
)

 
// nextJS URL Config
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

// nextJS Page Config
export default function Home({ item }) {
  const [commentsInput, setCommentsInput] = useState(item[0].comments)
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


  // Jodit Editor
  const editor = useRef(null)
  const config = useMemo(
    () => ({
      readonly: false,
    }),
    []
  )
  // END Jodi Editor

  // programming skills input field
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
 
  // member partner input field
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

 
  // React form hook
  const {
    register,
    handleSubmit,
     formState: { errors },
  } = useForm()

  
  // Submit form
  const onSubmit = async (e) => {

    //if form filled up correctly
    toast.success('Comments updated!', { 
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
        comments: commentsInput
      })
      .eq('nano_id', item[0].nano_id)

    if (data.length == 1) {
      setClassInput(data[0].comments)
      //set state of current data in database
    }
    if (error) {
      console.log(error)
    }

    
   
  } // END of submit form

 
 
  return (
    <div className="mx-auto max-w-2xl py-16 px-4 lg:max-w-7xl lg:px-8">
      {' '}
      <div>
        {/*wrapper for all*/}
        <h1 className="mx-auto max-w-2xl px-4 pt-32 pb-12 text-center text-5xl  font-bold lg:max-w-7xl lg:px-8">
          Student's Comments Form
        </h1>

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

                  <input
                    readonly="readonly"
                    className="block w-full appearance-none  rounded border border-gray-200 py-3 px-4 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                    id="studentName"
                    type="text"
                    placeholder=" "
                    value={nameInput}
                  />
                </div>
                <div className="mb-6 w-full px-3 md:mb-0 md:w-1/3">
                  <label
                    className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
                    htmlFor="grid-city"
                  >
                    Class
                  </label>

                  <input
                    readonly="readonly"
                    className="block w-full appearance-none  rounded border border-gray-200 py-3 px-4 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                    id="studentClass"
                    type="text"
                    placeholder=""
                    name="class"
                    value={classInput}
                  />
                </div>
                <div className="mb-6 w-full px-3 md:mb-0 md:w-1/3">
                  <label
                    className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
                    htmlFor="grid-city"
                  >
                    Admission Number
                  </label>

                  <input
                    readonly="readonly"
                    className="block w-full appearance-none  rounded border border-gray-200 py-3 px-4 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                    type="number"
                    id="studentID"
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

                  <input
                    readonly="readonly"
                    className="block w-full appearance-none  rounded border border-gray-200 py-3 px-4 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                    id="studentMobile"
                    type="number"
                    placeholder=""
                    name="class"
                    value={mobileInput}
                  />
                </div>
                <div className="mb-6 w-full px-3 md:mb-0 md:w-1/3">
                  <label
                    className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
                    htmlFor="grid-city"
                  >
                    Email
                  </label>

                  <input
                    readonly="readonly"
                    className="block w-full appearance-none  rounded border border-gray-200 py-3 px-4 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                    type="text"
                    placeholder=" "
                    value={item[0].email}
                  />
                </div>
                <div className="mb-6 w-full px-3 md:mb-0 md:w-1/3">
                  <label
                    className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
                    htmlFor="grid-city"
                  >
                    Personal Tutor
                  </label>

                  <input
                    readonly="readonly"
                    className="block w-full appearance-none  rounded border border-gray-200 py-3 px-4 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                    id="grid-city"
                    type="text"
                    placeholder=""
                    value={personal_tutorInput}
                  />
                </div>
              </div>

              <div className="mb-10"></div>

              {/*reason row*/}
              <label
                className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700 "
                htmlFor="grid-city"
                id="studentReason"
              >
                Reason for applying:
              </label>
              <div>{parse(reasonInput)}</div>

              <div className="mb-10"></div>

              {/*describe urself row*/}
              <label
                className="mt-5 mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
                htmlFor="grid-city"
              >
                Describe about yourself and your attitude towards self-learning
                with minimal supervision
              </label>
              <div>{parse(describe_yourselfInput)}</div>

              <div className="mb-10"></div>

              {/*tech interest row*/}
              <label
                className="mt-7 mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
                htmlFor="grid-city"
              >
                Technical interests (In which area you plan to be good in)
              </label>
              <div>{parse(technical_interestsInput)}</div>

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
                  />
                  <input
                    className="mr-2 rounded border border-gray-200 py-3 px-4 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none md:w-1/2"
                    placeholder="Comments"
                    name="secondItem"
                    value={inputField.secondItem}
                  />
                </div>
              ))}

              <div className="mb-10"></div>

              {/*add partners row*/}
              <label
                className="mt-7 mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
                htmlFor="grid-city"
              >
                Member Partners
              </label>
              {memberPartnerInputs.map((inputField) => (
                <div key={inputField.id}>
                  <input
                    className="mr-2 rounded border border-gray-200 py-3 px-4 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none md:w-1/4"
                    placeholder="Full Name"
                    name="firstItem"
                    value={inputField.firstItem}
                  />
                  <input
                    className="mr-2 rounded border border-gray-200 py-3 px-4 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none md:w-1/4"
                    placeholder="Email"
                    name="secondItem"
                    value={inputField.secondItem}
                  />
                  <input
                    className="mr-2 rounded border border-gray-200 py-3 px-4 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none md:w-1/4"
                    type="number"
                    placeholder="Admission ID"
                    name="thirdItem"
                    value={inputField.thirdItem}
                  />
                </div>
              ))}
            </div>
            <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
              {/*  Student Comments */}
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700">
                Student Comments
              </label>

              <input
                className="mb-5 block w-full appearance-none rounded  border border-gray-200 py-5 py-3 px-4 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                id="studentName"
                type="text"
                placeholder=" "
                value={commentsInput}
                {...register('Comments', { required: 'true' })}
                onInput={(e) => setCommentsInput(e.target.value)}
              />
              <button
                onClick={handleSubmit}
                type="submit"
                id="studentSubmit"
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  )
}
