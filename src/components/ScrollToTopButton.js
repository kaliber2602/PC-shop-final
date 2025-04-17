import React, { useState, useEffect } from "react";
import { AiOutlineArrowUp } from "react-icons/ai";
import "./ScrollToTopButton.css"
const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 200) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <button
            onClick={scrollToTop}
            className={`scroll-to-top ${isVisible ? "show" : ""}`}
        >
            <AiOutlineArrowUp size={30} />
        </button>
    );
};

export default ScrollToTopButton;
