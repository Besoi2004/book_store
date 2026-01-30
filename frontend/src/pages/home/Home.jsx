import React from 'react'
import Banner from './Banner'
import TopSellers from './TopSellers'
import Recommended from './Recommended'
import News from './News'
import Footer from '../../components/Footer'

const Home = () => {
    return (
        <>
            <Banner />
            <TopSellers />
            <Recommended />
            <News/>
            
        </>
    )
}

export default Home