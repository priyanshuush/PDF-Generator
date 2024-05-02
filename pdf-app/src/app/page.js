import CustomNavbar from '@/components/CustomNavbar'

import DropzoneArea from '@/components/Dropzone'

import Footer from '@/components/footer'
import { AuthProvider } from '@/AuthContext'




export default function Home() {

  return (
   <AuthProvider>
    

    <div>


      <CustomNavbar/>

      <br/>

      <DropzoneArea/>

      <br/>

      <Footer/>


    </div>
   
    </AuthProvider>

  )

}