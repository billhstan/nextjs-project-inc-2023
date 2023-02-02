import React, { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { nanoid } from 'nanoid'
 
 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useForm } from "react-hook-form";

 
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL 
const supabaseAnonKey = process.env.SUPABASE_SERVICE_ROLE_KEY
 
const supabaseAdmin =  createClient(
    supabaseUrl || '',
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvaHpmdm94eHJldHJ0bWpyZGh3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY2Mjk1NTU5NCwiZXhwIjoxOTc4NTMxNTk0fQ.j-tMNS-yzCUd3ckIZPYV7xMA6zlCVDtU7fC_BHREfTY"
)


export  function LoadingSpinner() {
  return (
    <div className="spinner-container">
      <div className="loading-spinner">
      </div>
    </div>
  );
}
 

export default function Register() {

  const [isLoading, setIsLoading] = useState(false);
    const [emailInput, setEmailInput] = useState('');
    const [isRegistered, setIsRegistered] = useState(false)
    const [emailStatus, setEmailStatus] = useState(false)
  
  //react form hook
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();





  const onSubmit = async (e) => {
    setEmailStatus(false)
    
    if (!emailInput.toLowerCase().includes("@ichat.sp.edu.sg")) {
      toast.error("Please use your ichat email.", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
       return
    }

    

    setIsLoading(true); //for the form submit button, prevent SPAM

    setTimeout(() => {

      setEmailStatus(true)
      registerEmail()

      setIsLoading(false) 
}, 2000) //2 seconds
      
      
    
    
      const registerEmail = async () => {
          //get data from applications table, see if email and nano_id exists
            const { data, error } = await supabaseAdmin.from('applications').select('email')
            var emails_data = data

            console.log(emailInput)

            // if email exists, return the function
            for (var i = 0; i < emails_data.length; i++) {
                if (emailInput == emails_data[i].email) {
                    setIsRegistered(true) //set to false for testing
                    return
                }
            }

        
            //if email dont exist
        setIsRegistered(false)
        


        const insertData = async () => {
          const { data, error } = await supabaseAdmin.from("applications").insert([
                            {
                                nano_id: nanoid(),
                                email: emailInput  
            }])
            await supabaseAdmin.from("partner_preferences").insert([ //initialising the state of child tables. so GET wont be undefined
                                {
                                    student_insert_id: data[0].nano_id, //use the insertData() nano id
                                    name: '',
                                    email: '',
                                    partner_admission_id: '',
                                    admission_id: ''
                                    
              }])
          await supabaseAdmin.from("programming_skills").insert([ //initialising the state of child tables. so GET wont be undefined
                                {
                                    student_insert_id: data[0].nano_id,
                                    languages: '',
                                    comments: ''                            
            }])
  
          

          
           const sendEmail = () => {
           
                fetch('/api/email', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json; charset=UTF-8',
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        nano_id_url: data[0].nano_id,
                        emailTo: emailInput ,
                    })
                }).then((res) => {
                    console.log('Response received')
                    if (res.status === 200) {
                        console.log('Response succeeded!')
                    }
                })
          }
          sendEmail()
            
        }
            
        insertData()
            
            if (error) {
            console.log(error)
            } 
      } //end of registerEmail()

  

  };//end of submit form



    return (
      <div>
        <div className="flex h-screen">
          <div
            className="login_img_section hidden w-full items-center justify-around
          lg:flex lg:w-1/2"
          >
            <div className="mx-auto w-full flex-col items-center space-y-6 px-20">
              <h1 className="font-sans text-4xl font-bold text-white">
                SP Project INC
              </h1>
              <p className="mt-1 text-white">Industry Now Curriculum</p>
            </div>
          </div>
          <div className="flex w-full items-center justify-center space-y-8 bg-white lg:w-1/2">
            <div className="w-full px-8 md:px-32 lg:px-24">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="rounded-md bg-white p-5 shadow-2xl"
              >
                <h1 className="mb-1 text-2xl font-bold text-gray-800">
                  Registration is closed.
                </h1>

                {/* "REGISTRATION FORM" START FROM HERE */}
                {/* <p className="text-sm font-normal text-gray-600 mb-4">Please use your iChat email to sign up.</p>
          
               <div className="flex items-center border-2 mb-2 py-2 px-3 rounded-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                                
                <input id="email" className=" pl-2 w-full outline-none border-none" type="email" name="email" placeholder="Email Address"
                    value={emailInput} {...register("Email", {required: 'true'})}
                    onInput={e => { setEmailInput(e.target.value); } }/>                   
                            </div>
                            
                            <p className="text-sm font-normal text-gray-600 mb-8">*An email will be sent to you with a URL to fill up the registration form.</p>

                            {isRegistered && emailStatus ? <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                <strong className="font-bold">Already registered. </strong>
                                <span className="block sm:inline">Please check your iChat email for the link that is sent out previously. If you do not receive the email, please email to kohzhenye.16@ichat.sp.edu.sg</span>
                                <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                                    <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
                                </span>
                            </div>
                                :!isRegistered && emailStatus  ?
                                <div className="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md" role="alert">
                                <div className="flex">
                                    <div>
                                    <p className="font-bold">Email sent.</p>
                                    <p className="text-sm">Please check your iChat email. If you do not receive the email, please email to kohzhenye.16@ichat.sp.edu.sg</p>
                                    </div>
                                </div>
                    </div> : null}                 
                {isLoading ? <LoadingSpinner /> : <button onClick={handleSubmit} disabled={isLoading} type="submit" className="block w-full bg-indigo-600 mt-5 py-2 rounded-2xl hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-500 text-white font-semibold mb-2">Sign Up</button>} */}
                {/* "REGISTRATION FORM" END FROM HERE */}
              </form>
            </div>
          </div>
        </div>

        <ToastContainer />
      </div>
    )
}