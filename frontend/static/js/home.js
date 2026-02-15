document.addEventListener('DOMContentLoaded', async function() {
    const grid = document.getElementById('itemsGrid');
    const msg = document.getElementById('homeMessage');
    if (!grid) return;

    const token = api.getAuthToken();
    if (!token) {
        if (msg) {
            msg.textContent = 'You must be logged in to see items.';
        }
        return;
    }

    try {
        const resp = await fetch(`${API_BASE}/item`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        if (!resp.ok) {
            const err = await resp.json().catch(() => ({}));
            throw new Error(err.message || 'Failed to load items');
        }

        const items = await resp.json();

        if (!items.length) {
            if (msg) {
                msg.textContent = 'No items available yet.';
            }
            return;
        }

        grid.innerHTML = '';

        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'itemCard';
            card.innerHTML = `
                <div class="itemImage"></div>
                <div class="itemInfo">
                    <div class="itemName">${item.name}</div>
                    <div class="itemPrice">₹${item.price}</div>
                </div>
            `;
            grid.appendChild(card);
        });

    } catch (error) {
        console.error('Home items error:', error);
        if (msg) {
            msg.textContent = error.message;
        }
    }
});