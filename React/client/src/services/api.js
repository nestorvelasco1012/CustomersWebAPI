const API_BASE_URL = "https://localhost:7120/api/customers";

export const getCustomers = async () => {
  try {
    const response = await fetch(API_BASE_URL);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const createCustomer = async (customer) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customer),
    });
    return response;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const updateCustomer = async (customerId, customer) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${customerId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customer),
    });
    return response;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const deleteCustomer = async (customerId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${customerId}`, {
      method: "DELETE",
    });
    return response;
  } catch (error) {
    console.error("Error:", error);
  }
};
