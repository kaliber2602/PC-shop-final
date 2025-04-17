import Carousel from "./Carousel";
import { useState, useEffect } from "react";

import Card from "./Card";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
const Displayproduct = () => {
    return (
        <>
            <div className=" col-lg-6 col-xl-6 col-sm-12 col-md-12 mb-4">
                <Carousel />

                <div className="row h-25 mb-3">
                    <Card
                        image="Products/arm_man_hinh.webp"
                        title="Item One"
                        price="24.99"
                        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                    />
                    <Card
                        image="Products/arm_man_hinh.webp"
                        title="Item One"
                        price="24.99"
                        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                    />
                    <Card
                        image="Products/arm_man_hinh.webp"
                        title="Item One"
                        price="24.99"
                        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                    />
                </div>

                <div className="row h-25 mb-3">
                    <Card
                        image="Products/arm_man_hinh.webp"
                        title="Item One"
                        price="24.99"
                        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                    />
                    <Card
                        image="Products/arm_man_hinh.webp"
                        title="Item One"
                        price="24.99"
                        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                    />
                    <Card
                        image="Products/arm_man_hinh.webp"
                        title="Item One"
                        price="24.99"
                        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                    />
                </div>

                <div className="row h-25 mb-3">
                    <Card
                        image="Products/arm_man_hinh.webp"
                        title="Item One"
                        price="24.99"
                        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                    />
                    <Card
                        image="Products/arm_man_hinh.webp"
                        title="Item One"
                        price="24.99"
                        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                    />
                    <Card
                        image="Products/arm_man_hinh.webp"
                        title="Item One"
                        price="24.99"
                        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                    />
                </div>

            </div>
        </>
    )
};
export default Displayproduct;
