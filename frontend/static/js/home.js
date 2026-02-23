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
            const firstImage = (item.itemImages && item.itemImages.length > 0) ? item.itemImages[0] : null;

            // Your backend stores imageurl like: "uploads/<filename>.jpg" [file:1]
            // We added Flask route /uploads/<filename>, so browser URL should be "/uploads/<filename>.jpg" [file:1]
            const imageUrl = firstImage?.image_url ? `${firstImage.image_url}` : "";
            const imageDesc = firstImage?.description ? firstImage.description : "No description"; 
            console.log(imageUrl)
            const card = document.createElement('div');
            card.className = 'itemCard';
            card.innerHTML = `
                <div class="itemImage" style="background-image: url('${imageUrl}')"></div>
                <div class="itemInfo">
                    <div class="itemName">${item.name}</div>
                    <div class="itemPrice">${item.price}</div>
                    <div class="itemImageDesc">${imageDesc}</div>
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