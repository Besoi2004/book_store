import React from 'react'
import Banner from './Banner'
import FlashSale from './FlashSale'
import Recommended from './Recommended'
import RewardsBanner from './RewardsBanner'
import ContactBanner from './ContactBanner'
import Footer from '../../components/Footer'

const Home = () => {
    return (
        <>
            <Banner />
            <FlashSale />
            <Recommended />
            <RewardsBanner />
            <ContactBanner />
            
        </>
    )
}

export default Home