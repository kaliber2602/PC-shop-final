import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Contact_body from "../components/Contact_body";
import '../index.css';
const Contact = ({ isLoggedIn, setIsLoggedIn }) => {
  return (
    <>
      <Header  isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
      <Contact_body />
      <Footer />
    </>
  );
};

export default Contact;
