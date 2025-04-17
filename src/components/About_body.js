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
      name: 'Pham Ngoc Duong',
      role: 'Chartered Accountant C.A',
      img: 'avatars/Duong.jpg',
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
        <img src="/Home_image/about1.jpg" alt="about" style={{ height: "100%", width: "100%", objectFit: "cover" }} />
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

      <div className="container-fluid">
        <img src="/Home_image/about2.jpg" alt="about" style={{ height: "100%", width: "100%", objectFit: "cover" }} />
      </div>
    </section>
  );
};

export default About_body;
