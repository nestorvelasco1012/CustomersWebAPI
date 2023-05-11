using System;
using System.Collections.Generic;
using System.Data;
using System.Data.OleDb;
using Microsoft.AspNetCore.Mvc;
using Task1.Data;

namespace Task1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly string _connectionString;
        private readonly ILogger<CustomersController> _logger;

        public CustomersController(ILogger<CustomersController> logger)
        {
            _logger = logger;

            // Set the path to the CustomerDb.mdb file
            var dataFolderPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "..", "..", "..", "Data");
            var dbPath = Path.Combine(dataFolderPath, "CustomersDb.mdb");

            // Set the connection string for the OleDbConnection
            _connectionString = $"Provider=Microsoft.ACE.OLEDB.12.0;Data Source={dbPath}";
            _logger.LogInformation($"Base Path: {dataFolderPath}");
        }


        [HttpGet]
        public IActionResult GetCustomers()
        {
            using (OleDbConnection connection = new OleDbConnection(_connectionString))
            {
                string query = "SELECT * FROM Customers";

                // Open the connection to the database
                connection.Open();

                // Create a command object with the query and connection
                OleDbCommand command = new OleDbCommand(query, connection);

                using (OleDbDataReader reader = command.ExecuteReader())
                {
                    List<Customer> customers = new List<Customer>();
                    while (reader.Read())
                    {
                        // Create a new Customer object and populate its properties from the reader
                        Customer customer = new Customer
                        {
                            CustomerID = Convert.ToInt32(reader["CustomerID"]),
                            Name = reader["Name"].ToString(),
                            Address = reader["Address"].ToString(),
                            City = reader["City"].ToString(),
                            State = reader["State"].ToString(),
                            Zip = reader["Zip"].ToString()
                        };
                        customers.Add(customer);
                    }

                    // Return the list of customers as an OK response
                    return Ok(customers);
                }
            }
        }

        [HttpGet("{id}")]
        public IActionResult GetCustomer(int id)
        {
            using (OleDbConnection connection = new OleDbConnection(_connectionString))
            {
                string query = "SELECT * FROM Customers WHERE CustomerID = @id";

                // Create a command object with the query and connection
                OleDbCommand command = new OleDbCommand(query, connection);
                command.Parameters.AddWithValue("@id", id);

                // Open the connection to the database
                connection.Open();

                OleDbDataReader reader = command.ExecuteReader();
                if (reader.Read())
                {
                    // Create a new Customer object and populate its properties from the reader
                    Customer customer = new Customer
                    {
                        CustomerID = Convert.ToInt32(reader["CustomerID"]),
                        Name = reader["Name"].ToString(),
                        Address = reader["Address"].ToString(),
                        City = reader["City"].ToString(),
                        State = reader["State"].ToString(),
                        Zip = reader["Zip"].ToString()
                    };
                    // Return the customer object as an OK response
                    return Ok(customer);
                }
                else
                {
                    // If the customer with the specified id is not found, return a NotFound response
                    return NotFound();
                }
            }
        }

        [HttpPost]
        public IActionResult CreateCustomer(Customer customer)
        {
            using (OleDbConnection connection = new OleDbConnection(_connectionString))
            {
                string query = "INSERT INTO Customers (Name, Address, City, State, Zip) VALUES (@name, @address, @city, @state, @zip)";

                // Create a command object with the query and connection
                OleDbCommand command = new OleDbCommand(query, connection);
                command.Parameters.AddWithValue("@name", customer.Name);
                command.Parameters.AddWithValue("@address", customer.Address);
                command.Parameters.AddWithValue("@city", customer.City);
                command.Parameters.AddWithValue("@state", customer.State);
                command.Parameters.AddWithValue("@zip", customer.Zip);

                // Open the connection to the database
                connection.Open();

                // Execute the command and get the number of rows affected
                int rowsAffected = command.ExecuteNonQuery();

                if (rowsAffected > 0)
                {
                    // If at least one row is affected, return an OK response
                    return Ok();
                }
                else
                {
                    // If no rows are affected, return a BadRequest response
                    return BadRequest();
                }
            }
        }

        [HttpPut("{id}")]
        public IActionResult UpdateCustomer(int id, Customer customer)
        {
            using (OleDbConnection connection = new OleDbConnection(_connectionString))
            {
                string query = "UPDATE Customers SET Name = @name, Address = @address, City = @city, State = @state, Zip = @zip WHERE CustomerID = @id";

                // Create a command object with the query and connection
                OleDbCommand command = new OleDbCommand(query, connection);
                command.Parameters.AddWithValue("@name", customer.Name);
                command.Parameters.AddWithValue("@address", customer.Address);
                command.Parameters.AddWithValue("@city", customer.City);
                command.Parameters.AddWithValue("@state", customer.State);
                command.Parameters.AddWithValue("@zip", customer.Zip);
                command.Parameters.AddWithValue("@id", id);

                // Open the connection to the database
                connection.Open();

                // Execute the command and get the number of rows affected
                int rowsAffected = command.ExecuteNonQuery();

                if (rowsAffected > 0)
                {
                    // If at least one row is affected, return an OK response
                    return Ok();
                }
                else
                {
                    // If no rows are affected, return a BadRequest response
                    return BadRequest();
                }
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteCustomer(int id)
        {
            using (OleDbConnection connection = new OleDbConnection(_connectionString))
            {
                string query = "DELETE FROM Customers WHERE CustomerID = @id";

                // Create a command object with the query and connection
                OleDbCommand command = new OleDbCommand(query, connection);
                command.Parameters.AddWithValue("@id", id);

                // Open the connection to the database
                connection.Open();

                // Execute the command and get the number of rows affected
                int rowsAffected = command.ExecuteNonQuery();

                if (rowsAffected > 0)
                {
                    // If at least one row is affected, return an OK response
                    return Ok();
                }
                else
                {
                    // If no rows are affected, return a NotFound response
                    return NotFound();
                }
            }
        }
    }
}
