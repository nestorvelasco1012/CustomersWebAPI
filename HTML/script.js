$(document).ready(function () {
  // Function to retrieve all customers
  function getCustomers() {
    $.ajax({
      url: 'https://localhost:7120/api/customers',
      type: 'GET',
      dataType: 'json',
      success: function (data) {
        // Clear existing customer records
        $('#customerTable tbody').empty();

        // Iterate through the returned data and add customers to the table
        $.each(data, function (index, customer) {
          var row = '<tr>' +
            '<td>' + customer.customerID + '</td>' +
            '<td>' + customer.name + '</td>' +
            '<td>' + customer.address + '</td>' +
            '<td>' + customer.city + '</td>' +
            '<td>' + customer.state + '</td>' +
            '<td>' + customer.zip + '</td>' +
            '<td>' +
            '<button class="btnEdit" data-id="' + customer.customerID + '">Edit</button>' +
            '<button class="btnDelete" data-id="' + customer.customerID + '">X</button>' +
            '</td>' +
            '</tr>';

          $('#customerTable tbody').append(row);
        });
      },
      error: function (xhr, status, error) {
        console.log('Error: ' + error);
      }
    });
  }

  // Function to handle form submission for adding/updating a customer
  function saveCustomer() {
    var customerId = $('#customerId').val();
    var name = $('#name').val();
    var address = $('#address').val();
    var city = $('#city').val();
    var state = $('#state').val();
    var zip = $('#zip').val();

    // Perform client-side validation
    var isValid = true;
    if (!name) {
      isValid = false;
      $('#name').addClass('error');
    } else {
      $('#name').removeClass('error');
    }
    if (!city) {
      isValid = false;
      $('#city').addClass('error');
    } else {
      $('#city').removeClass('error');
    }
    if (!state || state.length !== 2) {
      isValid = false;
      $('#state').addClass('error');
    } else {
      $('#state').removeClass('error');
    }
    if (!zip || !/^\d{5}$/.test(zip)) {
      isValid = false;
      $('#zip').addClass('error');
    } else {
      $('#zip').removeClass('error');
    }

    if (!isValid) {
      return;
    }

    var customer = {
      name: name,
      address: address,
      city: city,
      state: state,
      zip: zip
    };

    var url = 'https://localhost:7120/api/customers';
    var method = 'POST';

    if (customerId) {
      // If customer ID exists, it means we're updating an existing customer
      url += '/' + customerId;
      method = 'PUT';
    }

    // Show loading spinner
    $('#loadingSpinner').show();

    $.ajax({
      url: url,
      type: method,
      contentType: 'application/json',
      data: JSON.stringify(customer),
      success: function () {
        $('#modal').hide();
        getCustomers();
        // Hide loading spinner
        $('#loadingSpinner').hide();
      },
      error: function (xhr, status, error) {
        // Display error message in modal when server is down
        var errorMessage = 'Server is down. Please try again later.';
        displayErrorMessage(errorMessage);
        // Hide loading spinner
        $('#loadingSpinner').hide();
      }
    });
  }

  // Function to display an error message in the modal
  function displayErrorMessage(errorMessage) {
    $('#modalTitle').text('Error');
    var errorContent = '<div class="alert alert-danger" style="text-align: center;">' + errorMessage + '</div>';
    errorContent += '<div style="text-align: center;"><button id="btnRefresh" class="btn btn-primary">Refresh</button></div>';
    $('#modalContent').html(errorContent);

    // Attach click event handler to the refresh button
    $(document).on('click', '#btnRefresh', function () {
      location.reload(); // Refresh the page
    });
  }




  // Function to handle the "Add Customer" button click event
  $('#btnAddCustomer').click(function () {
    $('#modalTitle').text('Add Customer');
    $('#customerId').val('');
    $('#name').val('');
    $('#address').val('');
    $('#city').val('');
    $('#state').val('');
    $('#zip').val('');
    $('#modal').show();
  });

  // Function to handle the "Edit" button click event
  $(document).on('click', '.btnEdit', function () {
    var customerId = $(this).data('id');
    $('#modalTitle').text('Edit Customer');

    // Fetch the customer details based on customer ID
    $.ajax({
      url: 'https://localhost:7120/api/customers/' + customerId,
      type: 'GET',
      dataType: 'json',
      success: function (data) {
        $('#customerId').val(data.customerID);
        $('#name').val(data.name);
        $('#address').val(data.address);
        $('#city').val(data.city);
        $('#state').val(data.state);
        $('#zip').val(data.zip);
        $('#modal').show();
      },
      error: function (xhr, status, error) {
        console.log('Error: ' + error);
      }
    });
  });

  // Function to handle the "Delete" button click event
  $(document).on('click', '.btnDelete', function () {
    var customerId = $(this).data('id');

    if (confirm('Are you sure you want to delete this customer?')) {
      $.ajax({
        url: 'https://localhost:7120/api/customers/' + customerId,
        type: 'DELETE',
        success: function () {
          getCustomers();
        },
        error: function (xhr, status, error) {
          console.log('Error: ' + error);
        }
      });
    }
  });

  // Function to handle the form submission
  $('#customerForm').submit(function (e) {
    e.preventDefault();
    saveCustomer();
  });

  // Function to handle the "Cancel" button click event
  $('#btnCancel').click(function () {
    $('#modal').hide();
  });

  // Call the getCustomers() function to populate the table with initial data
  getCustomers();
});

