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
            } finally {
                setLoading(false);
            }
        };

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

export default TermsPolicy;
