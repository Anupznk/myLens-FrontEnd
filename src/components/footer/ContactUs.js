import React from 'react'
import {Divider, Grid} from "@mui/material";
import Header from "../home/Header";
import CallIcon from '@mui/icons-material/Call';
import EmailIcon from '@mui/icons-material/Email';

import "../../assets/css/footerPages.css"
import Footer from "../home/Footer";
import {SpaceBar} from "@mui/icons-material";
import {navBgDefault} from "../../App";

const ContactUs = props => {
    return (
        <div>
            <Header bg={navBgDefault}/>
            <Grid container>

                <Grid item xs={1} md={2}>

                </Grid>

                <Grid item xs={10} md={8}>

                    <br/>
                    <br/>
                    <div className="title">
                        <h2>Contact Us</h2>
                    </div>
                    <Divider/>

                    <br/>

                    <p>
                        114, Motijheel C/A, Level - 18, Dhaka - 1000
                    </p>

                    <br/>
                    {/*<p className="container">*/}
                    {/*    <CallIcon className="icon"/>*/}
                    {/*    <div className="mobile"> &nbsp;&nbsp;<a href="tel:01777706719">01777706719</a></div>*/}
                    {/*</p>*/}


                    <p className="container">
                        <EmailIcon className="icon"/> &nbsp;&nbsp; <a href="mailto:info@mylens.com.bd">info@mylens.com.bd</a>
                    </p>

                </Grid>


                <Grid item xs={1} md={2}>

                </Grid>


            </Grid>


            <Footer page={"contact-us"}/>

        </div>
    )
}

export default ContactUs
