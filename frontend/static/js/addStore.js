document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("addStore");

  function clearErrors() {
    document.querySelectorAll(".error").forEach((el) => (el.textContent = ""));
  }

  function showFieldError(id, msg) {
    const el = document.getElementById(id);
    if (el) el.textContent = msg;
  }

  async function safeJson(resp) {
    try {
      return await resp.json();
    } catch (e) {
      return null;
    }
  }

  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    clearErrors();

    const token = api.getAuthToken();
    if (!token) {
      alert("You must login first");
      window.location.href = "login.html";
      return;
    }

    const btn = document.getElementById("storeAddBtn");
    const storename = document.getElementById("storename")?.value?.trim();
    const fileInput = document.getElementById("storeimage");
    const desc = document.getElementById("imagedesc")?.value?.trim();

    if (!storename) {
      showFieldError("storenameError", "Store name is required");
      return;
    }

    try {
      btn.disabled = true;
      btn.textContent = "Creating Store...";

      // 1) Create store
      const storeResp = await api.addStore({ name: storename });
      const storeJson = storeResp?.ok !== undefined ? await safeJson(storeResp) : storeResp;

      // If api.addStore returns a fetch Response, handle non-OK
      if (storeResp?.ok === false) {
        throw new Error(storeJson?.message || "Failed to create store");
      }

      const storeId = storeJson?.id;
      if (!storeId) {
        throw new Error("Store created but no store id returned");
      }

      // 2) Upload store image (optional)
      if (fileInput && fileInput.files && fileInput.files[0]) {
        btn.textContent = "Uploading Store Image...";

        const fd = new FormData();
        fd.append("image", fileInput.files[0]);
        fd.append("name", storename);
        fd.append("description", desc || "");
        fd.append("store_id", storeId);

        const imgResp = await api.addStoreImage(fd);
        if (imgResp?.ok === false) {
          const err = await safeJson(imgResp);
          throw new Error(err?.message || "Store image upload failed");
        }
      }

      alert("Store created successfully!");
      form.reset();
    } catch (err) {
      alert(err.message || "Error");
      console.error(err);

      // basic mapping for common backend errors
      if ((err.message || "").toLowerCase().includes("name")) {
        showFieldError("storenameError", err.message);
      }
    } finally {
      btn.disabled = false;
      btn.textContent = "Add Store";
    }
  });
});
