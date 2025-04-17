import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import About_body from "../components/About_body";
import '../index.css';
const About = ({ isLoggedIn, setIsLoggedIn }) => {


  return (
    <>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <About_body />
      <Footer />
    </>
  );
};

export default About;
