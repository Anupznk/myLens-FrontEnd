import React, {useEffect, useRef, useState} from 'react'
import '../../assets/css/footer.css'
import {Grid} from "@mui/material";
import {useNavigate} from "react-router-dom";
import payment_footer from "../../assets/images/production/SSLCommerz-footer-logo.png"

const Footer = ({page,updateHeight}) => {

    const ref = useRef(null)

    useEffect(() => {
        updateHeight(ref.current.innerHeight)
    })


    const pageClass = page || '';

    const navigate = useNavigate()
    return (
        <div ref={ref} className="footer-wrapper">
            <div className={`footer ${pageClass}`}>

                <center style={{width: '100%'}}>
                    <div className="menu-container">

                        <div className="footer-link" onClick={() => {
                            navigate('/contact-us')
                        }}>Contact Us
                        </div>

                        <div className="footer-link" onClick={() => {
                            navigate('/about-us')
                        }}>About Us
                        </div>

                        <div className="footer-link" onClick={() => {
                            navigate('/privacy-policy')
                        }}>Privacy Policy
                        </div>
                        <div className="footer-link" onClick={() => {
                            navigate('/terms-and-conditions')
                        }}>Terms and Conditions
                        </div>
                        <div className="footer-link" onClick={() => {
                            navigate('/return-and-refund')
                        }}>Return and Refund Policy
                        </div>


                        <br/>
                    </div>

                </center>

                <center>
                <img src={payment_footer} className="payment-footer-img" alt='SSLCommerz-Image'/>

                </center>
                <br/>
                <center style={{width: '100%'}}>
                    <div className="footer-copyright">Copyright 2022 &copy; mylens.com.bd</div>
                </center>

                <br/>

            </div>
        </div>
    )
}

export default Footer
