import React from 'react'
import {Divider, Grid} from "@mui/material";
import Header from "../home/Header";
import Footer from "../home/Footer";
import {navBgDefault} from "../../App";

const PrivacyPolicy=props=>{
    return(
        <div>
            <Header bg={navBgDefault}/>
            <Grid container>

                <Grid item xs={1} md={2}>

                </Grid>

                <Grid item xs={10} md={8}>

                    <br/>
                    <br/><br/>
                    <div className="title">
                        <h2>Privacy Policy</h2>
                    </div>
                    <Divider/>

                    <p>mylens.com.bd understands that your privacy is important to you and that you care about how your personal data is used. We respect and value the privacy of all of our customers/consumers and will only collect and use personal data in ways that are described here, and in a way that is consistent with our obligations and your rights under the law. This Customer Privacy Policy explains how mylens.com.bd (including our employees) will use any personal information that we collect from you as part of the processing of orders with mylens.com.bd and the Cookie Policy we maintain. Please ensure you have read this Customer Privacy Policy carefully, in particular the section detailing your rights as a data subject in relation to the personal information that we collect about you.<br />
                        <br />
                        <strong>1. Who we are</strong><br />
                        <br />
                        mylens.com.bd (&lsquo;we or &lsquo;us) are a data controller for the purposes of the Digital Security Act, 2018 ,(i.e. we are responsible for, and control the processing of, your personal information).<br />
                        <br />
                        <strong>2. What information we collect about you (as a &ldquo;User&rdquo;)</strong></p>

                    <p>We do not collect any personal information about you on our Website unless you choose to provide it to us voluntarily.<br />
                        Personal information we collect from you and how we collect it:</p>

                    <ul>
                        <li>Name</li>
                        <li>Addresses</li>
                        <li>Phone numbers</li>
                        <li>Email addresses</li>
                    </ul>

                    <p><br />
                        We collect this personal information when you:</p>

                    <ul>
                        <li>Place an order on our website</li>
                        <li>E-mail us for any query or complain</li>
                        <li>Place any order with us via our social media channel: i.e.: facebook page/Instagram direct message or from the comment section</li>
                    </ul>

                    <p><br />
                        <strong>3. How we will use the information about you</strong><br />
                        <br />
                        We use your personal information in a number of different ways:</p>

                    <ul>
                        <li>For administration and management purposes</li>
                        <li>For the purpose of facilitating the supply of goods</li>
                        <li>To deal with customer complaints or queries</li>
                        <li>To reach the relevant customers via advertisement</li>
                    </ul>

                    <p><strong>4. Protection: </strong><br />
                        We ensure the followings security measure to protect your data</p>

                    <ul>
                        <li>We use Secure Socket Layer software (SSL) to encrypt all of your personal information including your name and address. This technology prevents you from inadvertently revealing personal information using an insecure connection.</li>
                        <li>We will only pass on your personal information to third parties if it is an essential part of our transaction with you (i.e. passing on your name and address to our carriers, or telephone number should there be a query with delivery, or using a third-party payment processor to process your payment for your purchase on our Website).</li>
                        <li>Unless required to do so by law, we will not otherwise share, sell or distribute any of the personal information you provide to us without your consent.<br />
                            All your Payment also go through an extremely secured payment gateway provided by &ldquo;SSL Commerz&rdquo;, the most prominent online payment security provider of Bangladesh.</li>
                    </ul>

                    <p><strong>5. How long we will store your information</strong><br />
                        <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; We&rsquo;ll hold on to your information unless you specifically request that we remove it. This allows us address any warranty issues.<br />
                        <br />
                        <strong>6. Your rights over your information</strong><br />
                        <br />
                        Data subjects have many rights over their personal information and how it is used. The following rights are available to data subjects (depending on how we collect their personal data):</p>

                    <ul>
                        <li>Right to be informed about what we do with personal data</li>
                        <li>Right to access personal data</li>
                        <li>Right to correct personal data</li>
                        <li>Right to object to, or restrict, the use of personal data (in some circumstances)</li>
                        <li>Right to delete personal data</li>
                        <li>Right to stop direct marketing messages</li>
                        <li>Right to portability of personal data</li>
                    </ul>

                    <p><br />
                        To the extent you, as a data subject, wish to exercise any of these rights, please write to us at info@mylens.com.bd<br />
                        <br />
                        <strong>Consent</strong><br />
                        Where mylens.com.bd is using your personal information based on your express consent to this, you have the right to withdraw your consent at any time.<br />
                        To withdraw your consent please write to <a href="mailto:info@mylens.com.bd">info@mylens.com.bd</a><br />
                        <br />
                        <strong>Complain to the Regulator</strong><br />
                        You have the right to lodge a complaint with your relevant regulatory authority. In Bangladesh, this is the Cyber Security Unit. You can make complaint via e-mail here: contact@csirt.gov.bd.<br />
                        &nbsp;</p>

                    <p><strong>7. Marketing</strong><br />
                        <br />
                        If you have given us your contact details, we may use these (in accordance with any preferences you have expressed) to send you marketing messages by post or email to detail offers or events which we think may be of interest. As part of our relationship mylens.com.bd considers that it has a legitimate interest to send you these messages unless you have asked for us not to do this.<br />
                        <br />
                        You can stop receiving marketing messages from us at any time. You can do this by writing to us at <a href="mailto:info@mylens.com.bd">info@mylens.com.bd</a> or, unsubscribing on the link at the bottom of all emails.<br />
                        <br />
                        <strong>8. Changes to our Customer Privacy Policy</strong><br />
                        We may change this Privacy Policy from time to time, to reflect how we are processing your personal information. If we make significant changes, we will make that clear on the mylens.com.bd website.</p>

                    <p>&nbsp;</p>

                    <p><strong>9. How to contact us</strong><br />
                        <br />
                        Please feel free to contact us if you have any questions about our Customer Privacy Policy or the personal data we hold about you.<br />
                        <br />
                        You can contact us by email: <a href="mailto:info@mylens.com.bd">info@mylens.com.bd</a><br />
                        You can directly call us: <a href="tel:01777706719">01777706719</a></p>

                    <p>&nbsp;</p>

                </Grid>


                <Grid item xs={1} md={2}>

                </Grid>

            </Grid>


            
        </div>
    )
}

export default PrivacyPolicy
