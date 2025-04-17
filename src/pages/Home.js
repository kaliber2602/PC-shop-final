import React from "react";
import Header from "../components/Header";
import Home_body from "../components/Home_body";
import Footer from "../components/Footer";
import '../index.css';
const Home = ({ isLoggedIn, setIsLoggedIn }) => {
  return (
    <>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Home_body />
      <Footer />
    </>
  );
};

export default Home;
