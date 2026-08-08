import React, { Suspense } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { routeConfig } from "./routes/routesConfig";
import Page404 from "./components/page-404";
import SvgLoading from "./components/loading";

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Suspense
        fallback={
          <div className="bg-background flex h-screen w-screen flex-col items-center justify-center gap-2">
            <SvgLoading />
            <span className="text-primary font-medium">Loading...</span>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Navigate to="/tools" replace />} />
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
