import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import PersonaCreator from './components/personas/PersonaCreator';
import FunnelBuilder from './components/funnel/FunnelBuilder';
import FunnelPage from './pages/FunnelPage';
import InsightsPage from './pages/InsightsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <MainLayout>
            <Dashboard />
          </MainLayout>
        } />
        <Route path="/personas/new" element={
          <MainLayout>
            <PersonaCreator />
          </MainLayout>
        } />
        <Route path="/funnels/new" element={
          <MainLayout>
            <FunnelBuilder />
          </MainLayout>
        } />
        <Route path="/funnels/:id" element={
          <MainLayout>
            <FunnelPage />
          </MainLayout>
        } />
        <Route path="/funnels/:id/insights" element={
          <MainLayout>
            <InsightsPage />
          </MainLayout>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;