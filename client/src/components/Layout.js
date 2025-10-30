/**
 * Layout Component
 * Main layout with navbar and anime assistant
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import AnimeAssistant from './AnimeAssistant';
import './Layout.css';

const Layout = () => {
  return (
    <div className="layout">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <AnimeAssistant />
    </div>
  );
};

export default Layout;
