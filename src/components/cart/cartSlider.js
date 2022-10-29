import React, {useEffect, useState} from 'react'
import {Button, Grid, SwipeableDrawer, Typography} from "@mui/material";
import '../../assets/css/products.css'
import SingleCartItem from "./singleCartItem";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import '../../assets/css/slider.css'
import cartVisual from '../../assets/images/production/Shopping_Cart.svg'

const CartSlider=props=>{

    var navigate=useNavigate()


    const cartItems=useSelector(state=>state.cart)
    const dispatch=useDispatch()

    const [isDrawerOpen, setIsDrawerOpen] = props.drawerState

    const [subtotal,setSubtotal]=useState(0)

    const updateSubtotal=()=>{
        var total=0;
        cartItems.map(i=>{
            total+=i.quantity*i.price
        })
        setSubtotal(total)
    }

    useEffect(()=>{
        updateSubtotal()
    },[cartItems])

    return(
        <div className={'slider-container'}>
            <SwipeableDrawer
                sx={{

                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 300 },
                }}
                anchor='right'
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}>

              
                <center>
                <img width='250' src={cartVisual} alt='cart'/>
             
                
                    <Typography sx={{marginBottom:'-10px'}} variant="h5" component="div">
                        Cart Items
                    </Typography>
                    <hr width="50px"/>
                </center>


                <br/>
                {cartItems.length === 0? <center><div>No items in your cart <br/></div> </center> :
                    cartItems?.map((singleCartItem) => (
                        <SingleCartItem cartItem={singleCartItem} />
                    ))}


                <Grid paddingLeft={4} paddingRight={4} item xs={12} md={12}>
                    <center>
                        Total: ৳ {subtotal}
                    </center>
                </Grid>
                <br/>

                {
                    cartItems.length>0?(
                        <Grid paddingLeft={4} paddingRight={4} item xs={12} md={12}>
                            <button className={'filledBtn'} onClick={()=>{navigate('/cart')}}>
                                Checkout
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

            </SwipeableDrawer>
        </div>
    )
}

export default CartSlider
