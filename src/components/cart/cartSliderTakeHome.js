import React, {useEffect, useState} from 'react'
import {Button, Grid, SwipeableDrawer, Typography} from "@mui/material";
import '../../assets/css/products.css'
import SingleCartItem from "./singleCartItem";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import '../../assets/css/trialHomeSlider.css'
import SingleHomeCartItem from "./singleHomeCartItem";
import trialHomeVisual from '../../assets/images/production/trial_home_visual.svg'

const CartSliderTakeHome=props=>{

    var navigate=useNavigate()


    const cartItems=useSelector(state=>state.homeCart)
    const dispatch=useDispatch()

    const [isDrawerOpen, setIsDrawerOpen] = props.drawerState



    return(
        <div className={'slider-container'}>
            <SwipeableDrawer
                anchor='right'
                sx={{
                
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 300 },
                }}
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}>

                <div className={'trial-slider'}>
                    <br/>
                    <center>
                    <img width='250' src={trialHomeVisual} alt='trial home'/>
                    <br/>
                   
                        <Typography fontFamily={'poppins'} sx={{marginBottom:'-3px', marginTop:'.5em'}} variant="h5" component="div">
                            Trial Home Items
                        </Typography>
                        <hr width="50px"/>

                        <Typography fontFamily={'poppins'} sx={{ fontSize: '.8em'}} >
                            {cartItems.length < 12 ?
                                `You can add  ${12 - cartItems.length} more items` : 'Cannot add any more items'
                            }
                        </Typography>
                       
                        <Typography fontFamily={'poppins'} sx={{marginBottom:'-10px', fontSize: '1em',padding:'16px'}} >
                            No need to buy in case of Trial. Just Trial fee of 90 BDT
                        </Typography>

                    </center>


                    {cartItems.length === 0? <center><div>No items in your cart <br/></div> </center> :
                        cartItems?.map((singleCartItem, index) => (
                            <SingleHomeCartItem cartItem={singleCartItem} serial={index} />
                        ))}



                    {
                        cartItems.length>0?(
                            <Grid paddingLeft={4} paddingRight={4} item xs={12} md={12}>
                                <button className={'filledBtn'} onClick={()=>{navigate('/take-home')}}>
                                    Take Home
                                </button>
                            </Grid>
                        ):(
                            <div/>
                        )
                    }



                    <Grid paddingTop={2} paddingLeft={4} paddingRight={4} item xs={12} md={12}>
                        <button onClick={()=> {
                            setIsDrawerOpen(false)
                        }} className={'outlinedBtn'}>
                            Continue Shopping
                        </button>
                    </Grid>
                    <br/><br/>
                </div>

            </SwipeableDrawer>
        </div>
    )
}

export default CartSliderTakeHome
