import React from 'react'
import TwinSpin from "react-cssfx-loading/lib/TwinSpin";
import Hypnosis from "react-cssfx-loading/lib/Hypnosis";
import {btnDefault} from "../../App";
import "../../assets/css/loading-anim.css"


const DelayComponent = props => {
    // const [show, setShow] = React.useState(true)
    //
    //
    // React.useEffect(() => {
    //     const timeout = setTimeout(() => {
    //         setShow(false)
    //     }, props.timeOut)
    //
    //     return () => clearTimeout(timeout)
    //
    // }, [show])

    // if (!show) return <div/>

    return (
        <div>

            <br/>
            <center>
                <Hypnosis color={btnDefault} width="100px" height="100px" duration="1.5s"/>
            </center>

        </div>
    )
}

export default DelayComponent