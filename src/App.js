import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CustomerList from "./components/CustomerList";
import CustomerForm from "./components/CustomerForm";

function App() {
  return (
    <Router>
      <div className="app-container">
        <h1>Customer Management System</h1>
        <Routes>
          <Route path="/" element={<CustomerList />} />
          <Route path="/add" element={<CustomerForm />} />
          <Route path="/edit/:id" element={<CustomerForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
