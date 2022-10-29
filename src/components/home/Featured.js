import React, {useEffect, useState} from "react";
import '../../assets/css/featured.css'
import {Grid, Paper} from "@mui/material";
import axios from "axios";
import {base_url} from "../../index";
import {showToast} from "../../App";
import SingleProduct from "../products/SingleProduct";
import CartSlider from "../cart/cartSlider";
import CartSliderTakeHome from "../cart/cartSliderTakeHome";

const Featured=props=>{

    const [isCartDrawerOpen, setIsCartDrawerOpen] = React.useState(false);

    const [cartItemList, setCartItemList] = React.useState([]);
    const [homeCartItemList, setHomeCartItemList] = React.useState([]);

    const [isHomeCartDrawerOpen, setIsHomeCartDrawerOpen] = React.useState(false);


    const [products, setProducts] = useState({
        message: "",
        data: []
    });

    function getFilteredData() {
        axios.get(base_url + "/product/featured/get").then((res) => {
            //console.log(res.data.data)
            setProducts(res.data.data)
        }).catch((err) => {
            //console.log(err)
        })
    }

    useEffect(() => {
        getFilteredData()
    }, [])


    return(
        <div className={'featured-container'}>
            <CartSlider drawerState={[isCartDrawerOpen, setIsCartDrawerOpen]}/>
            <CartSliderTakeHome cartItems={homeCartItemList}
                                drawerState={[isHomeCartDrawerOpen, setIsHomeCartDrawerOpen]}/>

            <div className={'featured-pre-title'}>
                Take A Look
            </div>
            <div className={'featured-title'}>
                Featured Collection
            </div>
            <Grid container>
                {products.data && products.data.map((singleProd) => (

                    <Grid item xs={6} md={4}>
                        <SingleProduct openSlider={setIsCartDrawerOpen} openHomeSlider={setIsHomeCartDrawerOpen} product={singleProd}
                                       cartItemState={[cartItemList, setCartItemList]}
                                       homeCartItemState={[homeCartItemList, setHomeCartItemList]}
                                       drawerState={[isHomeCartDrawerOpen, setIsHomeCartDrawerOpen]}/>

                    </Grid>
                ))}
            </Grid>
        </div>
    )
}

export default Featured
