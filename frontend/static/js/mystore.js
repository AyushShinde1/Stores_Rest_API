document.addEventListener("DOMContentLoaded", async function () {
    const grid = document.getElementById("storeItemsGrid");
    const msg = document.getElementById("storeMessage");
    const storeLogo = document.getElementById("storeLogo");
    const storeNameEl = document.getElementById("storeName");

    if (!grid) return;

    const token = api.getAuthToken();
    if (!token) {
        if (msg) msg.textContent = "You must be logged in to see store items.";
        return;
    }

    // Get store ID from URL (?store_id=1)
    const urlParams = new URLSearchParams(window.location.search);
    const storeId = urlParams.get("store_id");
    if (!storeId) {
        if (msg) msg.textContent = "No store ID provided. Usage: MyStore.html?store_id=1";
        return;
    }

    try {
        // Fetch store data (now includes itemImages!)
        const resp = await fetch(`${API_BASE}/store/${storeId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        });

        if (!resp.ok) {
            const err = await resp.json().catch(() => ({}));
            throw new Error(err.message || `Store ${storeId} not found`);
        }

        const store = await resp.json();
        console.log("Store loaded:", store);

        // Update header
        storeNameEl.textContent = store.name;
        const firstStoreImg = store.storeImages?.[0];
        if (firstStoreImg?.image_url) {
            storeLogo.src = firstStoreImg.image_url;
        } else {
            storeLogo.src = "static/img/default-store.png"; // fallback
        }

        const items = store.items || [];
        if (!items.length) {
            if (msg) msg.textContent = "No items available in this store yet.";
            return;
        }

        // Tag-wise grouping (same logic as home.js)
        const tagMap = {};
        const untaggedItems = [];

        items.forEach((item) => {
            const tags = Array.isArray(item.tags) ? item.tags : [];
            if (!tags.length) {
                untaggedItems.push(item);
                return;
            }
            tags.forEach((tag) => {
                const tagName = tag.name || "Unknown";
                if (!tagMap[tagName]) tagMap[tagName] = [];
                tagMap[tagName].push(item);
            });
        });

        const tagNames = Object.keys(tagMap);
        tagNames.sort((a, b) => a.localeCompare(b));

        function renderSection(label, itemsForTag) {
            if (!itemsForTag.length) return;

            const sortedItems = itemsForTag
                .slice()
                .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

            const section = document.createElement("section");
            section.className = "tagSection";

            const heading = document.createElement("h2");
            heading.textContent = label;
            section.appendChild(heading);

            const tagGrid = document.createElement("div");
            tagGrid.className = "itemsGrid";

            sortedItems.forEach((item) => {
                const firstImage = item.itemImages?.[0] || null;
                const imageUrl = firstImage?.imageurl || "";
                const imageDesc = firstImage?.description || "No description";

                const card = document.createElement("div");
                card.className = "itemCard";
                card.innerHTML = `
                    <div class="itemImage" style="background-image: url('${imageUrl}')"></div>
                    <div class="itemInfo">
                        <div class="itemName">${item.name}</div>
                        <div class="itemPrice">$${item.price.toFixed(2)}</div>
                        <div class="itemImageDesc">${imageDesc}</div>
                    </div>
                `;
                tagGrid.appendChild(card);
            });

            section.appendChild(tagGrid);
            grid.appendChild(section);
        }

        // Render tagged + untagged
        tagNames.forEach((tagName) => renderSection(tagName, tagMap[tagName]));
        if (untaggedItems.length) {
            renderSection("Untagged", untaggedItems);
        }

    } catch (error) {
        console.error("MyStore error:", error);
        if (msg) msg.textContent = error.message;
    }
});
