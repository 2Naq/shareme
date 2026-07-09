import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { routeConfig } from './routes/routesConfig';
import Page404 from './components/page-404';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/tool" replace />} />
        {routeConfig.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
        {/* Catch-all 404 route */}
        <Route path="*" element={<Page404 />} />
      </Routes>
    </Router>
  );
}

export default App;
