import { db } from '@/service/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import InfoSection from './components/InfoSection';
import Hotels from './components/Hotels';
import PlacesToVisit from './components/PlacesToVisit';

function Viewtrip() {

    const {tripId}= useParams();
    const [trip,setTrip]=useState([]);
    useEffect(() => {
        tripId&&GetTripData();
    },[tripId])

    /**
     * Used to get trip information from firebase
     */

    const GetTripData=async()=>{
        const docRef=doc(db,'AiTrips',tripId);
        const docSnap=await getDoc(docRef);

        if(docSnap.exists()){
            console.log("Document:",docSnap.data());
            setTrip(docSnap.data());
        }
        else{
            console.log("No such document");
            toast('No trip Found!')
        }
    }
  return (
    <div className='p-10 md:px-20 lg:px-40 xl:px-56'>
        {/*Information Section */}
            <InfoSection trip={trip}/>
        {/*Recommended Hotels */}
            <Hotels trip={trip}/>
        {/*daily Plan */}
            <PlacesToVisit trip={trip}/>
        {/*Footer */}
    </div>
  )
}

export default Viewtrip