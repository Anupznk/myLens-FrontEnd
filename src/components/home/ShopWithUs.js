import React from "react";
import '../../assets/css/shopWithUs.css'
import {Grid} from "@mui/material";
import manCover from '../../assets/images/production/his.webp'
import womenCover from '../../assets/images/production/her.webp'
import {useNavigate} from "react-router-dom";
import {pushEvent} from "../../actions/analytics";
import {eventTable} from "../../index";

const ShopWithUs=props=>{
    const navigate = useNavigate()
    return(
        <div className={'shop-with-container'}>
            <div className={'shop-with-pre-title'}>
                Pay A View
            </div>
            <div className={'shop-with-title'}>
                Shop With US
            </div>
            <Grid container spacing={2} >
                <Grid item xs={1}></Grid>
                <Grid item xs={5}>
                    <div onClick={()=>{
                        navigate("/shop/men/all");
                        pushEvent(eventTable.forHimClick);
                    }} className={'shop-cover-container'}>
                        <img className={'shop-with-us-img'} src={manCover} alt='for him cover'/>
                        <div className={'shop-cover-caption'}>
                            {/*this is for mobile view*/}
                            For Him
                        </div>

                        <div className="middle">
                            {/*for desktop hover*/}
                            <div className="coverText" >For Him</div>
                        </div>

                    </div>
                </Grid>
                <Grid item xs={5}>
                    <div onClick={()=>{navigate("/shop/women/all");
                        pushEvent(eventTable.forHerClick);
                    }} className={'shop-cover-container'}>
                        <img className={'shop-with-us-img'} src={womenCover} alt='for her cover'/>
                        <div className={'shop-cover-caption'}>
                            For Her
                        </div>

                        <div className="middle">
                            {/*for desktop hover*/}
                            <div className="coverText" >For Her</div>
                        </div>

                    </div>
                </Grid>
                <Grid item xs={1}></Grid>
            </Grid>
        </div>
    )
}

export default ShopWithUs
