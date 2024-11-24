import React, { useState } from "react";
import "./Sidebar.css";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            {/* Toggle Button for Smaller Screens */}
            <button className="toggle-btn" onClick={toggleSidebar}>
                {isOpen ? "Close" : "Menu"}
            </button>

            {/* Sidebar */}
            <div className={`sidebar bg-light ${isOpen ? "open" : ""}`}>
                <div className="logo text-center py-4">
                    <h3 className="text-primary">|||</h3>
                </div>
                <ul className="menu flex-column">
                    <li className="menu-item">
                        <a href="#phones" className="menu-link">
                            <img
                                src="https://img.icons8.com/?size=100&id=sj19MBmo6i8I&format=png&color=000000"
                                alt="Phones"
                                className="icon me-2"
                            />
                            Phones
                        </a>
                    </li>
                    <li className="menu-item">
                        <a href="#laptops" className="menu-link">
                            <img
                                src="https://img.icons8.com/?size=100&id=TyTYv8m8QM3F&format=png&color=000000"
                                alt="Headphones"
                                className="icon me-2"
                            />
                            Headphones
                        </a>
                    </li>
                    <li className="menu-item">
                        <a href="#earpods" className="menu-link">
                            <img
                                src="https://img.icons8.com/?size=100&id=V3pJPbqyDapE&format=png&color=000000"
                                alt="Earpods"
                                className="icon me-2"
                            />
                            Earpods
                        </a>
                    </li>
                    <li className="menu-item">
                        <a href="#laptops" className="menu-link">
                            <img
                                src="https://img.icons8.com/?size=100&id=111462&format=png&color=000000"
                                alt="Laptops"
                                className="icon me-2"
                            />
                            Laptops
                        </a>
                    </li>
                    <li className="menu-item">
                        <a href="#tvs" className="menu-link">
                            <img
                                src="https://img.icons8.com/?size=100&id=1Pp9bo7ydgBz&format=png&color=000000"
                                alt="TVs"
                                className="icon me-2"
                            />
                            TVs
                        </a>
                    </li>
                    <li className="menu-item">
                        <a href="#accessories" className="menu-link">
                            <img
                                src="https://img.icons8.com/?size=100&id=SjH3zudGANJO&format=png&color=000000"
                                alt="Accessories"
                                className="icon me-2"
                            />
                            Accessories
                        </a>
                    </li>
                    <li className="menu-item">
                        <a href="#favorites" className="menu-link">
                            <img
                                src="https://img.icons8.com/?size=100&id=l9trdXxo7NeA&format=png&color=000000"
                                alt="Favorites"
                                className="icon me-2"
                            />
                            Favorites
                        </a>
                    </li>
                    <li className="menu-item">
                        <a href="#cart" className="menu-link">
                            <img
                                src="https://img.icons8.com/?size=100&id=CE7rP-35_XQR&format=png&color=000000"
                                alt="Cart"
                                className="icon me-2"
                            />
                            Cart
                        </a>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default Sidebar;

