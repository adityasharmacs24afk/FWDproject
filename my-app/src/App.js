import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signin from './Signin';
import SignupFounder from './SignupFounder';
import SignupInvestor from './SignupInvestor';
import FounderDashboard from './FounderDashboard';
import InvestorDashboard from './InvestorDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/signup/founder" element={<SignupFounder />} />
        <Route path="/signup/investor" element={<SignupInvestor />} />
        <Route path="/dashboard/founder" element={<FounderDashboard />} />
        <Route path="/dashboard/investor" element={<InvestorDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
