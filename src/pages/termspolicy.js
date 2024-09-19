import React, { useEffect, useState } from 'react';
import Header from '../components/header';
import Footers from '../components/footers';
import { serverURL } from '../constants';
import axios from 'axios';
import StyledText from '../components/styledText';

const TermsPolicy = () => {
    const [data, setData] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
<<<<<<< HEAD
            try {
                const storedTerms = sessionStorage.getItem('TermsPolicy');
                if (storedTerms) {
                    setData(storedTerms);
                } else {
                    const postURL = `${serverURL}/api/policies`;
                    const response = await axios.get(postURL);
                    setData(response.data[0].terms);
                    sessionStorage.setItem('TermsPolicy', response.data[0].terms);
                }
            } catch (err) {
                setError('Failed to fetch data');
                console.error(err);
=======
            const postURL = `${serverURL}/api/policies`;
            try {
                const response = await axios.get(postURL);
                if (response.data && response.data.length > 0) {
                    const terms = response.data[0].terms || 'No terms available';
                    setData(terms);
                    sessionStorage.setItem('TermsPolicy', terms); // Store in sessionStorage
                } else {
                    throw new Error('No terms data found');
                }
            } catch (err) {
                setError('Failed to load terms policy. Please try again later.');
>>>>>>> 83e24824f3b5dc19c87497d7e69d79ef4f795a59
            } finally {
                setLoading(false);
            }
        };

<<<<<<< HEAD
        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className='h-screen flex flex-col'>
            <Header isHome={false} className="sticky top-0 z-50" />
            <div className='dark:bg-black flex-1'>
                <div className='flex-1 flex items-center justify-center py-10 flex-col'>
                    <p className='text-center font-black text-4xl text-black dark:text-white'>Terms</p>
                    <div className='w-4/5 py-20'><StyledText text={data} /></div>
                </div>
            </div>
            <Footers className="sticky bottom-0 z-50" />
        </div>
    );
};

=======
        if (sessionStorage.getItem('TermsPolicy')) {
            setData(sessionStorage.getItem('TermsPolicy'));
            setLoading(false); // No need to load if already in sessionStorage
        } else {
            fetchData();
        }
    }, []);

    return (
        <div className='h-screen flex flex-col'>
            <Header isHome={false} className="sticky top-0 z-50" />
            <div className='dark:bg-black flex-1'>
                <div className='flex-1 flex items-center justify-center py-10 flex-col'>
                    <p className='text-center font-black text-4xl text-black dark:text-white'>Terms</p>
                    {loading ? (
                        <p className='text-center text-gray-500 dark:text-gray-400'>Loading...</p>
                    ) : error ? (
                        <p className='text-center text-red-500'>{error}</p>
                    ) : (
                        <div className='w-4/5 py-20'>
                            <StyledText text={data} />
                        </div>
                    )}
                </div>
            </div>
            <Footers className="sticky bottom-0 z-50" />
        </div>
    );
};

>>>>>>> 83e24824f3b5dc19c87497d7e69d79ef4f795a59
export default TermsPolicy;
