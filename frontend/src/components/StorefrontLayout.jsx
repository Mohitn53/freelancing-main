import React from 'react';
import { Outlet } from 'react-router-dom';
import TopNavbar from './TopNavbar';
import Navbar from './Navbar';
import Footer from './Footer';

const StorefrontLayout = () => {
    return (
        <div className="app-container">
            <TopNavbar />
            <Navbar />
            <main style={{ minHeight: 'calc(100vh - 120px)' }}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default StorefrontLayout;
