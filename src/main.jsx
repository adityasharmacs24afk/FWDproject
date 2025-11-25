import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App.jsx";                       // Landing page
import Login from "./Pages/login.jsx";             // Login page
import InvestorDashboard from "./Pages/InvestorDashboard.jsx"; 
import InvestorFeed from "./Pages/InvestorFeed.jsx";// Dashboard page
import InvestorProfile from "./Pages/InvestorProfile.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/investor-dashboard" element={<InvestorDashboard />} />
      <Route path="/investor-feed" element={<InvestorFeed/>}/>
      <Route path="/investor-profile" element={<InvestorProfile/>}/>

    </Routes>
  </BrowserRouter>
);
