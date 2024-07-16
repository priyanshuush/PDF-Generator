"use client";

import "tailwindcss/tailwind.css";
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Head from "next/head";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from 'next/link';
import { HiOutlineChevronDown, HiOutlineChevronUp } from 'react-icons/hi';


const Home = () => {
    // const router = useRouter();

    // Sample reviews data
    const reviews = [
        { id: 1, name: "John Doe", comment: "This PDF app is amazing!" },
        { id: 2, name: "Jane Smith", comment: "Easy to use and efficient." },
        { id: 3, name: "Alice Johnson", comment: "Great tool for managing PDFs." },
    ];

    const faqs = [
        {
            question: "How do I edit a PDF document?",
            answer: "To edit a PDF document, simply upload the file to our platform and use our intuitive editing tools to make changes to the text, images, and formatting."
        },
        {
            question: "Can I merge multiple PDF files together?",
            answer: "Yes, you can merge multiple PDF files together using our PDF merger tool. Upload the files you want to merge, arrange them in the desired order, and click 'Merge' to combine them into a single PDF document."
        },
        {
            question: "How do I edit a PDF document?",
            answer: "To edit a PDF document, simply upload the file to our platform and use our intuitive editing tools to make changes to the text, images, and formatting."
        },
        {
            question: "Can I merge multiple PDF files together?",
            answer: "Yes, you can merge multiple PDF files together using our PDF merger tool. Upload the files you want to merge, arrange them in the desired order, and click 'Merge' to combine them into a single PDF document."
        },{
            question: "How do I edit a PDF document?",
            answer: "To edit a PDF document, simply upload the file to our platform and use our intuitive editing tools to make changes to the text, images, and formatting."
        },
        {
            question: "Can I merge multiple PDF files together?",
            answer: "Yes, you can merge multiple PDF files together using our PDF merger tool. Upload the files you want to merge, arrange them in the desired order, and click 'Merge' to combine them into a single PDF document."
        },{
            question: "How do I edit a PDF document?",
            answer: "To edit a PDF document, simply upload the file to our platform and use our intuitive editing tools to make changes to the text, images, and formatting."
        },
        {
            question: "Can I merge multiple PDF files together?",
            answer: "Yes, you can merge multiple PDF files together using our PDF merger tool. Upload the files you want to merge, arrange them in the desired order, and click 'Merge' to combine them into a single PDF document."
        },
    ];


    const settings = {
        dots: false,
        infinite: true,
        speed: 300,
        autoplay: true,
        autoplaySpeed: 3000,
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: '200px',
    };


    const tools = [
        { id: 1, name: "Tool 1" },
        { id: 2, name: "Tool 2" },
        { id: 3, name: "Tool 3" },
        { id: 4, name: "Tool 4" },
        { id: 5, name: "Tool 5" },
        { id: 6, name: "Tool 6" },
        { id: 7, name: "Tool 7" },
        { id: 8, name: "Tool 8" },
        { id: 9, name: "Tool 9" },
    ];


    const [expandedIndex, setExpandedIndex] = useState(null);


    return (
        <>
            <Head>
                <title>DocuMane - Your One Stop To All Document Management Services</title>
            </Head>
            <div className="bg-white min-h-screen">
                <header className="text-black py-20">
                    {/* Welcome Section */}
                    <div className="container mx-auto px-4 text-center">
                        <div className=" mx-auto">
                            <h1 className="text-6xl font-bold text-gray-800 mb-8">PDForge</h1>
                            <p className="text-xl text-gray-600 mb-8">Unlock the full potential of your documents with our comprehensive PDF toolkit.</p>
                            <Link href="/">
                                <button
                                    className="bg-light-component hover:bg-dark-component text-white mt-5 py-3 px-40 rounded-md transition-colors duration-300"
                                >
                                    Go to PDF Editor - it's absolutely free!
                                </button>
                            </Link>
                        </div>
                    </div>
                </header>


                {/* About Section */}
                <section className="py-12">
                    <div className="min-h-screen flex flex-col items-center justify-center px-8">
      
                        {/* Features Section */}
                        <div className="max-w-3xl space-y-12 mt-12 prose text-gray-300">
                            {/* Feature 1 */}
                            <div className="p-6 bg-light-component rounded-lg shadow-lg hover:bg-dark-component hover:scale-105 transition-transform duration-300">
                                <h3 className="font-bold text-white text-2xl mb-4">Empowering Users with Streamlined PDF Extraction</h3>
                                <p className="text-lg">
                                    This application is designed to revolutionize your document management experience. We understand the frustration of working with large PDFs and the need to extract specific pages for further use. That's where our innovative PDF Generator comes in!
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="p-6 bg-light-component rounded-lg shadow-lg hover:bg-dark-component hover:scale-105 transition-transform duration-300">
                                <h3 className="font-bold text-white text-2xl mb-4">Effortless Upload and Preview</h3>
                                <p className="text-lg">
                                    Our user-friendly interface features a drag-and-drop zone that makes uploading your PDF files a breeze. Forget cumbersome navigation or file selection methods. Simply drag your PDF onto the designated area, and we'll handle the rest. Once uploaded, a clear preview of your document pages will be displayed for easy reference.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="p-6 bg-light-component rounded-lg shadow-lg hover:bg-dark-component hover:scale-105 transition-transform duration-300">
                                <h3 className="font-bold text-white text-2xl mb-4">Precise Page Selection</h3>
                                <p className="text-lg">
                                    Gone are the days of manually extracting pages through tedious editing software. Our intuitive interface empowers you to meticulously select the exact pages you require. With a few simple clicks, you can choose the specific pages you need for further processing or sharing.
                                </p>
                            </div>

                            {/* Feature 4 */}
                            <div className="p-6 bg-light-component rounded-lg shadow-lg hover:bg-dark-component hover:scale-105 transition-transform duration-300">
                                <h3 className="font-bold text-white text-2xl mb-4">Effortless Extraction, Instant Download</h3>
                                <p className="text-lg">
                                    Once you've selected the desired pages, our powerful PDF Generator takes over. With a single click, a new PDF containing only the chosen pages is generated. We then provide you with a convenient download link, allowing you to instantly access and utilize the extracted content.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Tools Section */}
                <section className="py-12">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl text-gray-800 font-semibold mb-4 text-center py-12">Our Tools</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {tools.map(tool => (
                                <div key={tool.id} className="bg-light-component p-6 rounded-lg shadow-lg text-center hover:mouse-pointer hover:bg-dark-component transition-colors duration-300">
                                    <h3 className="text-lg font-semibold mb-2">{tool.name}</h3>
                                    <p className="text-gray-300">Description or feature</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Mobile App Banner Section */}
                <section className="relative py-12" style={{zIndex: 2}}>
                    <div className="relative">
                        <img 
                        src="/path/to/your/image.jpg" 
                        alt="Mobile App" 
                        className="absolute inset-0 w-full h-full object-cover opacity-50"
                        />
                        <div className="relative z-10 bg-light-component bg-opacity-60 p-12 rounded-lg text-center flex flex-col items-center justify-center">
                        <h2 className="text-3xl font-bold text-white mb-4">Download the Mobile App for a Smooth Experience</h2>
                        <p className="text-xl text-white mb-8">Enjoy the convenience of managing your PDFs on the go with our mobile app.</p>
                        <Link href="/download">
                            <button className="bg-light-component text-white py-3 px-6 rounded-md transition-colors duration-300 hover:bg-dark-component">
                            Download Now
                            </button>
                        </Link>
                        </div>
                    </div>
                </section>



                {/* Reviews Section */}
                <section className="py-12">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl text-gray-800 font-semibold mb-16 text-center">Reviews from Our Customers</h2>
                        <Slider {...settings}>
                            {reviews.map((review, index) => (
                                <div key={index} className="px-4">
                                    <div className="bg-light-component p-20 rounded-lg shadow-lg text-center">
                                        <p className="text-lg">{review.comment}</p>
                                        <p className="text-white mt-10">- {review.name}</p>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    </div>
                </section>

                {/* FAQs Section */}
                <section className="py-12 text-gray-800">
                    <div className="container mx-auto px-4 flex flex-col items-center justify-center">
                        <h2 className="text-2xl font-semibold mb-4 text-center py-12">Frequently Asked Questions</h2>
                        <div className="w-full md:w-3/4 lg:w-1/2 pb-4 space-y-4">
                            {faqs.map((faq, index) => (
                                <div key={index} className="border-b pb-4">
                                    <div className="flex items-center justify-between">
                                        <button
                                            className="flex items-center font-semibold text-left w-full py-2 focus:outline-none hover:text-blue-600 transition-colors duration-300"
                                            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                                        >
                                            {faq.question}
                                            {expandedIndex === index ? <HiOutlineChevronUp className="ml-2" /> : <HiOutlineChevronDown className="ml-2" />}
                                        </button>
                                    </div>
                                    <div className={`overflow-hidden transition-max-height duration-300 ${expandedIndex === index ? 'max-h-40' : 'max-h-0'}`}>
                                        <p className="text-gray-700">{faq.answer}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

            </div>
        </>
    )
}

export default Home;
