
import React from 'react';
import Header from '../components/header';
import Footers from '../components/footers';
import SlideOne from '../components/landing/slideOne';
import SlideTwo from '../components/landing/slideTwo';
import SlideThree from '../components/landing/slideThree';
// import SlideFour from '../components/landing/slideFour';
import SlideFive from '../components/landing/slideFive';
import SlideSix from '../components/landing/slideSix';
// import { serverURL } from '../constants';
// import axios from 'axios';

const Landing = () => {

    

    return (
        <>
            <Header isHome={false} />
            <SlideOne />
            <SlideTwo />
            <SlideThree />
            
            <SlideFive />
            <SlideSix />
            <Footers />
        </>
    );
};

export default Landing;