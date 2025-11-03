"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
const Home = () => {
    const router = useRouter();
  return (
    <>
    <button onClick={()=>router.push("/")} className='top-0 absolute bg-transparent text-white/80 border border-white/80
     left-0 cursor-pointer rounded-md m-4 p-4 px-6'>Home</button>
     </>
  )
}

export default Home