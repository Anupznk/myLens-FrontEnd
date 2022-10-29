import React from "react";
import SkeletonElement from "./skeletonElement";
import Shimmer from "./Shimmer";

const SkeletonProd = ({theme}) => {
    const themeClass = theme || 'light';

    return(
        <div className={`skeleton-wrapper ${themeClass}`}>
            <div className="skeleton-product">
                <SkeletonElement type="thumbnail"/>
                <SkeletonElement type="text"/>
                <SkeletonElement type="title"/>
            </div>

            <Shimmer/>
        </div>
    )
}

export default SkeletonProd;