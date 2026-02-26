document.addEventListener('DOMContentLoaded', async function() {
    const addItemForm = document.getElementById('addItem')

    function handleError(error) {
        console.error('Error:', error);
        alert(`Error: ${error.message || error}`);
    }

    function clearErrors() {
        document.querySelectorAll('.error').forEach(el => el.textContent = '');
    }

    if (addItemForm) {
        addItemForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            clearErrors();
            const token = api.getAuthToken();
            if (!token) {
                alert('You must login first');
                window.location.href = '/login.html';
                return;
            }

            const storename = document.getElementById('storename')
            let store_id;
            let item_id;
            
            //Fetch store id using storename
            try {
                store_id = await api.getStoreId(storename.value);
                console.log("Store ID is:", store_id);
            } catch (err) {
                // console.error("Error fetching store ID:", err.message);
                const storenameError = document.getElementById('storenameError')
                storenameError.innerHTML = 'Store not found. <a href="/addStoreDetails.html">Create New Store</a>'
                throw new Error("Error fetching store ID:", err.message);
            }

            //Link Tag To Store
            try {
                const tagdetails = {
                name: document.getElementById('tagname').value,
                store_id: store_id
                };

                const response = await api.LinkTagToStore(tagdetails);
                console.log("Tag linked successfully:", response);

                
            } catch (err) {
                if (err.message.includes('A tag with that name already exists')) {
                    console.warn("Tag already exists, skipping creation");

                    const tagError = document.getElementById('tagError');
                    tagError.textContent = "A tag with that name already exists.";
                } else {
                    console.error("Failed to create store tag link:", err.message);
                    const tagError = document.getElementById('tagError');
                    tagError.textContent = err.message || 'Fail To Create Store Tag Link';
                    
                    throw err;
                }
            }


            //Add Item Details
            const btn = document.getElementById('itemAddBtn')
            const fileInput = document.getElementById('itemimage');

            const itemData = {
                name: document.getElementById('itemname').value,
                price: parseFloat(document.getElementById('itemprice').value),
                store_id: store_id
            };

            try {
                console.log('Creating Item...')
                btn.disabled = true; 
                btn.textContent = 'Creating Item...';

                const response = await api.addItem(itemData);
                let itemjson;
                
                if (response && response.ok !== undefined) { 
                    if (!response.ok) {
                        const err = await response.json().catch(() => ({}));
                        throw new Error(err.message || 'Failed to create item');
                    }
                    itemjson = await response.json();
                } else {
                    itemjson = response; 
                }
                item_id = itemjson.id
                console.log('Item created:', itemjson);

                if (!fileInput.files[0]) {
                    alert('Please select an image file');
                    return;
                }

                const formData = new FormData();
                formData.append("image", fileInput.files[0]);
                formData.append("name", document.getElementById('itemname').value);
                formData.append("description", document.getElementById('imagedesc')?.value || '');
                formData.append("item_id", itemjson.id);

                btn.textContent = 'Uploading Image...';

                const imgresponse = await api.addImage(formData);

                if (imgresponse && imgresponse.ok !== undefined) {
                    if (!imgresponse.ok) {
                        const err = await imgresponse.json().catch(() => ({}));
                        throw new Error(err.message || 'Image upload failed');
                    }
                }
                
                //Link Tag To Store
                try {
                    const tagname = document.getElementById('tagname')

                    tag_id = await api.getTagId(tagname.value);

                    const tagdetails = {
                    item_id: item_id,
                    tag_id: tag_id
                    };

                    const response = await api.LinkTagToItem(tagdetails);
                } catch(err) {
                    console.error("Failed to create Item tag link:", err.message);
                    const tagError = document.getElementById('tagError');
                    tagError.textContent = err.message || 'Fail To Create Item Tag Link';
                    
                    throw err;
                }

                alert(' Item & Image created successfully!');
                addItemForm.reset();

            } catch (error) {
                handleError(error);
            } finally {
                btn.disabled = false;
                btn.textContent = 'Add Item';
            }
        })
    }
})