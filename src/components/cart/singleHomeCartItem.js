import React from 'react'
import {Grid} from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import {useDispatch, useSelector} from "react-redux";
import {removeHomeCartItem} from "../../actions/homeCart";
import '../../assets/css/cartSlider.css'

const SingleHomeCartItem = props => {

    const cartItems = useSelector(state => state.homeCart)
    const dispatch = useDispatch()

    return (
        <div>
            <Grid className={'cart-item-wrapper'} container padding={2}>


                    <Grid item xs={4} md={4}>
                        <img
                            style={{
                                borderRadius: 8,

                            }} height={60} src={props.cartItem.imgURL} alt={props.cartItem.title}/>
                    </Grid>

                    <Grid  item xs={6} md={6}>
                        <b>{props.serial + 1}.&nbsp;</b> {props.cartItem.title}
                    </Grid>

                    <Grid marginLeft={1} item xs={1} md={1}>
                        <CancelIcon style={{cursor: 'pointer'}} onClick={() => {
                            removeHomeCartItem(props.cartItem.id, cartItems, dispatch)
                        }}/>
                    </Grid>


                <Grid item xs={12} md={12}>
                    <hr color="#E5E5E5"/>
                </Grid>

            </Grid>
        </div>
    )
}

export default SingleHomeCartItem
