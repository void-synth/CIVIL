/**
 * Main App Component
 * 
 * Routes:
 * - / : Create record form
 * - /verify/:recordId : Public verification view (no login required)
 * 
 * Design decisions:
 * - Simple routing for create and verify flows
 * - Public verification (no auth required)
 * - Clear separation between create and verify
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { CreateRecordPage } from './pages/CreateRecord';
import { VerifyRecord } from './pages/VerifyRecord';
import { MemoriesPage } from './pages/Memories';
import { CreateMemoryPage } from './pages/CreateMemory';
import { MilestonesPage } from './pages/Milestones';
import { PosthumousDeliveryPage } from './pages/PosthumousDelivery';
import { MemoryDetailPage } from './pages/MemoryDetail';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create" element={<CreateRecordPage />} />
          <Route path="/verify/:recordId" element={<VerifyRecord />} />
          <Route path="/memories" element={<MemoriesPage />} />
          <Route path="/memories/create" element={<CreateMemoryPage />} />
          <Route path="/memories/:id" element={<MemoryDetailPage />} />
          <Route path="/milestones" element={<MilestonesPage />} />
          <Route path="/posthumous" element={<PosthumousDeliveryPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
