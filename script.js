// Initialize items array
const items = [];

// DOM Elements
const customerNameInput = document.getElementById('customer-name');
const dateTimeInput = document.getElementById('date-time');
const itemNameInput = document.getElementById('item-name');
const itemQuantityInput = document.getElementById('item-quantity');
const itemPriceInput = document.getElementById('item-price');
const itemsTableBody = document.querySelector('#items-table tbody');
const receiptSection = document.getElementById('receipt');
const receiptTableBody = document.querySelector('#receipt-table tbody');
const customerDetails = document.getElementById('customer-details');
const grandTotalElement = document.getElementById('grand-total');

// Set current date and time in the input field
const setDateTime = () => {
  const now = new Date();
  const formattedDate = now.toLocaleString();
  dateTimeInput.value = formattedDate;
};
setDateTime();

// Add an item to the list
const addItem = () => {
  const itemName = itemNameInput.value.trim();
  const itemQuantity = parseInt(itemQuantityInput.value);
  const itemPrice = parseFloat(itemPriceInput.value);

  if (!itemName || isNaN(itemQuantity) || isNaN(itemPrice)) {
    alert('Please fill out all fields correctly.');
    return;
  }

  const total = itemQuantity * itemPrice;
  const item = { name: itemName, quantity: itemQuantity, price: itemPrice, total };
  items.push(item);

  renderItemsTable();
  clearInputs();
};

// Render items table
const renderItemsTable = () => {
  itemsTableBody.innerHTML = '';
  items.forEach((item, index) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>${item.price.toFixed(2)}</td>
      <td>${item.total.toFixed(2)}</td>
      <td><button onclick="deleteItem(${index})">Delete</button></td>
    `;
    itemsTableBody.appendChild(row);
  });
};

// Clear input fields
const clearInputs = () => {
  itemNameInput.value = '';
  itemQuantityInput.value = '';
  itemPriceInput.value = '';
};

// Delete an item
const deleteItem = (index) => {
  items.splice(index, 1);
  renderItemsTable();
};

// Clear all items
const clearAll = () => {
  if (confirm('Are you sure you want to clear all items?')) {
    items.length = 0;
    renderItemsTable();
    receiptSection.style.display = 'none';
  }
};

// Generate receipt
const generateReceipt = () => {
  if (items.length === 0) {
    alert('No items to generate a receipt.');
    return;
  }

  customerDetails.innerHTML = `
    <strong>Customer Name:</strong> ${customerNameInput.value}<br>
    <strong>Date and Time:</strong> ${dateTimeInput.value}
  `;

  receiptTableBody.innerHTML = '';
  let grandTotal = 0;

  items.forEach((item) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>${item.price.toFixed(2)}</td>
      <td>${item.total.toFixed(2)}</td>
    `;
    receiptTableBody.appendChild(row);
    grandTotal += item.total;
  });

  grandTotalElement.textContent = `Grand Total: $${grandTotal.toFixed(2)}`;
  receiptSection.style.display = 'block';
};

// Download receipt as PDF
const downloadReceipt = () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const total = items.reduce((sum, item) => sum + item.total, 0).toFixed(2);

  // Add background color
  doc.setFillColor(240, 255, 240); // Light green
  doc.rect(0, 0, 210, 297, 'F'); // Fill entire page

  // Add logo
  const logoUrl = document.getElementById('logo').src;
  doc.addImage(logoUrl, 'PNG', 90, 10, 30, 30);

  // Center the shop name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(76, 175, 80); // Green color
  doc.text('Durbar Computer', 105, 50, null, null, 'center');

  // Add receipt title
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0); // Black text
  doc.text('Receipt', 105, 60, null, null, 'center');

  // Add customer details
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${customerNameInput.value}`, 20, 75);
  doc.text(`Date and Time: ${dateTimeInput.value}`, 20, 85);

  // Generate table using autoTable
  const tableColumns = ['Item Name', 'Quantity', 'Price', 'Total'];
  const tableRows = items.map(item => [
    item.name,
    item.quantity,
    item.price.toFixed(2),
    item.total.toFixed(2)
  ]);

  doc.autoTable({
    startY: 100,
    head: [tableColumns],
    body: tableRows,
    theme: 'grid',
    styles: {
      fillColor: [76, 175, 80], // Green
      textColor: [0, 0, 0], // Black
      halign: 'center'
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240] // Light gray for alternating rows
    }
  });

  // Add grand total
  doc.setFont('helvetica', 'bold');
  doc.text(`Grand Total: $${total}`, 150, doc.previousAutoTable.finalY + 10);

  // Save the PDF
  doc.save('receipt.pdf');
};

// Event listeners
document.getElementById('add-item').addEventListener('click', addItem);
document.getElementById('generate-receipt').addEventListener('click', generateReceipt);
document.getElementById('clear-all').addEventListener('click', clearAll);
document.getElementById('download-receipt').addEventListener('click', downloadReceipt);
