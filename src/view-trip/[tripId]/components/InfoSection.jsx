import { Button } from '@/components/ui/button'
import { GetPlaceDetails } from '@/service/GlobalApi';
import React, { useEffect } from 'react'
import { BsShareFill } from "react-icons/bs";


function InfoSection({trip}) {
  return (
    <div>
        <img src='/placeholder.jpg' className='h-[340px] w-full object-cover rounded-xl'/>

        <div className='flex justify-between items-center mt-5'>
            <div className='my-5 flex flex-col gap-2'>
                <h2 className='font-bold text-2xl mt-5'>{trip?.userSelection?.location?.label}</h2>
                <div className='flex gap-5'>
                    <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-lg'>📆 {trip.userSelection?.noOfDays} Day</h2>
                    <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-lg'>💵 {trip.userSelection?.budget} Budget</h2>
                    <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-lg'>🥂 No. of Traveler: {trip.userSelection?.Traveler}</h2>
                </div>
            </div>
            <Button><BsShareFill /></Button>
        </div>
    </div>
  )
}

export default InfoSection