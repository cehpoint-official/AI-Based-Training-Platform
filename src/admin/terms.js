import { Navbar } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import AdminSidebar from './components/adminsidebar';
import AdminHead from './components/adminhead';
import AdminSidebarMobile from './components/adminsidebarmobile';
import TermsEdit from './components/termsedit';

const Terms = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        sessionStorage.setItem('darkMode', 'false');
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };

    return (
        <div>
            <div className="flex bg-white dark:bg-black md:hidden pb-10 overflow-y-auto">
                <div className={`fixed inset-0 bg-black opacity-50 z-50 ${isSidebarOpen ? 'block' : 'hidden'}`} onClick={toggleSidebar}></div>
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div>
                        <Navbar fluid className='py-3 dark:bg-black bg-white border-black dark:text-white dark:border-white md:border-b'>
                            <Navbar.Brand className='ml-1'>
                                <p className='font-black text-xl'>Admin Panel</p>
                            </Navbar.Brand>
                            <div className='flex md:hidden justify-center items-center'>
                                {isSidebarOpen ? (
                                    <FiX
                                        onClick={toggleSidebar}
                                        className='mx-2'
                                        size={20}
                                        color={sessionStorage.getItem('darkMode') === 'true' ? 'white' : 'black'}
                                        aria-label="Close sidebar"
                                    />
                                ) : (
                                    <FiMenu
                                        onClick={toggleSidebar}
                                        className='mx-2'
                                        size={20}
                                        color={sessionStorage.getItem('darkMode') === 'true' ? 'white' : 'black'}
                                        aria-label="Open sidebar"
                                    />
                                )}
                            </div>
                        </Navbar>
                        <TermsEdit />
                    </div>
                    <AdminSidebarMobile isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                </div>
            </div>
            <div className='flex flex-row overflow-y-auto h-screen max-md:hidden no-scrollbar'>
                <AdminSidebar />
                <div className='overflow-y-auto flex-grow flex-col dark:bg-black'>
                    <AdminHead />
                    <TermsEdit />
                </div>
            </div>
        </div>
    );
};

export default Terms;
