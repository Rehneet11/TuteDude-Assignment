import React from 'react'
import { Button } from '../components/Button'
import { useNavigate } from 'react-router-dom';


export default function HomePage() {
    const navigate = useNavigate();
  return (
    <div className=' flex items-center flex-col h-screen justify-center'>
        <div className='text-4xl font-semibold m-4  flex items-center justify-center'>This is sample HomePage for TuteDude Assignment</div>
        <div className='flex flex-col'>
            <Button label={"Sign in"} onClick={() => {navigate("/signin")}} />
            <Button label={"Sign up"} onClick={() => {navigate("/signup")}} />
        </div>
    </div>
  )
}
