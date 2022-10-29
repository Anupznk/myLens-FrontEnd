import React, { useEffect, useState } from "react";
import Header, { setCartOpen, setHomeCartOpen } from "../home/Header";
import '../../assets/css/products.css'
import '../../assets/css/productProfile.css'
import '../../assets/css/lightBox.css'
import {
    Button,
    CircularProgress,
    Dialog,
    FormControlLabel,
    Grid,
    LinearProgress,
    Paper,
    Radio,
    RadioGroup
} from "@mui/material";
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { fetchAvailableDate, fetchProductData } from "../../actions/product";
import { useNavigate, useParams } from "react-router-dom";
import '../../assets/css/cart.css'
import { addCartItem, addCartItemQuantity, decrementQuantity, incrementQuantity } from "../../actions/cart";
import { addHomeCartItem, removeHomeCartItem } from "../../actions/homeCart";
import { changeFormate, currentMerchant, MERCHANT_CODE, navBgDefault, setCurrentMerchant, showToast } from "../../App";
import { useDispatch, useSelector } from "react-redux";
import { eventTable, lensOptions, lensOptionsFashion } from "../../index";
import Footer from "../home/Footer";
import S3FileUpload from "react-s3";
import { Helmet } from "react-helmet";




import * as CryptoJS from 'crypto-js'
import { pushEvent } from "../../actions/analytics";

window.Buffer = window.Buffer || require("buffer").Buffer;



const ProductProfile = props => {
    const homeCartItems = useSelector(state => state.homeCart)

    const navigate = useNavigate()
    const params = useParams()
    const [product, setProduct] = useState(null)

    const [images, setImages] = useState([])
    const [image, setImage] = useState('')

    const cartItems = useSelector(state => state.cart)
    const dispatch = useDispatch()

    const [generatedId, setGeneratedId] = useState(null)
    const [quantity, setQuantity] = useState(1)

    const [extraCost, setExtraCost] = useState(0)

    const updateGeneratedId = (data) => {
        if (data.has_lens) {
            setGeneratedId(`${data.id} ${Date.now()}`)
        } else {
            setGeneratedId(data.id)
        }
    }


    const [prescriptionUrl, setPrescriptionUrl] = useState(null)
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        pushEvent(eventTable.productPageOpen, params.id)
    }, [])

    const initialFunctionCall = async () => {
        var data = await fetchProductData(params.id)
        ////console.log(data)
        //////console.logdata)
        setProduct(data)
        if(data.merchant_id===28){
            setPowerOption(0)
            setLensOption(0)
            setExtraCost(0)
        }else{
            setPowerOption(1)
            setLensOption(1)
            setCoatOption(1)
            setExtraCost(800)
        }

        setImages([data.image1, data.image2, data.product_image])
        setImage(data.image1)
        updateGeneratedId(data)
        //////console.logdata)
    }

    const [powerOption, setPowerOption] = useState(0)
    const [lensOption, setLensOption] = useState(0)
    const [coatOption, setCoatOption] = useState(0)
    const [mobile, setMobile] = useState(false)

    const handlePowerOptionChange = (event, v) => {
        setPowerOption(v.props.value)
        setLensOption(null)
        setCoatOption(null)
        updateGeneratedId(product)
        setExtraCost(0)
    }

    const handleLensOptionChange = (event, v) => {
        setLensOption(v.props.value)
        setCoatOption(null)
        if (product.merchant_id !== 28) setExtraCost(0)
        else {
            var cost = lensOptionsFashion[Object.keys(lensOptionsFashion)[powerOption]][Object.keys(lensOptionsFashion[Object.keys(lensOptionsFashion)[powerOption]])[v.props.value]]
            //console.log(cost)
            setExtraCost(cost)
        }
        updateGeneratedId(product)
    }

    const handleCoatOptionChange = (event, v) => {
        setCoatOption(v.props.value)
        var cost = lensOptions[Object.keys(lensOptions)[powerOption]][Object.keys(lensOptions[Object.keys(lensOptions)[powerOption]])[lensOption]][Object.keys(lensOptions[Object.keys(lensOptions)[powerOption]][Object.keys(lensOptions[Object.keys(lensOptions)[powerOption]])[lensOption]])[v.props.value]]

        setExtraCost(cost)
        updateGeneratedId(product)
    }

    function handleResize () {
        if (window.innerWidth <= 1020) setMobile(true)
        else setMobile(false)
    }

    useEffect(() => {
        initialFunctionCall()
        if (window.innerWidth <= 1020) setMobile(true)
        else setMobile(false)
        window.addEventListener('resize', handleResize)
    }, [])


    const config = {
        bucketName: 'buet-edu-1',
        dirName: 'auto_upload_mylens', /* optional */
        region: 'ap-south-1',
        accessKeyId: CryptoJS.AES.decrypt('U2FsdGVkX1+tfXJbXnK3t3PJJACKHSwoM/3QJTiWvWW0vvHIjgFDZWZ544X/S44+', 'henlo hooman').toString(CryptoJS.enc.Utf8),
        secretAccessKey: CryptoJS.AES.decrypt('U2FsdGVkX190rIbWkA2KUF352Ezc4n+iDQSEwRwTSKVb0jqBnjj2ABFlY+6DD2MGXe8g0a6rf7u6nJKgLIeRew==', 'henlo hooman').toString(CryptoJS.enc.Utf8)
    }


    ////console.log(config)

    const upload = file => {
        setUploading(true)
        //file.name=Date.now()+file.name.split('.')[file.name.split('.').length-1]
        S3FileUpload.uploadFile(file, config).then(data => {
            setPrescriptionUrl(data.location)
            setUploading(false)
        }).catch(err => {
            //console.log(err)
            setUploading(false)
            showToast('Error Occurred')
        })
    }

    function renameFile (originalFile, newName) {
        return new File([originalFile], newName, {
            type: originalFile.type,
            lastModified: originalFile.lastModified,
        });
    }

    const onFileSelect = event => {
        var imageFile = event.target.files[0]
        upload(renameFile(imageFile, Date.now() + '.' + imageFile.name.split('.')[imageFile.name.split('.').length - 1]))
    }

    var divId = 'raised-button-file'


    const addToCart = () => {


        if (currentMerchant === MERCHANT_CODE.NONE) {
            setCurrentMerchant(product.merchant_id)
        }

        pushEvent(eventTable.productPageAddToCartClick, product.id)

        if (currentMerchant === MERCHANT_CODE.NONE || currentMerchant === product.merchant_id) {
            if (product.has_lens) {
                if (powerOption === null) {
                    showToast('Select Power Option')
                    pushEvent(eventTable.failedToCart, product.id)
                }
                else if (lensOption === null) {
                    showToast('Select Lens Option')
                    pushEvent(eventTable.failedToCart, product.id)

                }
                else if (product.merchant_id !== 28 && coatOption === null) {
                    showToast('Select Coat Option')
                    pushEvent(eventTable.failedToCart, product.id)

                }
                else if (powerOption === 1 && prescriptionUrl === null) {
                    showToast('Please attach your prescription')
                    pushEvent(eventTable.failedToCartPrescription, product.id)
                }
                else {
                    addCartItemQuantity({
                        ...product,
                        id: generatedId,
                        price: product.price + extraCost,
                        "power_type": powerOption,
                        prescription: powerOption === 1 ? prescriptionUrl : '',
                        "power_option": product.merchant_id === 28 ? 0 : lensOption,
                        "price_type": product.merchant_id === 28 ? lensOption : coatOption
                    }, quantity, cartItems, dispatch)
                    setCartOpen(true)
                    pushEvent(eventTable.addedToCart, product.id)
                }
            } else {
                addCartItemQuantity(product, quantity, cartItems, dispatch)
                setCartOpen(true)
                pushEvent(eventTable.addedToCart, product.id)
            }
        } else {
            pushEvent(eventTable.failedToCartSingleMerchant, product.id)
            showToast('Cannot add items from more than one Merchant')
        }
    }

    const [imgZoom, setImgZoom] = useState(false)


    const handleZoomClose = (value) => {
        setImgZoom(false);

    };

    function zoomImage () {
        ////console.log'clicked zoom')
        setImgZoom(true);
    }

    function updateHomeCartList (newProd) {
        addHomeCartItem(newProd, homeCartItems, dispatch)
        // props.openHomeSlider(true)
        setHomeCartOpen(true)
    }

    const [isDatePromptOpen, setDatePromptOpen] = useState(false)


    const handleClose = (value) => {
        setDatePromptOpen(false);

    };

    const [trialLoading, setTrialLoading] = useState(false)
    const [trialDate, setTrialDate] = useState(['', '', ''])

    async function showCalendarPopup () {
        setTrialLoading(true)
        setDatePromptOpen(true);
        var res = await fetchAvailableDate(product.id)
        if (res === null) {
            setDatePromptOpen(false)
            showToast('Error occurred')
        } else {
            var date = new Date(res)
            var yesterDay = new Date()
            var prevDay = new Date()
            yesterDay.setDate(date.getDate() - 1)
            prevDay.setDate(date.getDate() - 2)
            setTrialDate([changeFormate(prevDay), changeFormate(yesterDay), changeFormate(date)])
        }
        setTrialLoading(false)
    }

    
    return(
        <div>
            {
                mobile?(
                    <div>
                        <Helmet>

                            <title>{product?.title + " - MyLens"}</title>
                            <meta name="title" content={product?.title} />

                            <meta property="og:type" content="website" />
                            <meta property="og:url" content={window.location.href} />
                            <meta property="og:title" content={product?.title} />
                            <meta property="og:image" content={product?.product_image} />

                            <meta property="twitter:card" content="summary_large_image" />
                            <meta property="twitter:url" content={window.location.href} />
                            <meta property="twitter:title" content={product?.title} />
                            <meta property="twitter:image" content={product?.product_image} />
                        </Helmet>

                        <Dialog sx={{ borderRadius: "4em" }} onClose={handleClose} open={isDatePromptOpen}>
                            <div className="dialog-header">
                                <div className="dialog-title"> Earliest Trial Date</div>
                                <div>for this product</div>
                            </div>

                            <div className="date-prompt-container">
                                {
                                    trialLoading ? (
                                        <center style={{ marginBottom: '20px' }}>
                                            <CircularProgress />
                                        </center>
                                    ) : (
                                        <center>
                                            <div className="date-text-disabled"><s>{trialDate[0]}</s></div>
                                            <div className="date-text-disabled"><s>{trialDate[1]}</s></div>
                                            <div className="date-text">{trialDate[2]}</div>
                                        </center>
                                    )
                                }
                                <center>

                                    <Grid container padding={1} spacing={1}>
                                        <Grid item xs={6}>
                                            <button className="outlinedBtn"
                                                    onClick={() => {
                                                        handleClose();
                                                        pushEvent(eventTable.scheduleDialogBackClick, product.id);

                                                    }}>
                                                Back
                                            </button>
                                        </Grid>

                                        <Grid item xs={6}>
                                            <button className="filledBtn"
                                                    disabled={trialLoading}
                                                    onClick={() => {
                                                        pushEvent(eventTable.scheduleDialogAddClick, product.id);
                                                        updateHomeCartList(product);
                                                        handleClose();
                                                    }}>
                                                Add to Trial
                                            </button>
                                        </Grid>


                                    </Grid>


                                </center>
                            </div>


                        </Dialog>

                        <Header bg={navBgDefault} />

                        {
                            product === null ? (
                                <LinearProgress />
                            ) : (
                                <div className={'profile-mobile-container'}>
                                    <div className={'product-profile-form-title'}>
                                        {
                                            product.title
                                        }
                                    </div>
                                    {
                                        product.quantity > 0 ? (
                                            <div className={'product-profile-form-stock'}>
                                                In Stock
                                            </div>
                                        ) : (
                                            <div className={'product-profile-form-stock-out'}>
                                                Out of Stock
                                            </div>
                                        )
                                    }


                                    <div className={'product-profile-form-price'}>
                                        ৳ {product.price}
                                        {
                                            extraCost > 0 ? (
                                                <span style={{ color: '#00aa00' }}> + ৳ {extraCost}</span>
                                            ) : (
                                                <div />
                                            )
                                        }

                                    </div>

                                    <Dialog sx={{ borderRadius: "4em" }} onClose={handleZoomClose} open={imgZoom}>
                                        <div>
                                            <center>

                                                <img className="fullscreen-img" width={'600px'} height={'600px'} src={image} alt='product image'/>


                                                <Grid container padding={1} spacing={1}>
                                                    <Grid item xs={12}>
                                                        {/*<button className="outlinedBtn"*/}
                                                        {/*        onClick={()=>{*/}
                                                        {/*            handleClose()*/}

                                                        {/*        }}>*/}
                                                        {/*    Close*/}
                                                        {/*</button>*/}
                                                    </Grid>


                                                </Grid>


                                            </center>
                                        </div>


                                    </Dialog>

                                    <div onClick={() => {
                                        zoomImage()
                                    }} className={'profile-mobile-preview-container'}>
                                        <Paper style={{
                                            width: '250px',
                                            height: '250px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            {/*<img style={{width:'250px',height:'250px'}} src={image}/>*/}

                                            <img style={{ width: '250px', height: '250px' }} src={image} alt='product image'/>

                                        </Paper>
                                    </div>
                                    <div className={'product-profile-preview-single-container'}>
                                        <Grid container spacing={2} paddingLeft={5} paddingRight={5}>
                                            {
                                                images.map(link => {
                                                    return (
                                                        <Grid item xs={4} onClick={() => {
                                                            setImage(link)
                                                        }}>
                                                            <Paper>
                                                                <img src={link} alt='product image' />
                                                            </Paper>

                                                        </Grid>
                                                    )
                                                })
                                            }
                                        </Grid>
                                    </div>

                                    {
                                        product.has_lens ? (
                                            <div className={'lens-form-container'}>
                                                <Grid container spacing={1}>
                                                    <Grid item xs={12}>
                                                        <FormControl style={{ marginTop: '20px' }} fullWidth>
                                                            <InputLabel fullWidth id="demo-simple-select-label">Select
                                                                Lens</InputLabel>
                                                            <Select
                                                                fullWidth
                                                                value={powerOption}
                                                                onChange={handlePowerOptionChange}
                                                                labelId="demo-simple-select-label"
                                                                id="demo-simple-select"
                                                                label="Select Lens"

                                                            >
                                                                <MenuItem value={0}>Without Power</MenuItem>
                                                                <MenuItem value={1}>With Power</MenuItem>
                                                            </Select>
                                                        </FormControl>

                                                        {
                                                            powerOption !== null ? (
                                                                <FormControl style={{ marginTop: '20px' }} fullWidth>
                                                                    <InputLabel fullWidth
                                                                                id="demo-simple-select-label">Lens
                                                                        Type</InputLabel>
                                                                    <Select
                                                                        fullWidth
                                                                        value={lensOption}
                                                                        onChange={handleLensOptionChange}
                                                                        labelId="demo-simple-select-label"
                                                                        id="demo-simple-select"
                                                                        label="Lens Type"

                                                                    >
                                                                        {
                                                                            powerOption !== null ? (
                                                                                product.merchant_id === 28 ? (
                                                                                    Object.keys(lensOptionsFashion[Object.keys(lensOptions)[powerOption]]).map((o, i) => {
                                                                                        if (i === 1) return <MenuItem
                                                                                            value={i}><b>{o}</b></MenuItem>
                                                                                        else return <MenuItem
                                                                                            value={i}>{o}</MenuItem>
                                                                                    })
                                                                                ) : (
                                                                                    Object.keys(lensOptions[Object.keys(lensOptions)[powerOption]]).map((o, i) => {
                                                                                        if (i === 1) return <MenuItem
                                                                                            value={i}><b>{o}</b></MenuItem>
                                                                                        else return <MenuItem
                                                                                            value={i}>{o}</MenuItem>
                                                                                    })
                                                                                )
                                                                            ) : (
                                                                                <div />
                                                                            )
                                                                        }
                                                                    </Select>
                                                                </FormControl>
                                                            ) : (
                                                                <div />
                                                            )
                                                        }

                                                        {
                                                            powerOption !== null && lensOption !== null && product.merchant_id !== 28 ? (
                                                                <FormControl style={{ marginTop: '20px' }} fullWidth>
                                                                    <InputLabel fullWidth
                                                                                id="demo-simple-select-label">Coat
                                                                        Type</InputLabel>
                                                                    <Select
                                                                        fullWidth
                                                                        value={coatOption}
                                                                        onChange={handleCoatOptionChange}
                                                                        labelId="demo-simple-select-label"
                                                                        id="demo-simple-select"
                                                                        label="Coat Type"

                                                                    >
                                                                        {
                                                                            powerOption !== null && lensOption !== null ? (
                                                                                Object.keys(lensOptions[Object.keys(lensOptions)[powerOption]][Object.keys(lensOptions[Object.keys(lensOptions)[powerOption]])[lensOption]]).map((o, i) => {
                                                                                    return (
                                                                                        <MenuItem
                                                                                            value={i}>{o}</MenuItem>
                                                                                    )
                                                                                })
                                                                            ) : (
                                                                                <div />
                                                                            )
                                                                        }
                                                                    </Select>
                                                                </FormControl>
                                                            ) : (
                                                                <div />
                                                            )
                                                        }

                                                    </Grid>
                                                </Grid>
                                                {
                                                    powerOption === 1 ? (
                                                        uploading ? (
                                                            <div className={'prescription-box'}>
                                                                <CircularProgress />
                                                            </div>

                                                        ) : (
                                                            prescriptionUrl === null ? (
                                                                <div>
                                                                    <input
                                                                        onChange={onFileSelect}
                                                                        accept="image/*"
                                                                        style={{ display: 'none' }}
                                                                        id={divId}
                                                                        multiple
                                                                        type="file"
                                                                    />
                                                                    <label htmlFor={divId}>
                                                                        <div className={'prescription-box'}>
                                                                            Tap to Upload Your Prescription<br />
                                                                            Max File Size : 10MB<br />
                                                                            File Types : jpg/jpeg/png
                                                                        </div>
                                                                    </label>
                                                                </div>
                                                            ) : (
                                                                <div>
                                                                    <input
                                                                        onChange={onFileSelect}
                                                                        accept="image/*"
                                                                        style={{ display: 'none' }}
                                                                        id={divId}
                                                                        multiple
                                                                        type="file"
                                                                    />
                                                                    <label htmlFor={divId}>
                                                                        <div className={'prescription-box'}>

                                                                            <img src={prescriptionUrl} alt='prescription image'/>
                                                                            <div>Change<br />Prescription</div>
                                                                        </div>
                                                                    </label>
                                                                </div>
                                                            )
                                                        )
                                                    ) : (
                                                        <div />
                                                    )
                                                }

                                                <Grid container marginTop={2} spacing={2}>

                                                    {product.quantity > 0 ?
                                                        <Grid item xs={3}>
                                                            <div className={'cart-quantity-box'}>
                                                                <div onClick={() => {
                                                                    if (quantity > 1) {
                                                                        setQuantity(quantity - 1)
                                                                    }

                                                                }} className={'cart-quantity-sign'}>
                                                                    -
                                                                </div>
                                                                <div className={'cart-quantity-number'}>
                                                                    {quantity}
                                                                </div>
                                                                <div onClick={() => {
                                                                    if (quantity < product.quantity) {
                                                                        setQuantity(quantity + 1)
                                                                    } else {
                                                                        showToast('No more items available right now')
                                                                    }
                                                                }} className={'cart-quantity-sign'}>
                                                                    +
                                                                </div>
                                                            </div>
                                                        </Grid>
                                                        : <div></div>}
                                                    <Grid item xs={9}></Grid>


                                                    <Grid item xs={6}>

                                                        {product.quantity > 0 ?
                                                            <button className="filledBtn" onClick={() => {
                                                                addToCart()

                                                            }}>
                                                                Add to Cart
                                                            </button> :
                                                            <Button style={{
                                                                borderRadius: ".75em",
                                                                padding: ".75em",
                                                                fontSize: "0.8em",
                                                                fontFamily: "Poppins",
                                                                textTransform: "none",

                                                            }} disabled fullWidth variant="contained"
                                                                    disableElevation>
                                                                Add to Cart
                                                            </Button>
                                                        }
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        {product.quantity > 0 ?
                                                            <button className="outlinedBtn" onClick={() => {
                                                                //showCalendarPopup()
                                                                pushEvent(eventTable.scheduleDialogAddClick,product.id);
                                                                updateHomeCartList(product);

                                                            }}>
                                                                Trial Home
                                                            </button> :
                                                            <Button style={{
                                                                borderRadius: ".75em",
                                                                padding: ".75em",
                                                                fontSize: "0.8em",
                                                                fontFamily: "Poppins",
                                                                textTransform: "none",

                                                            }} disabled fullWidth variant="contained"
                                                                    disableElevation>
                                                                Trial Home
                                                            </Button>
                                                        }
                                                    </Grid>


                                                </Grid>


                                                <div className={'lens-details-container'}>
                                                    <div className={'lens-details-header'}>
                                                        Standard Lens Detail
                                                    </div>
                                                    <div className={'lens-details-body-container'}>
                                                        <div className={'lens-details-single-container'}>
                                                            <div className={'lens-details-single-left'}>
                                                                No Coating Lens
                                                            </div>
                                                            <div className={'lens-details-single-right'}>
                                                                These lenses have no coating & no UV protection. There will only
                                                                be your desired power attached to these
                                                            </div>
                                                        </div>
                                                        <div className={'lens-details-single-divider'} />
                                                        <div className={'lens-details-single-container'}>
                                                            <div className={'lens-details-single-left'}>
                                                                Multi-Coated Lens
                                                            </div>
                                                            <div className={'lens-details-single-right'}>
                                                                These lenses have Anti-Reflective Coating on both sides. They
                                                                also have UV protection as well.
                                                            </div>
                                                        </div>
                                                        <div className={'lens-details-single-divider'} />
                                                        <div className={'lens-details-single-container'}>
                                                            <div className={'lens-details-single-left'}>
                                                                Anti-Blue Lens
                                                            </div>
                                                            <div className={'lens-details-single-right'}>
                                                                Anti-Blue lenses have all the features of multi-coated and they
                                                                block blue light as well.
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>


                                                {/*<div className={'cart-quantity-box-wrapper'}>*/}
                                                {/*    <div className={'cart-quantity-box'}>*/}
                                                {/*        <div onClick={() => {*/}
                                                {/*            if (quantity > 1) {*/}
                                                {/*                setQuantity(quantity - 1)*/}
                                                {/*            }*/}
                                                {/*            //decrementQuantity(10)*/}
                                                {/*        }} className={'cart-quantity-sign'}>*/}
                                                {/*            -*/}
                                                {/*        </div>*/}
                                                {/*        <div className={'cart-quantity-number'}>*/}
                                                {/*            {quantity}*/}
                                                {/*        </div>*/}
                                                {/*        <div onClick={() => {*/}
                                                {/*            setQuantity(quantity + 1)*/}
                                                {/*        }} className={'cart-quantity-sign'}>*/}
                                                {/*            +*/}
                                                {/*        </div>*/}
                                                {/*    </div>*/}
                                                {/*    <div style={{width: '50%'}}>*/}
                                                {/*        <button*/}

                                                {/*            onClick={() => {*/}
                                                {/*                addToCart()*/}
                                                {/*            }}*/}
                                                {/*            className='filledBtn buttonMargin'>*/}
                                                {/*            Add to cart*/}
                                                {/*        </button>*/}
                                                {/*    </div>*/}

                                                {/*</div>*/}

                                                <div className={'product-profile-details-container'}>
                                                    <div className={'product-profile-details-header'}>
                                                        Eyewear Details
                                                    </div>
                                                    <pre className={'product-profile-details'}>
                                                {
                                                    product.description
                                                }
                                            </pre>
                                                </div>

                                            </div>
                                        ) : (

                                            <Grid container marginTop={2} spacing={2}>

                                                {product.quantity > 0 ?
                                                    <Grid item xs={3}>
                                                        <div className={'cart-quantity-box'}>
                                                            <div onClick={() => {
                                                                if (quantity > 1) {
                                                                    setQuantity(quantity - 1)
                                                                }
                                                                //decrementQuantity(10)
                                                            }} className={'cart-quantity-sign'}>
                                                                -
                                                            </div>
                                                            <div className={'cart-quantity-number'}>
                                                                {quantity}
                                                            </div>
                                                            <div onClick={() => {
                                                                if (quantity < product.quantity) {
                                                                    setQuantity(quantity + 1)
                                                                } else {
                                                                    showToast('No more items available right now')
                                                                }
                                                            }} className={'cart-quantity-sign'}>
                                                                +
                                                            </div>
                                                        </div>
                                                    </Grid>
                                                    : <div></div>}
                                                <Grid item xs={9}></Grid>


                                                <Grid item xs={6}>

                                                    {product.quantity > 0 ?
                                                        <button className="filledBtn" onClick={() => {
                                                            addToCart()

                                                        }}>
                                                            Add to Cart
                                                        </button> :
                                                        <Button style={{
                                                            borderRadius: ".75em",
                                                            padding: ".75em",
                                                            fontSize: "0.8em",
                                                            fontFamily: "Poppins",
                                                            textTransform: "none",

                                                        }} disabled fullWidth variant="contained"
                                                                disableElevation>
                                                            Add to Cart
                                                        </Button>
                                                    }
                                                </Grid>
                                                <Grid item xs={6}>
                                                    {product.quantity > 0 ?
                                                        <button className="outlinedBtn" onClick={() => {
                                                            //showCalendarPopup()
                                                            pushEvent(eventTable.scheduleDialogAddClick,product.id);
                                                            updateHomeCartList(product);
                                                        }}>
                                                            Trial Home
                                                        </button> :
                                                        <Button style={{
                                                            borderRadius: ".75em",
                                                            padding: ".75em",
                                                            fontSize: "0.8em",
                                                            fontFamily: "Poppins",
                                                            textTransform: "none",

                                                        }} disabled fullWidth variant="contained"
                                                                disableElevation>
                                                            Trial Home
                                                        </Button>
                                                    }
                                                </Grid>

                                                <div className={'lens-details-only-container'}>
                                                    <div className={'product-profile-details-container'}>
                                                        <div className={'product-profile-details-header'}>
                                                            Eyewear Details
                                                        </div>
                                                        <pre className={'product-profile-details'}>{
                                                        }
                                                </pre>
                                                    </div>
                                                </div>

                                            </Grid>
                                        )
                                    }


                                </div>
                            )
                        }

                        {/*{*/}
                        {/*    product!==null?(*/}
                        {/*        <div  style={{marginTop:'20px'}}>*/}
                        {/*            */}
                        {/*        </div>*/}
                        {/*    ):(*/}
                        {/*        <div/>*/}
                        {/*    )*/}
                        {/*}*/}

                    </div>
                ):(
                    <div className={'product-profile-wrapper'}>
                        <Helmet>
                            <title>{product?.title + " - MyLens"}</title>
                            <meta name="title" content={product?.title} />

                            <meta property="og:type" content="website" />
                            <meta property="og:url" content={window.location.href} />
                            <meta property="og:title" content={product?.title} />
                            <meta property="og:image" content={product?.product_image} />

                            <meta property="twitter:card" content="summary_large_image" />
                            <meta property="twitter:url" content={window.location.href} />
                            <meta property="twitter:title" content={product?.title} />
                            <meta property="twitter:image" content={product?.product_image} />
                        </Helmet>

                        {/*<Dialog sx={{ borderRadius: "4em" }} onClose={handleClose} open={isDatePromptOpen}>*/}
                        {/*    <div className="dialog-header">*/}
                        {/*        <div className="dialog-title"> Earliest Trial Date</div>*/}
                        {/*        <div>for this product</div>*/}
                        {/*    </div>*/}

                        {/*    <div className="date-prompt-container">*/}
                        {/*        {*/}
                        {/*            trialLoading ? (*/}
                        {/*                <center style={{ marginBottom: '20px' }}>*/}
                        {/*                    <CircularProgress />*/}
                        {/*                </center>*/}
                        {/*            ) : (*/}
                        {/*                <center>*/}
                        {/*                    <div className="date-text-disabled"><s>{trialDate[0]}</s></div>*/}
                        {/*                    <div className="date-text-disabled"><s>{trialDate[1]}</s></div>*/}
                        {/*                    <div className="date-text">{trialDate[2]}</div>*/}
                        {/*                </center>*/}
                        {/*            )*/}
                        {/*        }*/}
                        {/*        <center>*/}

                        {/*            <Grid container padding={1} spacing={1}>*/}
                        {/*                <Grid item xs={6}>*/}
                        {/*                    <button className="outlinedBtn"*/}
                        {/*                        onClick={() => {*/}
                        {/*                            handleClose();*/}
                        {/*                            pushEvent(eventTable.scheduleDialogBackClick, product.id);*/}

                        {/*                        }}>*/}
                        {/*                        Back*/}
                        {/*                    </button>*/}
                        {/*                </Grid>*/}

                        {/*                <Grid item xs={6}>*/}
                        {/*                    <button className="filledBtn"*/}
                        {/*                        disabled={trialLoading}*/}
                        {/*                        onClick={() => {*/}
                        {/*                            pushEvent(eventTable.scheduleDialogAddClick, product.id);*/}
                        {/*                            updateHomeCartList(product);*/}
                        {/*                            handleClose();*/}
                        {/*                        }}>*/}
                        {/*                        Add to Trial*/}
                        {/*                    </button>*/}
                        {/*                </Grid>*/}


                        {/*            </Grid>*/}


                        {/*        </center>*/}
                        {/*    </div>*/}


                        {/*</Dialog>*/}



                        <div>
                            <Header bg={navBgDefault} />
                            {
                                product === null ? (
                                    <LinearProgress />
                                ) : (
                                    <div className={'product-profile-container'}>

                                        <div className={'product-profile-body'}>

                                            <div className={'product-profile-preview-container'}>
                                                <div onClick={() => {
                                                    navigate('/shop/men')
                                                }} className={'product-profile-back'}>
                                                    &lt; Back
                                                </div>
                                                <div className={'product-profile-preview-single-container'}>
                                                    {
                                                        images.map(link => {
                                                            return (
                                                                <Paper onClick={() => {
                                                                    setImage(link)
                                                                }} style={{
                                                                    width: '96px',
                                                                    height: '96px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    marginBottom: '10px'
                                                                }}>
                                                                    <img src={link} alt='product image'/>
                                                                </Paper>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>

                                            <Dialog sx={{ borderRadius: "4em" }} onClose={handleZoomClose} open={imgZoom}>
                                                <div>
                                                    <center>

                                                        <img className="fullscreen-img" width={'600px'} height={'600px'}
                                                             src={image} alt='product image'/>


                                                        <Grid container padding={1} spacing={1}>
                                                            <Grid item xs={12}>
                                                                {/*<button className="outlinedBtn"*/}
                                                                {/*        onClick={()=>{*/}
                                                                {/*            handleClose()*/}

                                                                {/*        }}>*/}
                                                                {/*    Close*/}
                                                                {/*</button>*/}
                                                            </Grid>


                                                        </Grid>


                                                    </center>
                                                </div>


                                            </Dialog>

                                            <div className={'product-profile-middle-container'}>
                                                <Paper style={{
                                                    width: '250px',
                                                    height: '250px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>

                                                    <img onClick={() => {
                                                        zoomImage()
                                                    }} style={{ width: '250px', height: '250px' }} src={image} alt='product image'/>

                                                </Paper>
                                                <div className={'product-profile-details-container'}>
                                                    <div className={'product-profile-details-header'}>
                                                        Eyewear Details
                                                    </div>
                                                    <pre className={'product-profile-details'}>
                                                {
                                                    product.description
                                                }
                                            </pre>

                                                    <Grid container spacing={2}>

                                                        {product.quantity > 0 ?
                                                            <Grid item xs={3.5}>
                                                                <div className={'cart-quantity-box'}>
                                                                    <div onClick={() => {
                                                                        if (quantity > 1) {
                                                                            setQuantity(quantity - 1)
                                                                        }
                                                                        //decrementQuantity(10)
                                                                    }} className={'cart-quantity-sign'}>
                                                                        -
                                                                    </div>
                                                                    <div className={'cart-quantity-number'}>
                                                                        {quantity}
                                                                    </div>
                                                                    <div onClick={() => {
                                                                        if (quantity < product.quantity) {
                                                                            setQuantity(quantity + 1)
                                                                        } else {
                                                                            showToast('No more items available right now')
                                                                        }
                                                                    }} className={'cart-quantity-sign'}>
                                                                        +
                                                                    </div>
                                                                </div>
                                                            </Grid>
                                                            : <div></div>}
                                                        <Grid item xs={8}></Grid>


                                                        <Grid item xs={6}>

                                                            {product.quantity > 0 ?
                                                                <button className="filledBtn" onClick={() => {
                                                                    addToCart()

                                                                }}>
                                                                    Add to Cart
                                                                </button> :
                                                                <Button style={{
                                                                    borderRadius: ".75em",
                                                                    padding: ".75em",
                                                                    fontSize: "0.8em",
                                                                    fontFamily: "Poppins",
                                                                    textTransform: "none",

                                                                }} disabled fullWidth variant="contained"
                                                                        disableElevation>
                                                                    Add to Cart
                                                                </Button>
                                                            }
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            {product.quantity > 0 ?
                                                                <button className="outlinedBtn" onClick={() => {
                                                                    //showCalendarPopup()
                                                                    pushEvent(eventTable.scheduleDialogAddClick, product.id);
                                                                    updateHomeCartList(product);
                                                                }}>
                                                                    Trial Home
                                                                </button> :
                                                                <Button style={{
                                                                    borderRadius: ".75em",
                                                                    padding: ".75em",
                                                                    fontSize: "0.8em",
                                                                    fontFamily: "Poppins",
                                                                    textTransform: "none",

                                                                }} disabled fullWidth variant="contained"
                                                                        disableElevation>
                                                                    Trial Home
                                                                </Button>
                                                            }
                                                        </Grid>

                                                    </Grid>

                                                    {/*<div className={'cart-quantity-box-wrapper'}>*/}
                                                    {/*    <div className={'cart-quantity-box'}>*/}
                                                    {/*        <div onClick={()=>{*/}
                                                    {/*            if(quantity>1){*/}
                                                    {/*                setQuantity(quantity-1)*/}
                                                    {/*            }*/}
                                                    {/*            //decrementQuantity(10)*/}
                                                    {/*        }} className={'cart-quantity-sign'}>*/}
                                                    {/*            -*/}
                                                    {/*        </div>*/}
                                                    {/*        <div className={'cart-quantity-number'}>*/}
                                                    {/*            {quantity}*/}
                                                    {/*        </div>*/}
                                                    {/*        <div onClick={()=>{*/}
                                                    {/*            setQuantity(quantity+1)*/}
                                                    {/*        }} className={'cart-quantity-sign'}>*/}
                                                    {/*            +*/}
                                                    {/*        </div>*/}
                                                    {/*    </div>*/}
                                                    {/*    <button*/}

                                                    {/*        onClick={()=>{*/}
                                                    {/*            addToCart()*/}
                                                    {/*        }}*/}
                                                    {/*        className='filledBtn buttonMargin'>*/}
                                                    {/*        Add to cart*/}
                                                    {/*    </button>*/}
                                                    {/*</div>*/}


                                                </div>
                                            </div>
                                            <div className={'product-profile-form-container'}>
                                                <div className={'product-profile-form-title'}>
                                                    {
                                                        product.title
                                                    }
                                                </div>
                                                {
                                                    product.quantity > 0 ? (
                                                        <div className={'product-profile-form-stock'}>
                                                            In Stock
                                                        </div>
                                                    ) : (
                                                        <div className={'product-profile-form-stock-out'}>
                                                            Out of Stock
                                                        </div>
                                                    )
                                                }


                                                <div className={'product-profile-form-price'}>
                                                    ৳ {product.price}
                                                    {
                                                        extraCost > 0 ? (
                                                            <span style={{ color: '#00aa00' }}> + ৳ {extraCost}</span>
                                                        ) : (
                                                            <div />
                                                        )
                                                    }

                                                </div>


                                                {
                                                    product.has_lens ? (
                                                        <div className={'lens-form-container'}>
                                                            <Grid container spacing={1}>
                                                                <Grid item xs={12}>
                                                                    <FormControl style={{ marginTop: '20px' }} fullWidth>
                                                                        <InputLabel fullWidth id="demo-simple-select-label">Select
                                                                            Lens</InputLabel>
                                                                        <Select
                                                                            fullWidth
                                                                            value={powerOption}
                                                                            onChange={handlePowerOptionChange}
                                                                            defaultValue={0}
                                                                            labelId="demo-simple-select-label"
                                                                            id="demo-simple-select"
                                                                            label="Select Lens"

                                                                        >
                                                                            <MenuItem value={0}>Without Power</MenuItem>
                                                                            <MenuItem value={1}>With Power</MenuItem>
                                                                        </Select>
                                                                    </FormControl>

                                                                    {
                                                                        powerOption !== null ? (
                                                                            <FormControl style={{ marginTop: '20px' }} fullWidth>
                                                                                <InputLabel fullWidth
                                                                                            id="demo-simple-select-label">Lens
                                                                                    Type</InputLabel>
                                                                                <Select
                                                                                    fullWidth
                                                                                    value={lensOption}
                                                                                    onChange={handleLensOptionChange}
                                                                                    labelId="demo-simple-select-label"
                                                                                    id="demo-simple-select"
                                                                                    label="Lens Type"

                                                                                >
                                                                                    {
                                                                                        powerOption !== null ? (
                                                                                            product.merchant_id === 28 ? (
                                                                                                Object.keys(lensOptionsFashion[Object.keys(lensOptions)[powerOption]]).map((o, i) => {
                                                                                                    if (i === 1) return <MenuItem
                                                                                                        value={i}><b>{o}</b></MenuItem>
                                                                                                    else return <MenuItem
                                                                                                        value={i}>{o}</MenuItem>
                                                                                                })
                                                                                            ) : (
                                                                                                Object.keys(lensOptions[Object.keys(lensOptions)[powerOption]]).map((o, i) => {
                                                                                                    if (i === 1) return <MenuItem
                                                                                                        value={i}><b>{o}</b></MenuItem>
                                                                                                    else return <MenuItem
                                                                                                        value={i}>{o}</MenuItem>
                                                                                                })
                                                                                            )
                                                                                        ) : (
                                                                                            <div />
                                                                                        )
                                                                                    }
                                                                                </Select>
                                                                            </FormControl>
                                                                        ) : (
                                                                            <div />
                                                                        )
                                                                    }

                                                                    {
                                                                        powerOption !== null && lensOption !== null && product.merchant_id !== 28 ? (
                                                                            <FormControl style={{ marginTop: '20px' }} fullWidth>
                                                                                <InputLabel fullWidth
                                                                                            id="demo-simple-select-label">Coat
                                                                                    Type</InputLabel>
                                                                                <Select
                                                                                    fullWidth
                                                                                    value={coatOption}
                                                                                    onChange={handleCoatOptionChange}
                                                                                    labelId="demo-simple-select-label"
                                                                                    id="demo-simple-select"
                                                                                    label="Coat Type"

                                                                                >
                                                                                    {
                                                                                        powerOption !== null && lensOption !== null ? (
                                                                                            Object.keys(lensOptions[Object.keys(lensOptions)[powerOption]][Object.keys(lensOptions[Object.keys(lensOptions)[powerOption]])[lensOption]]).map((o, i) => {
                                                                                                return (
                                                                                                    <MenuItem
                                                                                                        value={i}>{o}</MenuItem>
                                                                                                )
                                                                                            })
                                                                                        ) : (
                                                                                            <div />
                                                                                        )
                                                                                    }
                                                                                </Select>
                                                                            </FormControl>
                                                                        ) : (
                                                                            <div />
                                                                        )
                                                                    }
                                                                </Grid>
                                                            </Grid>

                                                            {
                                                                powerOption === 1 ? (
                                                                    uploading ? (
                                                                        <div className={'prescription-box'}>
                                                                            <CircularProgress />
                                                                        </div>

                                                                    ) : (
                                                                        prescriptionUrl === null ? (
                                                                            <div>
                                                                                <input
                                                                                    onChange={onFileSelect}
                                                                                    accept="image/*"
                                                                                    style={{ display: 'none' }}
                                                                                    id={divId}
                                                                                    multiple
                                                                                    type="file"
                                                                                />
                                                                                <label htmlFor={divId}>
                                                                                    <div className={'prescription-box'}>
                                                                                        Tap to Upload Your Prescription<br />
                                                                                        Max File Size : 10MB<br />
                                                                                        File Types : jpg/jpeg/png
                                                                                    </div>
                                                                                </label>
                                                                            </div>
                                                                        ) : (
                                                                            <div>
                                                                                <input
                                                                                    onChange={onFileSelect}
                                                                                    accept="image/*"
                                                                                    style={{ display: 'none' }}
                                                                                    id={divId}
                                                                                    multiple
                                                                                    type="file"
                                                                                />
                                                                                <label htmlFor={divId}>
                                                                                    <div className={'prescription-box'}>

                                                                                        <img src={prescriptionUrl} alt='prescription image'/>
                                                                                        <div>Change<br />Prescription</div>
                                                                                    </div>
                                                                                </label>
                                                                            </div>
                                                                        )
                                                                    )
                                                                ) : (
                                                                    <div />
                                                                )
                                                            }




                                                            <div className={'lens-details-container'}>
                                                                <div className={'lens-details-header'}>
                                                                    Standard Lens Detail
                                                                </div>
                                                                <div className={'lens-details-body-container'}>
                                                                    <div className={'lens-details-single-container'}>
                                                                        <div className={'lens-details-single-left'}>
                                                                            No Coating Lens
                                                                        </div>
                                                                        <div className={'lens-details-single-right'}>
                                                                            These lenses have no coating & no UV protection.
                                                                            There will only be your desired power attached to
                                                                            these
                                                                        </div>
                                                                    </div>
                                                                    <div className={'lens-details-single-divider'} />
                                                                    <div className={'lens-details-single-container'}>
                                                                        <div className={'lens-details-single-left'}>
                                                                            Multi-Coated Lens
                                                                        </div>
                                                                        <div className={'lens-details-single-right'}>
                                                                            These lenses have Anti-Reflective Coating on both
                                                                            sides. They also have UV protection as well.
                                                                        </div>
                                                                    </div>
                                                                    <div className={'lens-details-single-divider'} />
                                                                    <div className={'lens-details-single-container'}>
                                                                        <div className={'lens-details-single-left'}>
                                                                            Anti-Blue Lens
                                                                        </div>
                                                                        <div className={'lens-details-single-right'}>
                                                                            Anti-Blue lenses have all the features of
                                                                            multi-coated and they block blue light as well.
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                            </div>

                                                        </div>
                                                    ) : (
                                                        <div />
                                                    )
                                                }

                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                        {/*{*/}
                        {/*    product!==null?(*/}
                        {/*        <div  style={{marginTop:'20px'}}>*/}
                        {/*            */}
                        {/*        </div>*/}
                        {/*    ):(*/}
                        {/*        <div/>*/}
                        {/*    )*/}
                        {/*}*/}

                        <br /><br />
                    </div>
                )
            }
        </div>
    )
}

export default ProductProfile
