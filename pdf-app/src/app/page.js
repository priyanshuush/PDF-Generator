import CustomNavbar from '@/components/CustomNavbar'

import Footer from '@/components/Footer'




import Home from '@/pages/home'


import { AuthProvider } from '@/AuthContext'
import "tailwindcss/tailwind.css";





export default function HomePage() {

  return (
    <AuthProvider>

    <div>


      <CustomNavbar/>

      <br/>

      <Home/>

      <br/>

      <Footer/>


    </div>
   
    </AuthProvider>

  )

}