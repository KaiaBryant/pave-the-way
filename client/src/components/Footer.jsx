import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <p className="footer-description">footer description</p>
            <div className="footer-link-container">
                <h2 className="footer-link-container_title">Links</h2>
                <Link to="/" className="footer-link">
                    Home
                </Link>
                <Link to="/survey" className="footer-link">
                    Survey
                </Link>
                <Link to="/register" className="footer-link">
                    Register
                </Link>
                <Link to="/login" className="footer-link">
                    Login
                </Link>
            </div>
        </footer>
    );
}