window.addEventListener('DOMContentLoaded', async () => {
  const role = auth.getRole();
  if (role !== 'owner') {
    alert('Unauthorized');
    return (window.location.href = '../index.html');
  }

  // Logout button
  document.getElementById('logoutBtn')?.addEventListener('click', auth.logout);

  // ✅ Fetch owner name using stored token
  const token = localStorage.getItem('token'); // <-- Make sure you store it as 'token' in login
  if (token) {
    try {
      const response = await fetch('https://smartmed-dmrb.onrender.com/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();
      console.log('Owner profile:', data);

      if (response.ok) {
        const ownerNameEl = document.getElementById('ownerName');
        if (ownerNameEl) {
          ownerNameEl.textContent = data.name || 'Owner';
        }
      } else {
        console.warn('Could not fetch owner info:', data.message);
      }
    } catch (error) {
      console.error('Error fetching owner info:', error);
    }
  } else {
    alert('Session expired. Please log in again.');
    window.location.href = '../index.html';
  }

  // ===============================
  // MEDICINE DASHBOARD LOGIC
  // ===============================
  try {
    const lowStock = await auth.fetchJSON('/medicines?lowstock=true');
    const expiring = await auth.fetchJSON('/medicines/expired');
    console.log('Low stock:', lowStock);
    console.log('Expired:', expiring);
  } catch (err) {
    console.error(err);
  }

  // Load medicines
  loadMedicines();
});

async function loadMedicines() {
  try {
    const res = await fetch('https://smartmed-dmrb.onrender.com/api/medicines');
    const meds = await res.json();
    console.log('Medicines:', meds);
    // TODO: render medicine list to your dashboard here
  } catch (err) {
    console.error('Could not load medicines', err);
  }
}
async function loadPendingOrders() {
    const token = localStorage.getItem("token");
    document.getElementById("pendingCount").textContent =
    `${pendingOrders.length} orders pending`;

    if (!token) {
        alert("Please login first");
        window.location.href = "../login.html";
        return;
    }

    try {
        const res = await fetch("https://smartmed-dmrb.onrender.com/api/orders/pending", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const pendingOrders = await res.json();
        console.log("Pending Orders:", pendingOrders);

        renderPendingOrders(pendingOrders);

    } catch (err) {
        console.error("Error loading pending orders:", err);
    }
}
function renderPendingOrders(orders) {
    const container = document.getElementById("pendingOrdersList");

    if (!container) {
        console.error("Missing pendingOrdersList element!");
        return;
    }

    if (orders.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No pending orders</p>
            </div>
        `;
        return;
    }

    let html = "";

    orders.forEach(order => {
        html += `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <div class="order-id">Order #${order._id}</div>
                        <div class="order-date">${new Date(order.createdAt).toLocaleDateString()}</div>
                        <div class="order-customer">Customer: ${order.customerId.name} (${order.customerId.email})</div>
                    </div>
                    <span class="order-status status-pending">PENDING</span>
                </div>

                <div class="order-items">
                    ${order.items
                        .map(
                            (item) => `
                        <div class="order-item">
                            <span>${item.name} x${item.quantity}</span>
                            <span>₹${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    `
                        )
                        .join("")}
                </div>

                <div class="order-total">Total: ₹${order.totalAmount}</div>

                <div class="order-actions">
                    <button class="btn-accept" onclick="acceptOrder('${order._id}')">Accept</button>
                    <button class="btn-reject" onclick="rejectOrder('${order._id}')">Reject</button>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}
async function acceptOrder(orderId) {
    const token = localStorage.getItem("token");

    try {
        const res = await fetch(`https://smartmed-dmrb.onrender.com/api/orders/${orderId}/accept`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();

        if (res.ok) {
            alert("Order Accepted!");
            loadPendingOrders();
        } else {
            alert(data.message);
        }

    } catch (err) {
        console.error("Accept error:", err);
    }
}


async function rejectOrder(orderId) {
    const token = localStorage.getItem("token");

    try {
        const res = await fetch(`https://smartmed-dmrb.onrender.com/api/orders/${orderId}/reject`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();

        if (res.ok) {
            alert("Order Rejected!");
            loadPendingOrders();
        } else {
            alert(data.message);
        }

    } catch (err) {
        console.error("Reject error:", err);
    }
}



async function addMedicine(payload) {
  const token = localStorage.getItem('token'); // Ensure token matches your login storage key
  const res = await fetch('https://smartmed-dmrb.onrender.com/api/medicines', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': 'Bearer ' + token 
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Add failed');
  return data;
}
document.addEventListener("DOMContentLoaded", () => {
    loadPendingOrders();
});
