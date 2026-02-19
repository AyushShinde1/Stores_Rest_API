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
                formData.append("name", document.getElementById('itemname').value);  // Backend expects "name"
                formData.append("description", document.getElementById('imagedesc')?.value || '');
                formData.append("item_id", itemjson.id);  // Backend expects "item_id"

                btn.textContent = 'Uploading Image...';

                const imgresponse = await api.addImage(formData);

                if (imgresponse && imgresponse.ok !== undefined) {  // fetch Response
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




// document.addEventListener('DOMContentLoaded', async function() {
//     const addItemForm = document.getElementById('addItem')

//     function handleError(error) {
//         console.error('Error:', error);
//         alert(`Error: ${error.message || error}`);
//     }

//     function clearErrors() {
//         document.querySelectorAll('.error').forEach(el => el.textContent = '');
//     }

//     if (addItemForm) {
//         addItemForm.addEventListener('submit', async function(e) {
//             e.preventDefault();

//             clearErrors();
//             const token = api.getAuthToken();
//             if (!token) {
//                 alert('You must login first');
//                 window.location.href = '/login.html';
//                 return;
//             }

//             const btn = document.getElementById('itemAddBtn')

//             const itemData = {
//                 //storename: document.getElementById('storename').value,
//                 name: document.getElementById('itemname').value,
//                 price: parseFloat(document.getElementById('itemprice').value),
//                 store_id: 1
//             };

            

//             try {
//                 btn.disable = true;
//                 btn.textContent = 'Uploading Item...';

//                 const response = await api.addItem(itemData);

//                 if (!response.ok) {
//                     const err = await response.json().catch(() => ({}));
//                     throw new Error(err.message || 'Failed to load items');
//                 }
                
//                 const itemjson = await response.json()

//                 // const imageData = {
//                 //         itemname: document.getElementById('itemname'),
//                 //         imagedesc: document.getElementById('imagedesc'),
//                 //         itemid: itemjson.id
//                 // }
//                 const fileInput = document.getElementById('itemimage');

//                 if (!fileInput.files[0]) {
//                     alert('Please select an image file');
//                     return;
//                 }

//                 const formData = new FormData();
//                 formData.append("image", fileInput.files[0]);
//                 formData.append("itemname", "Sample Item");
//                 formData.append("imagedesc", "This is an item image.");
//                 formData.append("itemid", itemjson.id)

//                 const imgresponse = await api.addImage(formData);

//                 if (!imgresponse.ok) {
//                     const err = await imgresponse.json().catch(() => ({}));
//                     throw new Error(err.message || 'Image upload failed');
//                 }

//                 alert('✅ Item & Image created successfully!');
//                 addItemForm.reset();  // Clear form

//             } catch (error) {
//                 handleError(error);
//             } finally {
//                 btn.disabled = false;
//                 btn.textContent = 'Add Item 2'
//             }
            
//         })
//     }
// })