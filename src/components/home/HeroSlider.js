import React, {useEffect, useState} from 'react'
import hero1 from '../../assets/images/production/hero/hero-img-new.webp'
import hero2 from '../../assets/images/production/hero/hero-img-new2.webp'
import hero3 from '../../assets/images/production/hero/hero-img-new3.webp'

import heroMobile1 from '../../assets/images/production/hero/demo.phn.webp'
import heroMobile2 from '../../assets/images/production/hero/demo.phn2.webp'
import heroMobile3 from '../../assets/images/production/hero/demo.phn3.webp'

import '../../assets/css/heroSlider.css'

const HeroSlider = props => {

    const [mobile,setMobile]=useState(false)

    function handleResize() {
        if(window.innerWidth<=1020) setMobile(true)
        else setMobile(false)
    }

    useEffect(()=>{
        if(window.innerWidth<=1020) setMobile(true)
        else setMobile(false)
        window.addEventListener('resize', handleResize)
    },[])


    return (
        <div>
            <div id="slider">
                {mobile ? <figure>
                        <img src={heroMobile1} alt='hero-image-1'/>
                        <img src={heroMobile2} alt='hero-image-2'/>
                        <img src={heroMobile3} alt='hero-image-3'/>
                        <img src={heroMobile1} alt='hero-image-4'/>

                    </figure> :

                    <figure>
                        <img src={hero1} alt='hero-image-1'/>
                        <img src={hero2} alt='hero-image-2'/>
                        <img src={hero3} alt='hero-image-3'/>
                        <img src={hero1} alt='hero-image-4'/>

                    </figure>
                }
            </div>
        </div>
    )
}
export default HeroSlider