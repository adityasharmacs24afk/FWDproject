import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App.jsx";                // your landing page component
import Login from "./Pages/login.jsx";      // adjust path if your login file is elsewhere

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      {/* optional: add signup route if you have it */}
      {/* <Route path="/signup" element={<Signup />} /> */}
    </Routes>
  </BrowserRouter>
);
