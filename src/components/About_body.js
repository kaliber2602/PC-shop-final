import React from "react";
import './About.css';
import {
  VerifiedOutlined,
  TouchAppOutlined,
  UpdateOutlined,
  SupportAgentOutlined,
  EmojiObjectsOutlined
} from '@mui/icons-material';

import { School, Public, Chat, AccessTime, Send, PhonelinkRing } from "@mui/icons-material";

const About_body = () => {
  const profiles = [
    {
      name: 'Nguyen Quoc Thang',
      role: 'Graphic Designer',
      img: 'avatars/Thang.jpg',
    },
    {
      name: 'Ngo Chi Thuan',
      role: 'Digital Marketing',
      img: 'avatars/Thuan.jpg',
    },
    {
      name: 'Truong Cong Bac',
      role: 'Chartered Accountant C.A',
      img: 'avatars/Bac.jpg',
    },
  ];
  const items = [
    { id: "01", title: "Top Quality", icon: <School fontSize="large" />, desc: "High-quality standards in every product we offer." },
    { id: "02", title: "Global Reach", icon: <Public fontSize="large" />, desc: "Delivering value around the world with efficiency." },
    { id: "03", title: "Instant Support", icon: <Chat fontSize="large" />, desc: "Always here for you, quick and helpful." },
    { id: "04", title: "Time Efficient", icon: <AccessTime fontSize="large" />, desc: "Save your time with optimized workflow." },
    { id: "05", title: "Smart Delivery", icon: <Send fontSize="large" />, desc: "Fast, reliable shipping process." },
    { id: "06", title: "Tech Friendly", icon: <PhonelinkRing fontSize="large" />, desc: "Modern UI and responsive platform." },
  ];

  return (
    <section>
      <div className="container-fluid">
      <img src="/Home_image/banner.jpg" alt="about" style={{ height: "100%", width: "100%", objectFit: "cover" }} />

      </div>

      <div className="container" style={{ marginBottom: "0px", paddingBottom: "0px" }}>
        <section className="intro-section" style={{ marginBottom: "0px", paddingBottom: "0px" }}>
          <div className="intro-container" style={{ marginBottom: "0px", paddingBottom: "0px" }}>
            <h1>About us</h1>
          </div>
        </section>
      </div>

      <div className="container infor-container ">
        {profiles.map((profile, index) => (
          <div className="box" key={index}>
            <div className="imgBox" >
              <img src={profile.img} alt={profile.name} style={{ borderRadius: "15px" }} />
            </div>
            <div className="content">
              <h2>
                {profile.name}<br />
                <span>{profile.role}</span>
              </h2>
              <p style={{ fontSize: "1rem", marginTop: "10px" }}>{profile.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="container" style={{ marginBottom: "0px", paddingBottom: "0px" }}>
        <section className="intro-section" style={{ marginBottom: "0px", paddingBottom: "0px" }}>
          <div className="intro-container" style={{ marginBottom: "0px", paddingBottom: "0px" }}>
            <h1>Our Commitments</h1>
          </div>
        </section>
      </div>

      <div className="container py-5">
        <section className="about-section">
          <div className="row">
            {items.map((item, index) => (
              <div key={index} className="col-md-4 mb-4 d-flex justify-content-center">
                <div className="card custom-card">
                  <div className="card-top-border"></div>
                  <div className="card-content">
                    <span className="card-id">{item.id}</span>
                    <div className="card-icon">{item.icon}</div>
                    <h3 className="card-title">{item.title}</h3>
                    <p className="card-desc">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* New Section: Our Values and Mission */}
      <div className="container py-5">
        <section className="values-mission-section">
          <div className="row">
            <div className="col-md-6 border p-3 shadow">
              <h2 style={{ fontSize: "2rem", fontWeight: "bold", textAlign: "center" }}>Our Values</h2>
              <p style={{ fontSize: "1.2rem",marginLeft: "20px" }}>
                At GearZone, we believe in integrity, innovation, and customer satisfaction. 
                Our values drive us to deliver the best products and services to our customers, 
                ensuring a seamless and enjoyable experience.
              </p>
            </div>
            <div className="col-md-6 border p-3 shadow">
              <h2 style={{ fontSize: "2rem", fontWeight: "bold", textAlign: "center" }}>Our Mission</h2>
              <p style={{ fontSize: "1.2rem",marginLeft: "20px" }}>
                Our mission is to empower individuals and businesses with cutting-edge technology 
                and exceptional service. We strive to be a global leader in providing innovative 
                solutions that enhance productivity and quality of life.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* New Section: History of Development */}
      <div className="container py-5 border shadow mb-5">
        <section className="history-section">
          <h2 className="text-center" style={{ fontSize: "2.5rem", fontWeight: "bold" }}>History of Development</h2>
          <p style={{ fontSize: "1.2rem", marginTop: "20px" ,margin:"0 auto", width: "80%" }}>
            GearZone started as a small local business specializing in computer hardware in 2010. Over the years, 
            we have grown into a trusted name in the industry, serving customers worldwide. Our journey has been 
            marked by continuous innovation, a commitment to quality, and a passion for technology. Today, we are 
            proud to be a leader in providing cutting-edge hardware solutions, helping individuals and businesses 
            achieve their goals with the best tools available.
          </p>
        </section>
      </div>

      <div className="container-fluid">
      <img src="/Home_image/about1.jpg" alt="about" style={{ height: "100%", width: "100%", objectFit: "cover" }} />
      </div>
    </section>
  );
};

export default About_body;