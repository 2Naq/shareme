import React, { Suspense } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { routeConfig } from './routes/routesConfig';
import Page404 from './components/page-404';
import SvgLoading from './components/loading';

function App() {
  return (
    <Router>
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center w-screen h-screen bg-background gap-2">
          <SvgLoading />
          <span className="font-medium text-primary">Loading...</span>
        </div>
      }>
        <Routes>
          <Route path="/" element={<Navigate to="/tool" replace />} />
          {routeConfig.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
          {/* Catch-all 404 route */}
          <Route path="*" element={<Page404 />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
