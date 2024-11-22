import { useEffect } from "react";
import {  useNavigate } from "react-router-dom";
import Navbar from './Navbar'

const ProtectedWrapper = ({ children }) => {
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem('token') && localStorage.getItem('user');

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/");
        }
    }, [navigate, isAuthenticated]);

    if (!isAuthenticated) {
        return null; // Prevent rendering the Navbar or children
    }

    return (
        <div className="px-14">
            <div className="flex">
                <Navbar />
            </div>
            {children}
        </div>
    );
};

export default ProtectedWrapper;
