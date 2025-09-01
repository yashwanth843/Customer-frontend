import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./index.css";

const CustomerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({ first_name: "", last_name: "", phone_number: "" });
  const [addresses, setAddresses] = useState([{ address_details: "", city: "", state: "", pin_code: "" }]);

  useEffect(() => {
    if (id) {
      fetch(`https://customerserver-2tj6.onrender.com/api/customers/${id}`)
        .then(res => res.json())
        .then(data => setCustomer(data.data));

      fetch(`https://customerserver-2tj6.onrender.com/api/customers/${id}/addresses`)
        .then(res => res.json())
        .then(data => setAddresses(data.data.length ? data.data : [{ address_details: "", city: "", state: "", pin_code: "" }]));
    }
  }, [id]);

  const handleCustomerChange = e => setCustomer({ ...customer, [e.target.name]: e.target.value });
  const handleAddressChange = (index, e) => {
    const newAddresses = [...addresses];
    newAddresses[index][e.target.name] = e.target.value;
    setAddresses(newAddresses);
  };

  const addAddressField = () => setAddresses([...addresses, { address_details: "", city: "", state: "", pin_code: "" }]);
  const removeAddressField = (index) => setAddresses(addresses.filter((_, i) => i !== index));

  const handleSubmit = async e => {
    e.preventDefault();
    let customerId = id;

    if (id) {
      await fetch(`https://customerserver-2tj6.onrender.com/api/customers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customer),
      });
    } else {
      const res = await fetch("https://customerserver-2tj6.onrender.com/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customer),
      });
      const data = await res.json();
      customerId = data.id;
    }

    for (const addr of addresses) {
      if (addr.id) {
        await fetch(`https://customerserver-2tj6.onrender.com/api/addresses/${addr.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(addr),
        });
      } else {
        await fetch(`https://customerserver-2tj6.onrender.com/api/customers/${customerId}/addresses`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(addr),
        });
      }
    }

    navigate("/");
  };

  return (
    <div className="customer-form">
      <h2>{id ? "Edit Customer" : "Add Customer"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="customer-details">
          <h3>Customer Info</h3>
          <input name="first_name" placeholder="First Name" value={customer.first_name} onChange={handleCustomerChange} required />
          <input name="last_name" placeholder="Last Name" value={customer.last_name} onChange={handleCustomerChange} required />
          <input name="phone_number" placeholder="Phone Number" value={customer.phone_number} onChange={handleCustomerChange} required />
        </div>

        <div className="addresses-section">
          <h3>Addresses</h3>
          {addresses.map((addr, index) => (
            <div key={index} className="address-field">
              <input name="address_details" placeholder="Address" value={addr.address_details} onChange={e => handleAddressChange(index, e)} required />
              <input name="city" placeholder="City" value={addr.city} onChange={e => handleAddressChange(index, e)} required />
              <input name="state" placeholder="State" value={addr.state} onChange={e => handleAddressChange(index, e)} required />
              <input name="pin_code" placeholder="Pin Code" value={addr.pin_code} onChange={e => handleAddressChange(index, e)} required />
              {addresses.length > 1 && <button type="button" onClick={() => removeAddressField(index)} className="remove-btn">Remove</button>}
            </div>
          ))}
          <button type="button" onClick={addAddressField} className="add-address-btn">Add Another Address</button>
        </div>

        <button type="submit" className="submit-btn">{id ? "Update Customer" : "Create Customer"}</button>
      </form>
    </div>
  );
};

export default CustomerForm;
