import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AI_PROMPT, SelectBudgetOptions, SelectTravelesList } from '@/constants/options';
import { chatSession } from '@/service/AIModel';
import React, { useEffect, useRef, useState } from 'react'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete'
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,

} from "@/components/ui/dialog"
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from '@react-oauth/google';
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import axios from 'axios';
import { doc, setDoc } from "firebase/firestore";
import { db } from '@/service/firebaseConfig';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';

function CreateTrip() {
  const [place, setPlace] = useState();
  const [formData, setFormData] = useState([]);
  const [openDailog, setOpenDailog] = useState(false);
  const navigate=useNavigate();
  const [loading, setLoading] = useState(false);

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    })
  }

  useEffect(() => {
    console.log(formData);
  }, [formData])

  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.log(error)
  })


  const OnGenerateTrip = async () => {

    const user = localStorage.getItem('user');
    if (!user) {
      setOpenDailog(true)
      return;
    }

    if (formData?.noOfDays > 5 && !formData?.location || !formData?.budget || !formData?.Traveler) {
      toast("Please fill all details")
      return;
    }
    setLoading(true);
    const FINAL_PROMPT = AI_PROMPT
      .replace('{location}', formData?.location.label)
      .replace('{totalDays}', formData?.noOfDays)
      .replace('{Traveler}', formData?.Traveler)
      .replace('{budget}', formData?.budget)
      .replace('{totalDays}', formData?.noOfDays)
    const result = await chatSession.sendMessage(FINAL_PROMPT);

    console.log("--", result?.response?.text());
    setLoading(false);
    SaveAiTrip(result?.response?.text())
  }

  const SaveAiTrip = async (TripData) => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user'));
    const docId = Date.now().toString()

    //save to database
    await setDoc(doc(db, "AiTrips", docId), {
      userSelection: formData,
      tripData: JSON.parse(TripData),
      userEmail: user?.email,
      id: docId
    });
    setLoading(false);
    navigate('/view-trip/'+docId)
  }

  const GetUserProfile = (tokenInfo) => {
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
      headers: {
        Authorization: `Bearer ${tokenInfo?.access_token}`,
        Accept: 'Application/json'
      }
    }).then((resp) => {
      console.log(resp);
      localStorage.setItem('user', JSON.stringify(resp.data));
      setOpenDailog(false);
      OnGenerateTrip();
    })
  }

  return (
    //create-trip page
    <div className='mx-40 sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10 mb-10 '>
      <h2 className=' font-bold text-3xl text-center'>Tell us your travel preferences 🏕️</h2>
      <p className='mt-3 text-gray-500 text-xl text-center'>Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences</p>

      <div className='mt-20 flex flex-col gap-9 '>
        <div>
          <h2 className='text-xl my-3 font-medium '> What would you like to explore? </h2>
          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
            selectProps={{
              place,
              onChange: (v) => { setPlace(v); handleInputChange('location', v) }
            }}
          />
        </div>

        <div>
          <h2 className='text-xl my-3 font-medium '> How many days are you dreaming of exploring?</h2>
          <Input placeholder={'Ex. 3'} type="number"
            onChange={(e) => handleInputChange('noOfDays', e.target.value)}
          />
        </div>
      </div>

      <div className='mt-10'>
        <h2 className='text-xl my-3 font-medium '> What is yor Budget? </h2>
        <div className='grid grid-cols-3 gap-5 mt-5'>
          {SelectBudgetOptions.map((item, index) => (
            <div key={index}
              onClick={() => handleInputChange('budget', item.title)}
              className={`p-4 border cursor-pointer 
            rounded-lg hover:shadow-lg
            ${formData?.budget == item.title && 'shadow-lg border-black'}
            `}>
              <h2 className='text-4xl'>{item.icon}</h2>
              <h2 className='font-bold text-lg'>{item.title}</h2>
              <h2 className='text-sm text-gray-500'>{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      <div className='mt-10'>
        <h2 className='text-xl my-3 font-medium '> Who do you plan on travelling with on your next adventure? </h2>
        <div className='grid grid-cols-3 gap-5 mt-5'>
          {SelectTravelesList.map((item, index) => (
            <div key={index}
              onClick={() => handleInputChange('Traveler', item.people)}
              className={`p-4 border cursor-pointer rounded-lg 
              ${formData?.Traveler == item.people && 'shadow-lg border-black'}
            hover:shadow-lg`}>
              <h2 className='text-4xl'>{item.icon}</h2>
              <h2 className='font-bold text-lg'>{item.title}</h2>
              <h2 className='text-sm text-gray-500'>{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      <div className='my-10 justify-end flex'>
        <Button
          disable={loading}
          onClick={OnGenerateTrip}>
          {loading ?
            <AiOutlineLoading3Quarters className='h-7 w-7 animate-spin' /> : 'Generate Trip'
          }
        </Button>
      </div>

      <Dialog open={openDailog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <VisuallyHidden.Root>Fixizl - Sign In Dialog</VisuallyHidden.Root>
            </DialogTitle>
            <div className="flex items-center">
              <img src="/logo.svg" alt="Logo" />
              <h1 className="text-xl font-bold ml-3 text-black">Fixizl</h1>
            </div>
            <DialogDescription asChild>
              <div>
                <p>Sign in to access this feature securely.</p>
              </div>
            </DialogDescription>
            <div className="mt-7">
              <h2 className="font-bold text-lg text-stone-950">Sign In with Google</h2>
              <Button onClick={login}
                className="w-full mt-5 flex gap-4 items-center">
                <FcGoogle style={{ height: "30px", width: "30px" }} />
                Sign In with Google
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>



    </div>
  )
}

export default CreateTrip