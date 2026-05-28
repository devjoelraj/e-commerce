import React from "react";
import { useParams } from "react-router-dom";
import Header from "../../../components/header/userHeader/Header";
import Footer from "../../../components/footer/Footer";

const ImportantLink = () => {
  const { type } = useParams();

  const contentMap = {
    privacy: {
      title: "Privacy Policy",
      content:
        "Your privacy is important to us. We collect information to provide better services...",
    },
    returns: {
      title: "Return Policy",
      content: "You can return items within 30 days of purchase...",
    },
    terms: {
      title: "Terms & Conditions",
      content: "By using our website, you agree to these terms...",
    },
    contact: {
      title: "Contact Us",
      content: "Email us at support@trendystyle.com or call +91 99999999.",
    },
    support: {
      title: "Support",
      content:
        "For any assistance, please reach out to our support team via email or phone.",
    },
  };

  const page = contentMap[type] || {
    title: "Page Not Found",
    content: "The page you are looking for does not exist.",
  };

  return (
    <>
      <Header />
      <div
        className="important-page-container"
        style={{ padding: "100px 20px", minHeight: "60vh" }}
      >
        <h1>{page.title}</h1>
        <p>{page.content}</p>
      </div>
      <Footer />
    </>
  );
};

export default ImportantLink;
