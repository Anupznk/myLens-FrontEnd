import React, {useEffect, useState} from 'react'
import {Grid} from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import {grey} from "@mui/material/colors";
import {removeCartItem} from "../../actions/cart";
import {useDispatch, useSelector} from "react-redux";
import {lensOptions} from "../../index";
import {MERCHANT_CODE, setCurrentMerchant} from "../../App";

const SingleCartItem=props=>{
    //console.log('cart items', props.cartItem)

    const cartItems=useSelector(state=>state.cart)
    const dispatch=useDispatch()

    return(
        <div>
            <Grid container padding={2} >

                <Grid item xs={4} md={4}>
                    <img
                        style={{
                            borderRadius: 8,

                        }}height={60} src={props.cartItem.imgURL} alt={props.cartItem.title}/>
                </Grid>

                <Grid item xs={5} md={5}>
                    {props.cartItem.title} {
                        props.cartItem.has_lens?(
                            <span><br/>{Object.keys(lensOptions)[props.cartItem.power_type]}
                                  <br/>{Object.keys(lensOptions[Object.keys(lensOptions)[props.cartItem.power_type]])[props.cartItem.power_option].split('(')[0]}
                                  <br/>{Object.keys(lensOptions[Object.keys(lensOptions)[props.cartItem.power_type]][Object.keys(lensOptions[Object.keys(lensOptions)[props.cartItem.power_type]])[props.cartItem.power_option]])[props.cartItem.price_type].split('+')[0]}
                            </span>
                        ):(
                            <div/>
                        )
                }
                </Grid>

                <Grid marginLeft={1} item xs={2} md={2}>
                    <CancelIcon style={{cursor:'pointer'}} onClick={()=>{
                        //console.log('cartLen', cartItems.length)
                        if (cartItems.length === 1)
                            setCurrentMerchant(MERCHANT_CODE.NONE)
                        removeCartItem(props.cartItem.id,cartItems,dispatch)
                    }
                    }/>
                </Grid>

                <Grid item xs={4} md={4}>
                </Grid>

                <Grid item xs={5} md={5}>
                    {props.cartItem.quantity} X {props.cartItem.price}
                </Grid>

                <Grid item xs={12} md={12}>
                    <hr color="#E5E5E5"/>
                </Grid>

            </Grid>
        </div>
    )
}

export default SingleCartItem
