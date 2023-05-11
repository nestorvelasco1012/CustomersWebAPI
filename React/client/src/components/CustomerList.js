import React, { useEffect, useState } from "react";
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../services/api";
import "./CustomerList.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const CustomerList = () => {
  // State variables
  const [serverStatus, setServerStatus] = useState("online");
  const [serverStatusMessage, setServerStatusMessage] = useState(""); // New state variable for server status message
  const [isServerOnline, setIsServerOnline] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerAddress, setNewCustomerAddress] = useState("");
  const [newCustomerCity, setNewCustomerCity] = useState("");
  const [newCustomerState, setNewCustomerState] = useState("");
  const [newCustomerZip, setNewCustomerZip] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [showPopover, setShowPopover] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Fetch customers on component mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Fetch customers from API
  const fetchCustomers = async () => {
    try {
      const data = await getCustomers();
      if (Array.isArray(data)) {
        setCustomers(data);
        setServerStatus("online");
        setIsServerOnline(true);
        setServerStatusMessage("");
      } else {
        console.error("Invalid response format");
        setServerStatus("offline");
        setIsServerOnline(false);
        setServerStatusMessage("Server is currently down. Please try again later.");
      }
    } catch (error) {
      console.error("Error:", error);
      setServerStatus("offline");
      setIsServerOnline(false);
      setServerStatusMessage("Server is currently down. Please try again later.");
    }
  };
  

  // Form validation
  const validateForm = () => {
    const errors = {};

    if (!newCustomerName.trim()) {
      errors.name = "Name is required";
    }

    if (!newCustomerAddress.trim()) {
      errors.address = "Address is required";
    }

    if (!newCustomerCity.trim()) {
      errors.city = "City is required";
    }

    if (!newCustomerState.trim()) {
      errors.state = "State is required";
    }

    if (!newCustomerZip.trim()) {
      errors.zip = "ZIP is required";
    } else if (!/^\d{5}$/.test(newCustomerZip.trim())) {
      errors.zip = "ZIP code must be 5 digits";
    }

    setValidationErrors(errors);

    return Object.keys(errors).length === 0;
  };

  // Create a new customer
  const createNewCustomer = (e) => {
    e.preventDefault(); // Prevent form submission
  
    const newCustomer = {
      name: newCustomerName,
      address: newCustomerAddress,
      city: newCustomerCity,
      state: newCustomerState,
      zip: newCustomerZip,
    };
  
    const isValid = validateForm();
  
    if (!isValid) {
      return; // Don't proceed if there are validation errors
    }

  
    createCustomer(newCustomer)
      .then((response) => {
        if (response.ok) {
          fetchCustomers();
          setNewCustomerName("");
          setNewCustomerAddress("");
          setNewCustomerCity("");
          setNewCustomerState("");
          setNewCustomerZip("");
          setValidationErrors({});
          setSelectedCustomerId(null); // Reset selected customer ID
          setShowPopover(false); // Close the form
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  


  // Delete an existing customer
  const deleteExistingCustomer = async (customerId) => {
    try {
      const response = await deleteCustomer(customerId);
      if (response.ok) {
        fetchCustomers();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Edit an existing customer
  const handleEditCustomer = (customerId) => {
    const selectedCustomer = customers.find(
      (customer) => customer.customerID === customerId
    );
    if (selectedCustomer) {
      setNewCustomerName(selectedCustomer.name);
      setNewCustomerAddress(selectedCustomer.address);
      setNewCustomerCity(selectedCustomer.city);
      setNewCustomerState(selectedCustomer.state);
      setNewCustomerZip(selectedCustomer.zip);
      setSelectedCustomerId(customerId);
    }
  };

  // Cancel adding a new customer
  const handleCancelAdd = () => {
    setNewCustomerName("");
    setNewCustomerAddress("");
    setNewCustomerCity("");
    setNewCustomerState("");
    setNewCustomerZip("");
    setValidationErrors({});
    setShowPopover(false);
  };

  // Cancel editing an existing customer
  const handleCancelEdit = () => {
    setSelectedCustomerId(null);
    setNewCustomerName("");
    setNewCustomerAddress("");
    setNewCustomerCity("");
    setNewCustomerState("");
    setNewCustomerZip("");
    setShowPopover(false);
    setValidationErrors({});
  };

  // Update an existing customer
  const handleUpdateCustomer = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      const updatedCustomer = {
        name: newCustomerName,
        address: newCustomerAddress,
        city: newCustomerCity,
        state: newCustomerState,
        zip: newCustomerZip,
      };

      try {
        const response = await updateCustomer(
          selectedCustomerId,
          updatedCustomer
        );
        if (response.ok) {
          fetchCustomers();
          setSelectedCustomerId(null);
          setNewCustomerName("");
          setNewCustomerAddress("");
          setNewCustomerCity("");
          setNewCustomerState("");
          setNewCustomerZip("");
          setValidationErrors({});
          setShowPopover(false);
        } else {
          console.error("Failed to update customer");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  // Open the popover for adding a new customer
  const openPopover = () => {
    setShowPopover(true);
  };

  return (
    <div id="container">
      <h1>Customer List</h1>
      {serverStatus === "offline" && (
        <div className="server-status-message">{serverStatusMessage}</div>
      )}
      <table>
        {/* Table headers */}
        <thead>
          <tr>
            <th>Customer ID</th>
            <th>Name</th>
            <th>Address</th>
            <th>City</th>
            <th>State</th>
            <th>ZIP</th>
            <th>Actions</th>
          </tr>
        </thead>
        {/* Table body */}
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.customerID}>
              <td>{customer.customerID}</td>
              <td>{customer.name}</td>
              <td>{customer.address}</td>
              <td>{customer.city}</td>
              <td>{customer.state}</td>
              <td>{customer.zip}</td>
              <td>
                <button
                  className="update-button"
                  onClick={() => handleEditCustomer(customer.customerID)}
                >
                  <FontAwesomeIcon icon={faPencilAlt} />
                </button>
                <button
                  className="delete-button"
                  onClick={() => deleteExistingCustomer(customer.customerID)}
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

{/* Add customer button */}
<div className="add-customer-button">
  <button onClick={openPopover} disabled={!isServerOnline}>
    Add Customer
  </button>
</div>


      {/* Add customer form */}
      {showPopover && (
        <div id="modal">
          <div id="modalContent">
            <h2 id="modalTitle">Add New Customer</h2>
            <form onSubmit={createNewCustomer}>
              {/* Name input */}
              <label htmlFor="newName">Name:</label>
              <input
                type="text"
                id="newName"
                value={newCustomerName}
                onChange={(e) => setNewCustomerName(e.target.value)}
              />
              {validationErrors.name && (
                <span className="error-message">{validationErrors.name}</span>
              )}

              {/* Address input */}
              <label htmlFor="newAddress">Address:</label>
              <input
                type="text"
                id="newAddress"
                value={newCustomerAddress}
                onChange={(e) => setNewCustomerAddress(e.target.value)}
              />
              {validationErrors.address && (
                <span className="error-message">{validationErrors.address}</span>
              )}

              {/* City input */}
              <label htmlFor="newCity">City:</label>
              <input
                type="text"
                id="newCity"
                value={newCustomerCity}
                onChange={(e) => setNewCustomerCity(e.target.value)}
              />
              {validationErrors.city && (
                <span className="error-message">{validationErrors.city}</span>
              )}

              {/* State input */}
              <label htmlFor="newState">State:</label>
              <input
                type="text"
                id="newState"
                value={newCustomerState}
                onChange={(e) => setNewCustomerState(e.target.value)}
              />
              {validationErrors.state && (
                <span className="error-message">{validationErrors.state}</span>
              )}

              {/* ZIP input */}
              <label htmlFor="newZip">ZIP:</label>
              <input
                type="text"
                id="newZip"
                value={newCustomerZip}
                onChange={(e) => setNewCustomerZip(e.target.value)}
              />
              {validationErrors.zip && (
                <span className="error-message">{validationErrors.zip}</span>
              )}

              {/* Modal buttons */}
              <div className="modal-buttons">
                <button type="submit">Create</button>
                <button onClick={handleCancelAdd}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit customer form */}
      {selectedCustomerId && (
        <div id="modal">
          <div id="modalContent">
            <h2 id="modalTitle">Edit Customer</h2>
            <form onSubmit={handleUpdateCustomer}>
              {/* Name input */}
              <label htmlFor="editName">Name:</label>
              <input
                type="text"
                id="editName"
                value={newCustomerName}
                onChange={(e) => setNewCustomerName(e.target.value)}
              />
              {validationErrors.name && (
                <span className="error-message">{validationErrors.name}</span>
              )}

              {/* Address input */}
              <label htmlFor="editAddress">Address:</label>
              <input
                type="text"
                id="editAddress"
                value={newCustomerAddress}
                onChange={(e) => setNewCustomerAddress(e.target.value)}
              />
              {validationErrors.address && (
                <span className="error-message">{validationErrors.address}</span>
              )}

              {/* City input */}
              <label htmlFor="editCity">City:</label>
              <input
                type="text"
                id="editCity"
                value={newCustomerCity}
                onChange={(e) => setNewCustomerCity(e.target.value)}
              />
              {validationErrors.city && (
                <span className="error-message">{validationErrors.city}</span>
              )}

              {/* State input */}
              <label htmlFor="editState">State:</label>
              <input
                type="text"
                id="editState"
                value={newCustomerState}
                onChange={(e) => setNewCustomerState(e.target.value)}
              />
              {validationErrors.state && (
                <span className="error-message">{validationErrors.state}</span>
              )}

              {/* ZIP input */}
              <label htmlFor="editZip">ZIP:</label>
              <input
                type="text"
                id="editZip"
                value={newCustomerZip}
                onChange={(e) => setNewCustomerZip(e.target.value)}
              />
              {validationErrors.zip && (
                <span className="error-message">{validationErrors.zip}</span>
              )}

              {/* Modal buttons */}
              <div className="modal-buttons">
                <button type="submit">Update</button>
                <button onClick={handleCancelEdit}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerList;


