import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App.jsx";                     
import Login from "./Pages/login.jsx";           
import Signup from "./Pages/signup.jsx";          
import InvestorDashboard from "./Pages/InvestorDashboard.jsx";
import InvestorFeed from "./Pages/InvestorFeed.jsx";
import InvestorProfile from "./Pages/InvestorProfile.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />   

      <Route path="/investor-dashboard" element={<InvestorDashboard />} />
      <Route path="/investor-feed" element={<InvestorFeed />} />
      <Route path="/investor-profile" element={<InvestorProfile />} />
    </Routes>
  </BrowserRouter>
);
