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

        // Clear existing content
        grid.innerHTML = '';

        // 1) Build a map: tagName -> [items...] and collect untagged
        const tagMap = {};
        const untaggedItems = [];

        items.forEach(item => {
            const tags = Array.isArray(item.tags) ? item.tags : [];

            if (!tags.length) {
                // Collect untagged
                untaggedItems.push(item);
                return;
            }

            tags.forEach(tag => {
                const tagName = tag.name || 'Unknown';
                if (!tagMap[tagName]) {
                    tagMap[tagName] = [];
                }
                tagMap[tagName].push(item);
            });
        });

        const tagNames = Object.keys(tagMap);

        if (!tagNames.length && !untaggedItems.length) {
            if (msg) {
                msg.textContent = 'No tagged items available yet.';
            }
            return;
        }

        // 2) Sort tag names alphabetically
        tagNames.sort((a, b) => a.localeCompare(b));

        // Helper: render a section for a given label and list of items
        function renderSection(label, itemsForTag) {
            if (!itemsForTag.length) return;

            const sortedItems = itemsForTag.slice().sort((a, b) => {
                const nameA = (a.name || '').toLowerCase();
                const nameB = (b.name || '').toLowerCase();
                return nameA.localeCompare(nameB);
            });

            const section = document.createElement('section');
            section.className = 'tagSection';

            const heading = document.createElement('h2');
            heading.textContent = label;
            section.appendChild(heading);

            const tagGrid = document.createElement('div');
            tagGrid.className = 'itemsGrid';

            sortedItems.forEach(item => {
                const firstImage = (item.itemImages && item.itemImages.length > 0)
                    ? item.itemImages[0]
                    : null;

                const imageUrl = firstImage?.image_url ? `${firstImage.image_url}` : "";
                const imageDesc = firstImage?.description ? firstImage.description : "No description";

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
                tagGrid.appendChild(card);
            });

            section.appendChild(tagGrid);
            grid.appendChild(section);
        }

        // 3) Render tagged sections
        tagNames.forEach(tagName => {
            renderSection(tagName, tagMap[tagName]);
        });

        // 4) Render untagged at the end
        if (untaggedItems.length) {
            renderSection('Untagged', untaggedItems);
        }

        /*
        // OLD LOGIC PRINTING ALL ITEMS (kept here only for reference, not executed)

        items.forEach(item => {
            const firstImage = (item.itemImages && item.itemImages.length > 0) ? item.itemImages[0] : null;
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
        */

    } catch (error) {
        console.error('Home items error:', error);
        if (msg) {
            msg.textContent = error.message;
        }
    }
});
