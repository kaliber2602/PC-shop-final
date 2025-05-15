import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const customMarker = new L.Icon({
  iconUrl: '/marker.png',
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  popupAnchor: [0, -40],
});


const Contact_body = () => {
  const position = [10.731910307054187, 106.69915404131008];
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm('service_tyv6xih', 'template_hb4tf5b', form.current, {
        publicKey: '1xoBs8JUy46rw8VKx',
      })
      .then(
        () => {
          console.log('SUCCESS!');
          form.current.reset(); // Sử dụng form.current thay vì getElementById
          alert("Sent gmail to Decor Dream Team");
        },
        (error) => {
          console.log('FAILED...', error.text);
          alert("Something went wrong!");
        },
      );
  };
  return (
    <section className="py-5">
      <div className="container">
        <h2 className="text-center mb-4">Drop us a message</h2>
        <div className="row">

          <div className="col-lg-6" style={{ height: "400px" }}>
            <div className="contact-form shadow p-4" style={{ height: "100%" }}>
              <h2 className="text-center mb-3">Contact Us</h2>
              <form 
                id="contact-form" 
                ref={form} 
                onSubmit={sendEmail}
                className="d-flex flex-column gap-3"
              >
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Full Name"
                    name="name"
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email Address"
                    name="email"
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Subject"
                    name="title"
                    required
                  />
                </div>
                <div className="form-group">
                  <textarea
                    className="form-control"
                    rows="5"
                    placeholder="Message"
                    name="message"
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">
                  Send Message
                </button>
              </form>
            </div>
          </div>
          <div className="col-lg-6" style={{ height: "400px" }} >

            <div className="map shadow" style={{ height: "100%" }}>
              <MapContainer center={position} zoom={16} style={{ height: "400px", width: "100%" }}>
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://carto.com/">CartoDB</a> contributors'
                />

                <Marker position={position} icon={customMarker}>
                  <Popup>GearZone</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </div>
        <div className="footer text-center mt-4 p-3 bg-light">
          <p>
            <strong>Address:</strong> 19 Nguyen Huu Tho, Tan Phong Ward, District 7, HCM City, Vietnam
          </p>
          <p>
            <strong>Phone:</strong> +1235 2355 98
          </p>
          <p>
            <strong>Email:</strong> ngochithuan.dev@gmail.com
          </p>
          <p>
            <strong>Website:</strong> gearzone.com
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact_body;
