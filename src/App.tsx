import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RootLayout from './components/RootLayout';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CreateProgram from './pages/CreateProgram';
import RegisterClient from './pages/RegisterClient';
import SearchClients from './pages/SearchClients';
import ClientProfile from './pages/ClientProfile';
import EnrollClient from "./pages/EnrollClient.tsx";

function App() {
  return (
    <Router>
      <RootLayout>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/programs/new" element={<CreateProgram />} />
            <Route path="/clients/new" element={<RegisterClient />} />
            <Route path="/clients/search" element={<SearchClients />} />
            <Route path="/clients/:id" element={<ClientProfile />} />
            <Route path="/enrollments/new" element={<EnrollClient />} />
          </Routes>
        </Layout>
      </RootLayout>
    </Router>
  );
}

export default App;