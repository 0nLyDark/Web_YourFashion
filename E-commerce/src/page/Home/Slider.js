import React from 'react';

const Slider = () => (
    <section className="slider" >
            <div class="">

        <div id="demo" className="carousel slide" data-bs-ride="carousel">

        {/* <!-- Indicators/dots --> */}
        <div className="carousel-indicators">
        <button type="button" data-bs-target="#demo" data-bs-slide-to="0" className="active"></button>
        <button type="button" data-bs-target="#demo" data-bs-slide-to="1"></button>
        <button type="button" data-bs-target="#demo" data-bs-slide-to="2"></button>
        </div>

        {/* <!-- The slideshow/carousel --> */}
        <div className="carousel-inner" >
        <div className="carousel-item active">
            <img src={ require('../../assets/image/banner_1.webp') } alt="Los Angeles" className="slide-pig" />

        </div>
        <div className="carousel-item">
            <img src={ require('../../assets/image/banner_3.jpg') } alt="Chicago" className="slide-pig" />
        </div>
        <div className="carousel-item">
            <img src={ require('../../assets/image/banner_4.jpg') } alt="New York" className=" slide-pig" />
        </div>
        </div>

        {/* <!-- Left and right controls/icons --> */}
        <button className="carousel-control-prev" type="button" data-bs-target="#demo" data-bs-slide="prev">
        <span className="carousel-control-prev-icon"></span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#demo" data-bs-slide="next">
        <span className="carousel-control-next-icon"></span>
        </button>
        </div>
        </div>
    </section>
);

export default Slider

