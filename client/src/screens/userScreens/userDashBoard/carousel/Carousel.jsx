import React, { useEffect, useState } from "react";
import { Carousel, Spin, message } from "antd";
import { getSilderService } from "../../../../api/userServices/userDashboard";

const contentStyle = {
  height: "400px",
  width: "100%",
  objectFit: "cover",
};

const HomeCarousel = () => {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        setLoading(true);
        const response = await getSilderService();
        console.log(response, "res");
        if (response?.success) {
          const sorted = (response.data || []).sort(
            (a, b) => a.order - b.order,
          );
          setSliders(sorted);
        } else {
          message.error(response?.message || "Failed to load sliders");
        }
      } catch (error) {
        console.error("Error fetching sliders:", error);
        message.error("Failed to load sliders");
      } finally {
        setLoading(false);
      }
    };

    fetchSliders();
  }, []);

  if (loading) {
    return <Spin />;
  }

  if (sliders.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        No sliders available
      </div>
    );
  }

  return (
    <Carousel dots={true} autoplay autoplaySpeed={5000}>
      {sliders.map((slider) => (
        <div key={slider._id}>
          <img
            src={slider.imageUrl}
            alt={`Slider ${slider.order}`}
            style={contentStyle}
          />
        </div>
      ))}
    </Carousel>
  );
};

export default HomeCarousel;
