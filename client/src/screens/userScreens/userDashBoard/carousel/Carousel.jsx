import React from "react";
import { Carousel } from "antd";

const contentStyle = {
  height: "300px",
  color: "#fff",
  lineHeight: "160px",
  textAlign: "center",
  background: "#364d79",
};

const HomeCarousel = () => {
  return (
    <Carousel dots={true} autoplay autoplaySpeed={5000}>
      <div>
        <h3 style={contentStyle}>Slide 1</h3>
      </div>
      <div>
        <h3 style={contentStyle}>Slide 2</h3>
      </div>
      <div>
        <h3 style={contentStyle}>Slide 3</h3>
      </div>
    </Carousel>
  );
};

export default HomeCarousel;
