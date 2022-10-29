import React, { useEffect, useState } from "react";
import "./../../assets/css/products.css";
import SingleProduct from "./SingleProduct";
import {
    Box,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";
import Header from "../home/Header";
import CartSlider from "../cart/cartSlider";
import CartSliderTakeHome from "../cart/cartSliderTakeHome";
import axios from "axios";
import Footer from "../home/Footer";
import SkeletonProd from "../../skeletons/skeletonProd";
import { useParams } from "react-router-dom";
import { btnDefault, navBgDefault, showToast } from "../../App";
import { base_url } from "../..";
import { Helmet } from 'react-helmet';
function capitalizeFirstLetter (string) {
    if (string == undefined || string == null)
        return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
}
const ProductsList = (props) => {

    const params = useParams()
    ////////console.log('gender ', params.gender)


    const [isMen, setMen] = useState(null)
    const [hasLens, setHasLens] = useState(null)
    const [lowPrice, setLowPrice] = useState(true)

    var updateParams = () => {
        var gender = params.gender
        var glassType = params.type
        var isMenTemp
        if (gender === "men") {
            isMenTemp = true
        } else if (gender === "women") {
            isMenTemp = false
        } else {
            isMenTemp = null
        }
        setMen(isMenTemp)

        var hasLensTemp
        if (glassType === "eyeglass") {
            hasLensTemp = true
        } else if (glassType === "sunglass") {
            hasLensTemp = false
        } else {
            hasLensTemp = null
        }
        setHasLens(hasLensTemp)
    }

    useEffect(() => {
        updateParams()
        //////console.log(params.gender)
    }, [params.gender, params.type])


    ////////console.log('gender ', isMen)

    const [products, setProducts] = useState({
        message: "",
        data: []
    });

    const [filter, setFilter] = React.useState('');

    const [filtering, setFiltering] = React.useState({
        isForMen: isMen,
        isPriceLow: false,
    });


    var [isLoaded, setLoaded] = useState(false)
    useEffect(() => {
        setLoaded(false)

        const newFilter = {
            isForMen: filtering.isForMen,
            isPriceLow: null
        }
        getFilteredData(newFilter)
    }, []);


    const [isCartDrawerOpen, setIsCartDrawerOpen] = React.useState(false);

    const [cartItemList, setCartItemList] = React.useState([]);
    const [homeCartItemList, setHomeCartItemList] = React.useState([]);

    const [isHomeCartDrawerOpen, setIsHomeCartDrawerOpen] = React.useState(false);


    const handleFilterChange = (event) => {
        setFilter(event.target.value);
        ////////console.log('filter-test', event.target.value)
        if (event.target.value === 1) {
            // price high to low filter
            const newFilter = {
                isForMen: isMen,
                isPriceLow: false,
            }
            setFiltering(newFilter)
            setLowPrice(false)

        } else if (event.target.value === 2) {
            // price low to high filter
            const newFilter = {
                isForMen: isMen,
                isPriceLow: true,
            }
            setLowPrice(true)
            setFiltering(newFilter)

        }
    };


    function getFilteredData () {
        //////console.log('filter', filtering)
        var body = {}
        if (!(isMen === null && lowPrice === null && hasLens === null)) {

            var filter = {}
            if (isMen !== null) filter['is_for_men'] = isMen
            if (lowPrice !== null) filter['is_price_low'] = lowPrice
            if (hasLens !== null) filter['has_lens'] = hasLens

            body = {
                // request body
                filter: filter
            }
        }

        //console.log(body)
        setLoaded(false)
        axios.post(base_url + "/product/get", body).then((res) => {
            // //////console.log('filtered res data ', res.data)
            setProducts(res.data)
            setLoaded(true)
            //////console.log("products", res.data)
        }).catch((err) => {
            if (err !== undefined && err.response !== undefined && err.response.status !== undefined && (err.response.status === 401 || err.response.status === 403)) {
            } else {
                showToast('Connectivity problem')
            }
            ////////console.log(err)
        })
    }

    const [currentPage, setCurrentPage] = useState(1)
    const [prodPerPage, setProdPerPage] = useState(12)

    useEffect(() => {
        setCurrentPage(1)
        getFilteredData()
    }, [filtering])


    const totalPage = Math.ceil(products.data.length / prodPerPage)
    const indexOfLastProd = currentPage * prodPerPage
    // const indexOfFirstProd = indexOfLastProd - prodPerPage
    const indexOfFirstProd = 0
    const currentProds = products.data.slice(indexOfFirstProd, indexOfLastProd)

    function loadMoreProds () {
        if (currentPage < totalPage) {
            setCurrentPage(currentPage + 1)

        }

        //////console.log('curr page ', currentPage)
        //////console.log('total page ', totalPage)

    }

    useEffect(() => {
        setLoaded(false)

        const newFilter = {
            isForMen: isMen,
            isPriceLow: filtering.isPriceLow
        }
        getFilteredData()
    }, [isMen, hasLens]);

    const imageUrl = `${window.location.href}logo_new.svg`
    const pageTitle = `${params?.type == "all" ? "Glasses" : capitalizeFirstLetter(params?.type)} for ${params.gender == "both" ? params?.gender : (params?.gender == "women" ? "her" : "him")} - MyLens`;
    return (
        <div>
            <Helmet>
                <title>{pageTitle}</title>

                <meta name="title" content={pageTitle} />

                <meta property="og:type" content="website" />
                <meta property="og:url" content={window.location.href} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:image" content={imageUrl} />

                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content={window.location.href} />
                <meta property="twitter:title" content={pageTitle} />
                <meta property="twitter:image" content={imageUrl} />
            </Helmet>
            <Header bg={navBgDefault} />
            <CartSlider drawerState={[isCartDrawerOpen, setIsCartDrawerOpen]} />
            <CartSliderTakeHome cartItems={homeCartItemList}
                drawerState={[isHomeCartDrawerOpen, setIsHomeCartDrawerOpen]} />

            <Grid container>

                <Grid item xs={0} md={2}>
                </Grid>


                <Grid item xs={12} md={8}>
                    <Grid container>

                        <Grid item xs={12} md={12}>

                            <center>
                                <br /><br /><br /><br />
                                {isLoaded && products.data.length <= 0 ? <h1>No Products Found</h1> :
                                    <h1 style={{ display: 'flex', justifyContent: 'center' }}>
                                        {
                                            isMen ==  null? (
                                                <div>
                                                    Unisex&nbsp;
                                                </div>
                                            ) : (<div/>)
                                        }
                                        {

                                            hasLens === null ? (
                                                <div>
                                                    Glasses
                                                </div>
                                            ) : (
                                                hasLens ? (
                                                    <div>
                                                        Eyeglasses
                                                    </div>
                                                ) : (
                                                    <div>
                                                        Sunglasses
                                                    </div>
                                                )
                                            )
                                        }
                                        <div style={{ marginLeft: '10px' }} />
                                        {
                                            isMen === null ? (
                                                <div>
                                                   
                                                </div>
                                            ) : (
                                                isMen ? (
                                                    <div>
                                                        for Him
                                                    </div>
                                                ) : (
                                                    <div>
                                                        for Her
                                                    </div>
                                                )
                                            )
                                        }
                                    </h1>
                                }

                                <div className="subtitle-text">High Quality Low Cost 

                                        {

                                            hasLens === null ? (
                                                <div>
                                                    Glasses
                                                </div>
                                            ) : (
                                                hasLens ? (
                                                    <div>
                                                        Eyeglasses
                                                    </div>
                                                ) : (
                                                    <div>
                                                        Sunglasses
                                                    </div>
                                                )
                                            )
                                        }
                                        <div style={{ marginLeft: '0px' }} />
                                        {
                                            isMen === null ? (
                                                <div>
                                                   For Everyone
                                                </div>
                                            ) : (
                                                isMen ? (
                                                    <div>
                                                        For Him
                                                    </div>
                                                ) : (
                                                    <div>
                                                        For Her
                                                    </div>
                                                )
                                            )
                                        }

                                </div>

                            </center>
                        </Grid>

                        <Grid item xs={10} md={10}>

                        </Grid>

                        <Grid item xs={7} md={9}>
                        </Grid>
                        <Grid item xs={5} md={3} padding={1}>

                            <Box sx={{
                                minWidth: 130,
                                boxShadow: "0 0 20px 0 rgb(0 0 0 / 0%)",
                                borderRadius: "1em",
                                marginRight: ".5em"
                            }}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Sort by</InputLabel>
                                    <Select style={{ borderRadius: 10 }}
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={filter}
                                        label="Sort by"
                                        onChange={handleFilterChange}
                                    >
                                        <MenuItem value={1}>Price (High to Low)</MenuItem>
                                        <MenuItem value={2}>Price (Low to High)</MenuItem>

                                    </Select>
                                </FormControl>
                            </Box>

                        </Grid>


                        {!isLoaded && [1, 2, 3, 4, 5, 6].map((n) =>
                            <Grid item xs={6} md={4}>
                                <SkeletonProd key={n} />
                            </Grid>)

                        }


                        {isLoaded && products.data && currentProds.map((singleProd) => (

                            <Grid item xs={6} md={4}>
                                <SingleProduct openSlider={setIsCartDrawerOpen} openHomeSlider={setIsHomeCartDrawerOpen}
                                    key={singleProd.id}
                                               product={singleProd}
                                    cartItemState={[cartItemList, setCartItemList]}
                                    homeCartItemState={[homeCartItemList, setHomeCartItemList]}
                                    drawerState={[isHomeCartDrawerOpen, setIsHomeCartDrawerOpen]} />

                            </Grid>
                        ))}


                    </Grid>
                </Grid>

                <Grid item xs={0} md={2}>
                </Grid>

                <Grid item xs={4} md={5}></Grid>

                <Grid item xs={4} md={2}>
                    {currentPage === totalPage ? '' :
                        <button className={'filledBtn'} onClick={() => {
                            loadMoreProds()
                        }}>
                            Load More
                        </button>
                    }
                </Grid>

                <Grid item xs={4} md={5}></Grid>

            </Grid>


            <br />
            <br />
        </div>
    )
        ;
};

export default ProductsList;
