"use client";

import "tailwindcss/tailwind.css";
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Head from "next/head";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import About from "@/components/about";
import CustomNavbar from "@/components/CustomNavbar";
import Link from 'next/link';
import { HiOutlineChevronDown, HiOutlineChevronUp } from 'react-icons/hi';


const Home = () => {
    const router = useRouter();

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
                <title>PDF Generator</title>
            </Head>
            <div className="bg-white min-h-screen">
                <header className="bg-white text-black py-20">
                    {/* Welcome Section */}
                    {/* <CustomNavbar/> */}
                    <div className="container mx-auto px-4 text-center">
                        <div className=" mx-auto">
                            <h1 className="text-6xl font-bold text-gray-800 mb-8">PDForge</h1>
                            <p className="text-xl text-gray-600 mb-8">Unlock the full potential of your documents with our comprehensive PDF toolkit.</p>
                            <Link href="/">
                                <button
                                    className="bg-gray-500 hover:bg-blue-900 text-white mt-5 py-3 px-40 rounded-md transition-colors duration-300"
                                >
                                    Go to PDF Editor - it's absolutely free!
                                </button>
                            </Link>
                        </div>
                    </div>
                </header>

                <section className="bg-white py-12">
                    <div className="container mx-auto px-4">
                        <About/>
                    </div>
                </section>

                {/* Tools Section */}
                <section className="bg-gray-100 py-12">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl font-semibold mb-4 text-center">Our Tools</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {tools.map(tool => (
                                <div key={tool.id} className="bg-white p-6 rounded-lg shadow-lg text-center hover:bg-blue-100 transition-colors duration-300">
                                    <h3 className="text-lg font-semibold mb-2">{tool.name}</h3>
                                    <p className="text-gray-600">Description or feature</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>


                {/* Reviews Section */}
                <section className="bg-white py-40">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl font-semibold mb-16 text-center">Reviews from Our Customers</h2>
                        <Slider {...settings}>
                            {reviews.map((review, index) => (
                                <div key={index} className="px-4">
                                    <div className="bg-gray-200 p-20 rounded-lg shadow-lg text-center">
                                        <p className="text-lg">{review.comment}</p>
                                        <p className="text-gray-600 mt-10">- {review.name}</p>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    </div>
                </section>

                {/* FAQs Section */}
                <section className="bg-white py-12">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
                        <div className="space-y-4">
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

                {/* Footer Section */}
                <footer className="mt-auto py-8">
                    <div className="max-w-3xl mx-auto text-sm text-gray-500">
                        <p className="mb-2 font-bold text-center">JustOurGigs ©</p>
                        <div className="flex space-x-4">
                        <Link href={"/about"} className="cursor-pointer hover:text-gray-700">About Us</Link>
                        <Link href={"/about"} className="cursor-pointer hover:text-gray-700">Privacy Policy</Link>
                        <Link href={"/about"} className="cursor-pointer hover:text-gray-700">Terms of Service</Link>
                        <Link href={"/contact"} className="cursor-pointer hover:text-gray-700">Contact Us</Link>
                        </div>
                    </div>
                </footer>

            </div>
        </>
    )
}

export default Home;
