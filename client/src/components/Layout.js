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
      <footer className="app-footer">
        <p>Created by <strong>DAVID OLIVER J</strong> | URK23CS1305</p>
      </footer>
    </div>
  );
};

export default Layout;
