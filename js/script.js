/* =========================================================
   Honeycrumb Bakery — script.js
   Mengelola data pesanan: simpan, baca, tampilkan, hapus.
   Data disimpan di localStorage browser (key: "bakeryOrders").
   ========================================================= */

const STORAGE_KEY = "bakeryOrders";

/* ---------- Util: storage ---------- */
function getOrders() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveOrders(orders) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

function addOrder(order) {
  const orders = getOrders();
  order.id = Date.now();
  order.tanggal = new Date().toLocaleDateString("id-ID", {
    day: "2-digit", month: "short", year: "numeric"
  });
  orders.unshift(order);
  saveOrders(orders);
  return order;
}

function deleteOrder(id) {
  const orders = getOrders().filter(o => o.id !== id);
  saveOrders(orders);
}

/* ---------- Util: toast notification ---------- */
function showToast(message, emoji = "🧁") {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span>${emoji}</span><span>${message}</span>`;
  toast.classList.add("show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("show"), 2600);
}

/* ---------- Halaman Form (index.html) ---------- */
function initFormPage() {
  const form = document.getElementById("orderForm");
  if (!form) return;

  const namaInput = document.getElementById("nama");
  const nimInput = document.getElementById("nim");
  const layananInput = document.getElementById("layanan");
  const keteranganInput = document.getElementById("keterangan");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    let valid = true;

    valid = validateField(namaInput, namaInput.value.trim().length >= 3,
      "Nama minimal 3 karakter.") && valid;

    valid = validateField(nimInput, nimInput.value.trim().length >= 3,
      "NIM / ID minimal 3 karakter.") && valid;

    valid = validateField(layananInput, layananInput.value !== "",
      "Pilih jenis layanan terlebih dahulu.") && valid;

    if (!valid) {
      showToast("Yuk lengkapi dulu form-nya~", "⚠️");
      return;
    }

    const order = {
      nama: namaInput.value.trim(),
      nim: nimInput.value.trim(),
      layanan: layananInput.value,
      keterangan: keteranganInput.value.trim() || "-"
    };

    addOrder(order);
    showToast("Pesanan berhasil disimpan!", "🎉");
    form.reset();
    namaInput.focus();
  });

  // Bersihkan pesan error saat user mulai mengetik lagi
  [namaInput, nimInput, layananInput].forEach(el => {
    el.addEventListener("input", () => clearFieldError(el));
    el.addEventListener("change", () => clearFieldError(el));
  });
}

function validateField(input, isValid, message) {
  const errorEl = document.getElementById(input.id + "Error");
  if (!isValid) {
    input.style.borderColor = "#F2849C";
    if (errorEl) errorEl.textContent = message;
    return false;
  }
  clearFieldError(input);
  return true;
}

function clearFieldError(input) {
  input.style.borderColor = "";
  const errorEl = document.getElementById(input.id + "Error");
  if (errorEl) errorEl.textContent = "";
}

/* ---------- Halaman Tabel (data.html) ---------- */
function initDataPage() {
  const tbody = document.getElementById("dataTableBody");
  if (!tbody) return;

  renderTable();

  tbody.addEventListener("click", function (e) {
    const btn = e.target.closest(".btn-danger");
    if (!btn) return;
    const id = Number(btn.dataset.id);
    deleteOrder(id);
    showToast("Data pesanan dihapus.", "🗑️");
    renderTable();
  });
}

function renderTable() {
  const tbody = document.getElementById("dataTableBody");
  const wrap = document.getElementById("tableWrap");
  const emptyState = document.getElementById("emptyState");
  const countPill = document.getElementById("countPill");
  const orders = getOrders();

  countPill.textContent = `${orders.length} pesanan`;

  if (orders.length === 0) {
    wrap.style.display = "none";
    emptyState.style.display = "block";
    return;
  }

  wrap.style.display = "block";
  emptyState.style.display = "none";

  tbody.innerHTML = orders.map((o, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${escapeHtml(o.nama)}</td>
      <td>${escapeHtml(o.nim)}</td>
      <td><span class="badge">${escapeHtml(o.layanan)}</span></td>
      <td>${escapeHtml(o.keterangan)}</td>
      <td>${o.tanggal}</td>
      <td><button class="btn btn-danger" data-id="${o.id}">Hapus</button></td>
    </tr>
  `).join("");
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", function () {
  initFormPage();
  initDataPage();
});
