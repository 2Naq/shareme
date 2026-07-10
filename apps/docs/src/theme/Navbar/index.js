import React from 'react';
import Navbar from '@theme-original/Navbar';

export default function NavbarWrapper(props) {
  return (
    <>
      <style>{`
               .navbar {
                 background-color: rgba(255, 255, 255, 0.6) !important;
                 backdrop-filter: blur(12px) saturate(180%);
                 -webkit-backdrop-filter: blur(12px) saturate(180%);
                 border-bottom: 1px solid rgba(255, 255, 255, 0.3);
                 box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05) !important;
               }
               html[data-theme='dark'] .navbar {
                 background-color: rgba(10, 10, 10, 0.5) !important;
                 border-bottom: 1px solid rgba(255, 255, 255, 0.05);
               }
             `}</style>
      <Navbar {...props} />
    </>
  );
}
