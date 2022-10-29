import React, {useState} from 'react'
import Header from "./Header";
import Hero from "./Hero";
import Partners from "./Partners";
import ShopWithUs from "./ShopWithUs";
import Featured from "./Featured";
import {Router} from "react-router-dom";
import Footer from "./Footer";
import {navBgDefault} from "../../App";

const Home=props=>{

    const [barColor,setBarColor]=useState(false)

    const changeNavbarColor = () =>{
        if(window.scrollY >= 80){
            setBarColor(true)
        }
        else{
            setBarColor(false)
        }
    };
    window.addEventListener('scroll', changeNavbarColor);

    return(
        <div>
            {
                barColor?(
                    <Header bg={navBgDefault}/>
                ):(
                    <Header home bg={'#29334012'} navIconColor={'#2c3e42'}/>
                )
            }

            <Hero/>
            <Partners/>
            <ShopWithUs/>
            <Featured/>

            
        </div>
    )
}

export default Home
