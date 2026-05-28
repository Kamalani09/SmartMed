// Customer Dashboard JavaScript
(function() {
    // Global variables
    let currentSection = 'dashboard';
    let shoppingCart = [];
    let searchTimeout = null;
    let customerOrders = [];
    let profileData = null;



    // Initialize everything when page loads
    

    function setupEventListeners() {
        console.log('🔗 Setting up event listeners...');
        
        // Search page events
        const searchButton = document.querySelector('.search-header .btn-primary');
        if (searchButton) {
            searchButton.addEventListener('click', performSearch);
        }
        
        const searchInput = document.getElementById('medicineSearch');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                setTimeout(performSearch, 300);
            });
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') performSearch();
            });
        }
        
        const prescriptionFilter = document.getElementById('prescriptionOnly');
        if (prescriptionFilter) {
            prescriptionFilter.addEventListener('change', performSearch);
        }
        
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', performSearch);
        }
        
        // Quick search from dashboard
        const quickSearchBtn = document.querySelector('.search-box button');
        if (quickSearchBtn) {
            quickSearchBtn.addEventListener('click', performQuickSearch);
        }
    }

    function initializeSearchPage() {
        console.log('🔍 Initializing search page...');
        displayAllMedicines();
    }

    function displayAllMedicines() {
        console.log('💊 Displaying all medicines...');
        displayMedicines(medicines);
    }

    function performSearch() {
        console.log('🎯 Performing search...');
        
        const searchInput = document.getElementById('medicineSearch');
        const prescriptionFilter = document.getElementById('prescriptionOnly');
        const categoryFilter = document.getElementById('categoryFilter');
        
        if (!searchInput || !prescriptionFilter || !categoryFilter) {
            console.error('❌ Search elements not found!');
            return;
        }
        
        const searchTerm = searchInput.value.toLowerCase().trim();
        const prescriptionOnly = prescriptionFilter.checked;
        const selectedCategory = categoryFilter.value;
        
        console.log('📝 Search params:', { searchTerm, prescriptionOnly, selectedCategory });
        
        let filteredMedicines = medicines.filter(medicine => {
            // Search term matching
            let matchesSearch = true;
            if (searchTerm) {
                matchesSearch = 
                    medicine.name.toLowerCase().includes(searchTerm) ||
                    medicine.generic.toLowerCase().includes(searchTerm) ||
                    medicine.category.toLowerCase().includes(searchTerm);
            }
            
            // Prescription filter
            const matchesPrescription = !prescriptionOnly || medicine.prescriptionRequired;
            
            // Category filter
            const matchesCategory = !selectedCategory || medicine.category === selectedCategory;
            
            return matchesSearch && matchesPrescription && matchesCategory;
        });
        
        console.log(`✅ Found ${filteredMedicines.length} medicines`);
        displayMedicines(filteredMedicines);
    }

    function performQuickSearch() {
        console.log('⚡ Performing quick search...');
        const quickSearchInput = document.getElementById('quickSearch');
        if (quickSearchInput && quickSearchInput.value.trim()) {
            showSection('search');
            setTimeout(() => {
                const searchInput = document.getElementById('medicineSearch');
                if (searchInput) {
                    searchInput.value = quickSearchInput.value;
                    performSearch();
                }
            }, 100);
        }
    }

    function displayMedicines(medicinesArray) {
        console.log('🖼️ Displaying medicines:', medicinesArray.length);
        
        const searchResults = document.getElementById('searchResults');
        if (!searchResults) {
            console.error('❌ searchResults element not found!');
            return;
        }
        
        if (medicinesArray.length === 0) {
            searchResults.innerHTML = `
                <div class="empty-state">
                    <p>No medicines found matching your criteria</p>
                    <button class="btn-secondary" onclick="clearSearch()">Show All Medicines</button>
                </div>
            `;
            return;
        }
        
        let html = '';
        medicinesArray.forEach(medicine => {
            html += `
                <div class="medicine-card">
                    <div class="medicine-header">
                        <div>
                            <div class="medicine-name">${medicine.name}</div>
                            <div class="medicine-generic">${medicine.generic}</div>
                        </div>
                        <div class="medicine-price">${formatCurrency(medicine.price)}</div>
                    </div>
                    <div class="medicine-details">
                        <div class="medicine-detail">
                            <span>Dosage:</span>
                            <span>${medicine.dosage}</span>
                        </div>
                        <div class="medicine-detail">
                            <span>Category:</span>
                            <span>${medicine.category}</span>
                        </div>
                        <div class="medicine-detail">
                            <span>Stock:</span>
                            <span>${medicine.stock} available</span>
                        </div>
                    </div>
                    <div class="medicine-description">${medicine.description}</div>
                    ${medicine.prescriptionRequired ? '<div class="prescription-badge">Prescription Required</div>' : ''}
                    <div class="medicine-actions">
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="changeQuantity(${medicine.id}, -1)">-</button>
                            <span class="quantity-display" id="quantity-${medicine.id}">1</span>
                            <button class="quantity-btn" onclick="changeQuantity(${medicine.id}, 1)">+</button>
                        </div>
                        <button class="btn-primary" onclick="addToCart(${medicine.id})">Add to Cart</button>
                    </div>
                </div>
            `;
        });
        
        searchResults.innerHTML = html;
        console.log('✅ Medicines displayed successfully');
    }

    function clearSearch() {
        console.log('🧹 Clearing search...');
        const searchInput = document.getElementById('medicineSearch');
        const prescriptionFilter = document.getElementById('prescriptionOnly');
        const categoryFilter = document.getElementById('categoryFilter');
        
        if (searchInput) searchInput.value = '';
        if (prescriptionFilter) prescriptionFilter.checked = false;
        if (categoryFilter) categoryFilter.value = '';
        
        displayAllMedicines();
    }

    function changeQuantity(medicineId, change) {
        const quantityDisplay = document.getElementById(`quantity-${medicineId}`);
        if (!quantityDisplay) return;
        
        let quantity = parseInt(quantityDisplay.textContent);
        const medicine = medicines.find(m => m.id === medicineId);
        
        if (change > 0 && quantity < medicine.stock) {
            quantity++;
        } else if (change < 0 && quantity > 1) {
            quantity--;
        }
        
        quantityDisplay.textContent = quantity;
    }

    function addToCart(medicineId) {
        const quantityDisplay = document.getElementById(`quantity-${medicineId}`);
        if (!quantityDisplay) return;
        
        const quantity = parseInt(quantityDisplay.textContent);
        const medicine = medicines.find(m => m.id === medicineId);
        
        if (!medicine) return;
        
        // Check if already in cart
        const existingItem = shoppingCart.find(item => item.id === medicineId);
        
        if (existingItem) {
            if (existingItem.quantity + quantity <= medicine.stock) {
                existingItem.quantity += quantity;
            } else {
                showNotification(`Cannot add more than available stock (${medicine.stock})`, 'error');
                return;
            }
        } else {
            shoppingCart.push({
                id: medicine.id,
                name: medicine.name,
                price: medicine.price,
                quantity: quantity,
                prescriptionRequired: medicine.prescriptionRequired
            });
        }
        
        // Reset quantity
        quantityDisplay.textContent = '1';
        
        updateCartDisplay();
        showNotification(`✅ ${medicine.name} added to cart!`, 'success');
    }

    function updateCartDisplay() {
        const cartCount = shoppingCart.reduce((sum, item) => sum + item.quantity, 0);
        const cartTotal = shoppingCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Update header cart count
        const cartCountElement = document.getElementById('cartCount');
        if (cartCountElement) cartCountElement.textContent = cartCount;
        
        // Update dashboard stats
        const cartItemsElement = document.getElementById('cartItems');
        if (cartItemsElement) cartItemsElement.textContent = cartCount;
        
        // Update cart modal
        const cartItemsList = document.getElementById('cartItemsList');
        const cartTotalElement = document.getElementById('cartTotal');
        
        if (cartItemsList) {
            if (shoppingCart.length === 0) {
                cartItemsList.innerHTML = '<div class="empty-state"><p>Your cart is empty</p></div>';
            } else {
                let cartHtml = '';
                shoppingCart.forEach(item => {
                    cartHtml += `
                        <div class="cart-item">
                            <div class="cart-item-info">
                                <div class="cart-item-name">${item.name}</div>
                                <div class="cart-item-details">
                                    <span>Price: ${formatCurrency(item.price)}</span>
                                    ${item.prescriptionRequired ? '<span class="prescription-badge">Prescription Required</span>' : ''}
                                </div>
                            </div>
                            <div class="cart-item-controls">
                                <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, -1)">-</button>
                                <span class="quantity-display">${item.quantity}</span>
                                <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, 1)">+</button>
                                <button class="btn-secondary" onclick="removeFromCart(${item.id})">Remove</button>
                            </div>
                            <div class="cart-item-price">${formatCurrency(item.price * item.quantity)}</div>
                        </div>
                    `;
                });
                cartItemsList.innerHTML = cartHtml;
            }
        }
        
        if (cartTotalElement) {
            cartTotalElement.textContent = cartTotal.toFixed(2);
        }
    }

    function updateCartQuantity(medicineId, change) {
        const item = shoppingCart.find(item => item.id === medicineId);
        if (item) {
            const medicine = medicines.find(m => m.id === medicineId);
            if (medicine && item.quantity + change > medicine.stock) {
                showNotification(`Cannot add more than available stock (${medicine.stock})`, 'error');
                return;
            }
            
            item.quantity += change;
            if (item.quantity <= 0) {
                removeFromCart(medicineId);
            } else {
                updateCartDisplay();
            }
        }
    }

    function removeFromCart(medicineId) {
        shoppingCart = shoppingCart.filter(item => item.id !== medicineId);
        updateCartDisplay();
        showNotification('Item removed from cart', 'info');
    }

    function toggleCart() {
        const cartModal = document.getElementById('cartModal');
        if (cartModal) {
            cartModal.style.display = cartModal.style.display === 'block' ? 'none' : 'block';
        }
    }

    function showSection(sectionId) {
        console.log('📱 Showing section:', sectionId);
        
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Remove active from sidebar
        document.querySelectorAll('.sidebar a').forEach(link => {
            link.classList.remove('active');
        });
        
        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }
        
        // Activate clicked sidebar link
        if (event && event.target) {
            event.target.classList.add('active');
        }
        
        currentSection = sectionId;
        
        // Section-specific initializations
        if (sectionId === 'search') {
            setTimeout(initializeSearchPage, 50);
        } else if (sectionId === 'orders') {
            loadOrders('all');
        }
    }

    function updateDashboardStats() {
    const totalOrders = customerOrders.length;
    const pending = customerOrders.filter(o => o.status === "pending").length;
    const totalSpent = customerOrders
        .filter(o => o.status === "accepted")
        .reduce((sum, o) => sum + o.totalAmount, 0);

    document.getElementById("totalOrders").textContent = totalOrders;
    document.getElementById("pendingOrders").textContent = pending;
    document.getElementById("totalSpent").textContent = totalSpent.toFixed(2);
}


   function loadRecentOrders() {
    const container = document.getElementById("recentOrders");
    if (!container) return;

    const recent = customerOrders.slice(0, 3);

    if (recent.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No recent orders</p>
            </div>
        `;
        return;
    }

    let html = "";
    recent.forEach(order => {
        html += `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <div class="order-id">Order #${order._id}</div>
                        <div class="order-date">${new Date(order.createdAt).toLocaleDateString()}</div>
                    </div>
                    <span class="order-status status-${order.status}">
                        ${order.status.toUpperCase()}
                    </span>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

  async function loadOrders(filter = "all") {
    console.log("📦 Fetching orders from backend...");

    const token = localStorage.getItem("token");

    if (!token) return alert("Please login again");

    try {
        const res = await fetch("http://localhost:5000/api/orders/my-orders", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        });

        const data = await res.json();

        if (!res.ok) {
            console.error("Order fetch failed:", data);
            return;
        }

        // Save in global array
        customerOrders = data;

        // Apply filter
        let filteredOrders = customerOrders;
        if (filter !== "all") {
            filteredOrders = customerOrders.filter(o => o.status === filter);
        }

        const container = document.getElementById("ordersList");
        if (!container) return;

        if (filteredOrders.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>No ${filter === "all" ? "" : filter} orders found</p>
                </div>
            `;
            return;
        }

        let html = "";
        filteredOrders.forEach(order => {
            html += `
                <div class="order-card">
                    <div class="order-header">
                        <div>
                            <div class="order-id">Order #${order._id}</div>
                            <div class="order-date">${new Date(order.createdAt).toLocaleDateString()}</div>
                        </div>
                        <span class="order-status status-${order.status}">
                            ${order.status.toUpperCase()}
                        </span>
                    </div>

                    <div class="order-items">
                        ${order.items.map(item => `
                            <div class="order-item">
                                <span>${item.name} x${item.quantity}</span>
                                <span>₹${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        `).join("")}
                    </div>

                    <div class="order-total">Total: ₹${order.totalAmount}</div>

                    <div class="order-actions">
                        <button class="btn-secondary" onclick="viewBill('${order._id}')">View Bill</button>
                        ${order.status === 'pending'
                            ? `<button class="btn-secondary" onclick="cancelOrder('${order._id}')">Cancel Order</button>`
                            : ""
                        }
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;

        updateDashboardStats();
        loadRecentOrders();

    } catch (err) {
        console.error("❌ Error fetching orders:", err);
    }
}


    async function cancelOrder(orderId) {
    const token = localStorage.getItem("token");

    if (!confirm("Cancel this order?")) return;

    try {
        const res = await fetch(`http://localhost:5000/api/orders/${orderId}/reject`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();

        if (res.ok) {
            showNotification("Order canceled", "success");
            loadOrders("all");
        } else {
            showNotification(data.message, "error");
        }
    } catch (err) {
        console.error("Cancel error:", err);
    }
}


    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1'};
            color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460'};
            border: 1px solid ${type === 'success' ? '#c3e6cb' : type === 'error' ? '#f5c6cb' : '#bee5eb'};
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 10000;
            display: flex;
            justify-content: space-between;
            align-items: center;
            min-width: 300px;
        `;
        
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()" style="background: none; border: none; font-size: 18px; cursor: pointer; color: inherit;">&times;</button>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // Utility functions
    function formatCurrency(amount) {
        return '₹' + amount.toFixed(2);
    }

    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }

    function generateOrderId() {
        return Math.floor(1000 + Math.random() * 9000);
    }

    function placeOrder() {
        if (shoppingCart.length === 0) {
            showNotification('Your cart is empty!', 'error');
            return;
        }
        
        const requiresPrescription = shoppingCart.some(item => item.prescriptionRequired);
        const orderModal = document.getElementById('orderModal');
        const orderSummary = document.getElementById('orderSummary');
        
        if (!orderModal || !orderSummary) return;
        
        let summaryHtml = `
            <div class="order-summary">
                <h4>Order Summary</h4>
                <div class="order-items">
                    ${shoppingCart.map(item => `
                        <div class="order-item">
                            <span>${item.name} x${item.quantity}</span>
                            <span>${formatCurrency(item.price * item.quantity)}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="order-total">
                    Total: ${formatCurrency(shoppingCart.reduce((sum, item) => sum + (item.price * item.quantity), 0))}
                </div>
        `;
        
        if (requiresPrescription) {
            summaryHtml += `
                <div class="prescription-warning" style="background: #fff3cd; padding: 10px; border-radius: 5px; margin-top: 15px;">
                    <p style="margin: 0; color: #856404;"><strong>Note:</strong> Prescription required for some items.</p>
                </div>
            `;
        }
        
        summaryHtml += '</div>';
        orderSummary.innerHTML = summaryHtml;
        orderModal.style.display = 'block';
    }

    function closeOrderModal() {
        const orderModal = document.getElementById('orderModal');
        if (orderModal) orderModal.style.display = 'none';
    }

    async function confirmOrder() {
    const token = localStorage.getItem('token');
    if (!token) {
        showNotification("You must be logged in to place an order", "error");
        return;
    }

    if (shoppingCart.length === 0) {
        showNotification("Your cart is empty!", "error");
        return;
    }

    const orderTotal = shoppingCart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const orderPayload = {
        items: shoppingCart.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
        })),
        totalAmount: orderTotal
    };

    try {
        const response = await fetch("http://localhost:5000/api/orders/create", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(orderPayload)
        });

        const data = await response.json();
        console.log("Order Response:", data);

        if (response.ok) {
            shoppingCart = [];
            updateCartDisplay();
            closeOrderModal();
            showNotification("🎉 Order sent to owner for approval!", "success");

            loadOrders("all"); // reload orders list
        } else {
            showNotification(data.message || "Order failed", "error");
        }
    } catch (err) {
        console.error("Order error:", err);
        showNotification("Server error. Try again.", "error");
    }
}



    function generateBill(order) {
        const billModal = document.getElementById('billModal');
        const billDetails = document.getElementById('billDetails');
        
        if (!billModal || !billDetails) return;
        
        const billHtml = `
            <div class="bill">
                <div class="bill-header">
                    <h3>MediCare Pharmacy</h3>
                    <p>Bill #${order.id}</p>
                    <p>Date: ${formatDate(order.date)}</p>
                </div>
                
                <div class="bill-items">
                    <h4>Order Details</h4>
                    ${order.items.map(item => `
                        <div class="bill-item">
                            <span>${item.name} x${item.quantity}</span>
                            <span>${formatCurrency(item.price * item.quantity)}</span>
                        </div>
                    `).join('')}
                </div>
                
                <div class="bill-total">
                    Total: ${formatCurrency(order.total)}
                </div>
                
                <div class="bill-footer">
                    <p>Status: <span class="status-${order.status}">${order.status.toUpperCase()}</span></p>
                    <p>Thank you for your order!</p>
                </div>
            </div>
        `;
        
        billDetails.innerHTML = billHtml;
        billModal.style.display = 'block';
    }

    function closeBillModal() {
        const billModal = document.getElementById('billModal');
        if (billModal) billModal.style.display = 'none';
    }

    function printBill() {
        const billContent = document.getElementById('billDetails').innerHTML;
        const originalContent = document.body.innerHTML;
        
        document.body.innerHTML = billContent;
        window.print();
        document.body.innerHTML = originalContent;
        
        // Re-initialize the dashboard
        initializeDashboard();
        showSection('dashboard');
    }

    function viewBill(orderId) {
        const order = customerOrders.find(o => o.id === orderId);
        if (order) {
            generateBill(order);
        }
    }

    function uploadPrescription() {
        const fileInput = document.getElementById('prescriptionUpload');
        if (!fileInput) return;
        
        const file = fileInput.files[0];
        
        if (!file) {
            showNotification('Please select a file to upload', 'error');
            return;
        }
        
        // Simulate file upload
        showNotification('Prescription uploaded successfully! It will be verified by our staff.', 'success');
        fileInput.value = ''; // Clear file input
    }
    // Profile Edit Functions
function enableAddressEdit() {
    console.log('📝 Enabling address edit...');
    
    // Hide the display address
    document.querySelector('.profile-field:last-child span').style.display = 'none';
    document.querySelector('.profile-field:last-child .btn-edit').style.display = 'none';
    
    // Show the edit form
    const editForm = document.getElementById('editAddressForm');
    editForm.style.display = 'block';
    
    // Parse current address and populate form
    const currentAddress = currentCustomer.address;
    populateAddressForm(currentAddress);
}

function populateAddressForm(address) {
    console.log('📍 Populating address form with:', address);
    
    // Simple address parsing (you might want to make this more sophisticated)
    const addressParts = address.split(', ');
    
    // Default values
    let street = address;
    let city = '';
    let state = '';
    let pincode = '';
    
    // Simple parsing logic - adjust based on your address format
    if (addressParts.length >= 3) {
        street = addressParts[0];
        city = addressParts[1] || '';
        const lastPart = addressParts[addressParts.length - 1];
        
        // Extract pincode (assuming it's 6 digits)
        const pincodeMatch = lastPart.match(/\d{6}/);
        if (pincodeMatch) {
            pincode = pincodeMatch[0];
            state = lastPart.replace(pincode, '').trim();
        } else {
            state = lastPart;
        }
    }
    
    // Populate form fields
    document.getElementById('streetAddress').value = street;
    document.getElementById('city').value = city;
    document.getElementById('state').value = state;
    document.getElementById('pincode').value = pincode;
    
    // Set focus to first field
    document.getElementById('streetAddress').focus();
}

function cancelAddressEdit() {
    console.log('❌ Cancelling address edit...');
    
    // Show the display address
    document.querySelector('.profile-field:last-child span').style.display = 'inline';
    document.querySelector('.profile-field:last-child .btn-edit').style.display = 'inline-block';
    
    // Hide the edit form
    document.getElementById('editAddressForm').style.display = 'none';
    
    // Reset form validation
    document.getElementById('addressForm').reset();
}

function updateAddress(event) {
    event.preventDefault();
    console.log('💾 Updating address...');
    
    // Get form values
    const street = document.getElementById('streetAddress').value.trim();
    const city = document.getElementById('city').value.trim();
    const state = document.getElementById('state').value.trim();
    const pincode = document.getElementById('pincode').value.trim();
    const country = document.getElementById('country').value.trim();
    
    // Validate form
    if (!street || !city || !state || !pincode) {
        showNotification('Please fill in all address fields', 'error');
        return;
    }
    
    if (!/^\d{6}$/.test(pincode)) {
        showNotification('Please enter a valid 6-digit pincode', 'error');
        return;
    }
    
    // Format the new address
    const newAddress = `${street}, ${city}, ${state} - ${pincode}, ${country}`;
    
    // Update customer data
    currentCustomer.address = newAddress;
    
    // Update UI
    document.getElementById('profileAddress').textContent = newAddress;
    
    // Hide edit form and show display
    cancelAddressEdit();
    
    // Show success message
    showNotification('✅ Address updated successfully!', 'success');
    
    // Log the update
    console.log('📍 Address updated to:', newAddress);
    
    // In a real application, you would send this to your backend here
    // updateCustomerProfile(currentCustomer);
}

// Enhanced initializeDashboard function to include address setup
function initializeDashboard() {
    console.log('📊 Initializing dashboard...');

    // Set customer name in header
    if (profileData) {
        const user = profileData.user || profileData;
        const name = user.name || "Customer";
        document.getElementById('customerName').textContent = name;
    }

    // Update profile section (left sidebar)
    if (profileData) {
        const user = profileData.user || profileData;

        document.getElementById('profileName').textContent = user.name || "";
        document.getElementById('profileEmail').textContent = user.email || "";
        document.getElementById('profilePhone').textContent = user.phone || "";
        document.getElementById('profileAddress').textContent = user.address || "";
    }

    updateDashboardStats();
    loadRecentOrders();

    initializeAddressForm();
}


function initializeAddressForm() {
    // Make sure the edit button exists and has event listener
    const editButton = document.querySelector('.profile-field:last-child .btn-edit');
    if (editButton) {
        editButton.onclick = enableAddressEdit;
    }
}

  function logout() {
    if (confirm('Are you sure you want to logout?')) {
        showNotification('Logged out successfully!', 'success');
        setTimeout(() => {
            shoppingCart = [];
            // Redirect to frontend/index.html
            window.location.href = '../index.html';
        }, 2000);
    }
}
async function loadMedicines() {
  try {
    const res = await fetch('http://localhost:5000/api/medicines');
    const meds = await res.json();
    // render list
    console.log(meds);
  } catch (err) {
    console.error('Could not load medicines', err);
  }
}
loadMedicines();



    // Make functions globally available
    window.showSection = showSection;
    window.initializeDashboard = initializeDashboard;
    window.performSearch = performSearch;
    window.performQuickSearch = performQuickSearch;
    window.clearSearch = clearSearch;
    window.changeQuantity = changeQuantity;
    window.addToCart = addToCart;
    window.updateCartQuantity = updateCartQuantity;
    window.removeFromCart = removeFromCart;
    window.toggleCart = toggleCart;
    window.placeOrder = placeOrder;
    window.closeOrderModal = closeOrderModal;
    window.confirmOrder = confirmOrder;
    window.generateBill = generateBill;
    window.closeBillModal = closeBillModal;
    window.printBill = printBill;
    window.viewBill = viewBill;
    window.uploadPrescription = uploadPrescription;
    window.logout = logout;
    window.filterByCategory = filterByCategory;
    window.loadOrders = loadOrders;
    window.cancelOrder = cancelOrder;

})();
document.addEventListener('DOMContentLoaded', async () => {
  const token =
    localStorage.getItem('token') ||
    localStorage.getItem('ms_token') ||
    localStorage.getItem('authToken');

  if (!token) {
    console.warn("No token found, redirecting...");
    window.location.href = '../login.html';
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    console.log("Customer Data From Backend:", data);

    // Store globally
    profileData = data;

    // Support both response structures
    const customerName =
      data.name ||
      (data.user && data.user.name) ||
      "Customer";

    if (response.ok) {
      // Set name in header
      document.getElementById('customerName').textContent = customerName;

      // Also update profile section
      if (document.getElementById('profileName')) {
        document.getElementById('profileName').textContent = customerName;
      }
    } else {
      alert('Session expired. Please log in again.');
      localStorage.removeItem('token');
      localStorage.removeItem('ms_token');
      window.location.href = '../login.html';
    }

  } catch (error) {
    console.error('Error fetching customer info:', error);
    alert('Unable to load your profile. Please try again later.');
  }
});

