/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useState } from 'react';
import Header from '../components/header';
import Footers from '../components/footers';
import { Button, Label } from 'flowbite-react';
import { AiOutlineLoading } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { serverURL } from '../constants';
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

const Profile = () => {

    const [mName, setName] = useState(sessionStorage.getItem('mName'));
    const [email, setEmail] = useState(sessionStorage.getItem('email'));
    const [password, setPassword] = useState('');
    const [processing, setProcessing] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [showApiKeyForm, setShowApiKeyForm] = useState(false);
    const [apiKey, setApiKey] = useState('');

    // const navigate = useNavigate();
    // function redirectSubscription() {
    //     navigate("/subscription");
    // }

    const showToast = async (msg) => {
        setProcessing(false);
        toast(msg, {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
        });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!email || !mName) {
            showToast('Please fill in all required fields');
            return;
        }
        setProcessing(true);
        const uid = sessionStorage.getItem('uid');
        const postURL = serverURL + '/api/profile';
        try {
            const response = await axios.post(postURL, { email, mName, password, uid });
            if (response.data.success) {
                showToast(response.data.message);
                sessionStorage.setItem('email', email);
                sessionStorage.setItem('mName', mName);
                setProcessing(false)
                setPassword('');
            } else {
                showToast(response.data.message);
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                showToast('Resource not found. Please check the URL.');
            } 
            
            else {
                console.error('Error:', error.response || error.message); 
                showToast('Internal Server Error');
            }
        }
    }

    const handleSubmitApiKey = async (event) => {
        event.preventDefault();
        if (!apiKey) {
            showToast('Please enter the Gemini API key');
            return;
        }
        setProcessing(true);
        const uid = sessionStorage.getItem('uid');
        const postURL = `${serverURL}/api/profile`; 
        try {
            const response = await axios.post(postURL, { email, mName, apiKey, uid });
            if (response.data.success) {
                showToast(response.data.message);
                setProcessing(false);
                setApiKey(''); 
            } else {
                showToast(response.data.message);
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                showToast('Resource not found. Please check the URL.');
            } 
            
            else {
                console.error('Error:', error.response || error.message); // Log detailed error
                showToast('Internal Server Error');
            }
        }
    }

    return (
        <div className='h-screen flex flex-col'>
            <Header isHome={true} className="sticky top-0 z-50" />
            <div className='dark:bg-black flex-1'>
                <div className='flex-1 flex items-center justify-center py-10 flex-col'>
                    <div className="md:w-2/5 w-4/5 m-auto py-4 no-scrollbar ">
                        <p className='text-center font-black text-4xl text-black dark:text-white'>Profile</p>
                        
                        <div className='py-6'>
                            <Button onClick={() => { setShowPasswordForm(true); setShowApiKeyForm(false); }} className='mb-4 w-full dark:bg-white dark:text-black bg-black text-white font-bold rounded-none'>Change Password</Button>
                            <Button onClick={() => { setShowPasswordForm(false); setShowApiKeyForm(true); }} className='mb-4 w-full dark:bg-white dark:text-black bg-black text-white font-bold rounded-none'>Add Gemini API Key</Button>
                            
                            {showPasswordForm && (
                                <form onSubmit={handleSubmit} className="mb-6">
                                    <div className='mb-6'>
                                        <div className="mb-2 block">
                                            <Label className="font-bold text-black dark:text-white" htmlFor="password1" value="New Password" />
                                        </div>
                                        <input value={password} onChange={(e) => setPassword(e.target.value)} className='focus:ring-black focus:border-black border border-black font-normal bg-white rounded-none block w-full dark:bg-black dark:border-white dark:text-white' id="password1" type="password" />
                                    </div>
                                    <Button isProcessing={processing} processingSpinner={<AiOutlineLoading className="h-6 w-6 animate-spin" />} className='items-center justify-center text-center dark:bg-white dark:text-black bg-black text-white font-bold rounded-none w-full enabled:hover:bg-black enabled:focus:bg-black enabled:focus:ring-transparent dark:enabled:hover:bg-white dark:enabled:focus:bg-white dark:enabled:focus:ring-transparent ' type="submit">Submit</Button>
                                </form>
                            )}

                            {showApiKeyForm && (
                                <form onSubmit={handleSubmitApiKey}>
                                    <div className='mb-6'>
                                        <div className="mb-2 block">
                                            <Label className="font-bold text-black dark:text-white" htmlFor="apiKey" value="Gemini API Key" />
                                        </div>
                                        <input value={apiKey} onChange={(e) => setApiKey(e.target.value)} className='focus:ring-black focus:border-black border border-black font-normal bg-white rounded-none block w-full dark:bg-black dark:border-white dark:text-white' id="apiKey" type="text" />
                                    </div>
                                    <p className='text-center text-sm text-gray-500 dark:text-gray-400 mb-5'>
                                        To obtain your Gemini API key, log in to your Gemini account, navigate to the API section, and generate a new API key. Copy the key and paste it here. 
                                        For more details on how to obtain your Gemini API key, visit the <a href="https://docs.gemini.com/rest-api/keys/" target="_blank" rel="noopener noreferrer" className='text-blue-500 hover:underline'>Gemini API documentation</a>.
                                    </p>
                                    <Button isProcessing={processing} processingSpinner={<AiOutlineLoading className="h-6 w-6 animate-spin" />} className='items-center justify-center text-center dark:bg-white dark:text-black bg-black text-white font-bold rounded-none w-full enabled:hover:bg-black enabled:focus:bg-black enabled:focus:ring-transparent dark:enabled:hover:bg-white dark:enabled:focus:bg-white dark:enabled:focus:ring-transparent' type="submit">Submit</Button>
                                </form>
                            )}
                        </div>

                    </div>
                </div>
            </div>
            <Footers className="sticky bottom-0 z-50" />
        </div>
    );
};

export default Profile;
