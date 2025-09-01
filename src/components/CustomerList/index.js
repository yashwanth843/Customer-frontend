import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./index.css";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);

  const fetchCustomers = async () => {
    const res = await fetch("https://customerserver-2tj6.onrender.com/api/customers");
    const data = await res.json();
    const customersWithAddresses = await Promise.all(
      data.data.map(async (cust) => {
        const addrRes = await fetch(`https://customerserver-2tj6.onrender.com/api/customers/${cust.id}/addresses`);
        const addrData = await addrRes.json();
        return { ...cust, addresses: addrData.data };
      })
    );
    setCustomers(customersWithAddresses);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this customer?")) {
      await fetch(`https://customerserver-2tj6.onrender.com/api/customers/${id}`, { method: "DELETE" });
      fetchCustomers();
    }
  };

  useEffect(() => { fetchCustomers(); }, []);

  return (
    <div className="customer-list">
      <Link to="/add" className="add-btn">Add Customer</Link>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Addresses</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(c => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.first_name} {c.last_name}</td>
              <td>{c.phone_number}</td>
              <td>
                {c.addresses.map(a => (
                  <div key={a.id} className="address-item">
                    {a.address_details}, {a.city}, {a.state}, {a.pin_code}
                  </div>
                ))}
              </td>
              <td>
                <Link to={`/edit/${c.id}`} className="btn">Edit</Link>
                <button onClick={() => handleDelete(c.id)} className="btn delete">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerList;
