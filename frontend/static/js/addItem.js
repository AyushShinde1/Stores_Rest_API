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

            const btn = document.getElementById('itemAddBtn')
            const fileInput = document.getElementById('itemimage');

            const itemData = {
                name: document.getElementById('itemname').value,
                price: parseFloat(document.getElementById('itemprice').value),
                store_id: 1
            };

            try {
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