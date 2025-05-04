import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faExclamationCircle,
  faSkullCrossbones,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import "./ToastNotification.css";

const ToastNotification = ({ type, message, onClose, duration }) => {
  const [isVisible, setIsVisible] = useState(true);

  const icons = {
    success: faCheckCircle,
    warning: faExclamationCircle,
    danger: faSkullCrossbones,
  };

  const icon = icons[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose(); // Auto remove toast after duration
    }, duration);

    return () => clearTimeout(timer); // Cleanup on unmount
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    onClose(); // Manually close when clicked
  };

  if (!isVisible) return null;

  return (
    <div className={`toast_message toast--${type}`}>
      <div className="toast_icon">
        <FontAwesomeIcon icon={icon} />
      </div>
      <div className="toast_body">
        <div className="title">Notification</div>
        <p className="msg">{message}</p>
      </div>
      <div className="toast_close" onClick={handleClose}>
        <FontAwesomeIcon icon={faTimes} />
      </div>
    </div>
  );
};

export default ToastNotification;
