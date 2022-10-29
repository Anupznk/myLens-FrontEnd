import React from 'react'
import {Divider, Grid} from "@mui/material";
import Header from "../home/Header";
import Footer from "../home/Footer";
import {navBgDefault} from "../../App";

const AboutUs=props=>{
    return(
        <div className="wrapper">
            <Header bg={navBgDefault}/>
            <Grid container>

                <Grid item xs={1} md={2}>

                </Grid>

                <Grid item xs={10} md={8}>

                    <br/>
                    <br/><br/>
                    <div className="title">
                        <h2>About Us</h2>
                    </div>
                    <Divider/>

                    <br/>



                    <p>
                        Here at MyLens, we are promised to deliver the most high-end customer satisfaction service by selling them “high-quality + low cost” eyeglassses, sunglasses and lens....
                        For most formal to the most sporty events, for the most stylish to the most nerdy one, we’ve got something for you! We’re importing the most trendy latest collection from the most reliable sources, photograph them by our own hand and make it ready for you!
                    </p>

                    <p>
                        <b>Our founding members are:</b>
                        <ul>
                            <li>Iftekhar Rafsan (Also known as Rafsan the ChotoBhai)</li>
                            <li>Jamilus Sheium</li>
                            <li>Ariful Haque</li>
                        </ul>
                    </p>

                    <p>
                        You can find us https://www.mylens.com.bd

                    </p>

                    <p>
                        Follow us on Instagram <a href="https://www.instagram.com/mylensbd/"> @mylensbd </a>
                    </p>



                    <p>
                        <b>Head Office:</b>
                    </p>

                    <p>
                        114, Motijheel C/A, Level - 18, Dhaka - 1000<br/>
                        Cell: <a href="tel:01777706719">01777706719</a>
                    </p>

                    <p>
                        <b>Our Trade License Number: TRAD/DSCC/041896/2021</b>
                    </p>


                    <br/>

                </Grid>


                <Grid item xs={1} md={2}>

                </Grid>

            </Grid>


            
        </div>
    )
}

export default AboutUs
