// ===============================
// PRELOADER
// ===============================

window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  if (preloader) {
    setTimeout(() => preloader.classList.add("hide"), 400);
  }
});


// ===============================
// PAGE TRANSITION SAAT PINDAH HALAMAN
// ===============================

document.querySelectorAll('a[href$=".html"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");
    if (!href || link.target === "_blank") return;

    e.preventDefault();
    document.body.classList.add("page-leaving");

    setTimeout(() => {
      window.location.href = href;
    }, 320);
  });
});


// ===============================
// SCROLL REVEAL ANIMATION
// ===============================

function initScrollReveal() {

  const revealTargets = document.querySelectorAll(
    ".menu-card, .cute-box, .story-item, .gallery-card, .testi-item, .card, .quote-card"
  );

  revealTargets.forEach((el) => el.classList.add("reveal"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealTargets.forEach((el) => observer.observe(el));
}

initScrollReveal();


// ===============================
// SCROLL TO TOP BUTTON
// ===============================

const scrollTopBtn = document.getElementById("scrollTopBtn");

if (scrollTopBtn) {

  window.addEventListener("scroll", () => {
    if (window.scrollY > 350) {
      scrollTopBtn.classList.add("show");
    } else {
      scrollTopBtn.classList.remove("show");
    }
  });

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}


// ===============================
// NOTIFIKASI
// ===============================

function showNotification(message) {

  const notif = document.createElement("div");

  notif.className = "cute-notification";
  notif.innerHTML = message;

  document.body.appendChild(notif);

  setTimeout(() => {
    notif.classList.add("show");
  }, 100);

  setTimeout(() => {

    notif.classList.remove("show");

    setTimeout(() => {
      notif.remove();
    }, 500);

  }, 3000);
}

function formatRupiah(angka) {
  return "Rp " + Number(angka || 0).toLocaleString("id-ID");
}


// ===============================
// KONFETI 🎉
// ===============================

function launchConfetti() {

  const container = document.getElementById("confettiContainer");

  if (!container) return;

  const colors = ["#ff9fc4", "#ffd88c", "#ffb6cf", "#fff1c2", "#c1f0d8", "#bcd8ff"];

  for (let i = 0; i < 60; i++) {

    const piece = document.createElement("div");
    piece.className = "confetti-piece";

    const size = Math.random() * 8 + 6;
    piece.style.width = size + "px";
    piece.style.height = size + "px";
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = (Math.random() * 2 + 2.5) + "s";
    piece.style.borderRadius = Math.random() > .5 ? "50%" : "3px";

    container.appendChild(piece);

    setTimeout(() => piece.remove(), 5000);
  }
}


// ===============================
// HAMBURGER MENU (MOBILE)
// ===============================

const hamburgerBtn = document.getElementById("hamburgerBtn");
const navLinks = document.getElementById("navLinks");

if (hamburgerBtn && navLinks) {
  hamburgerBtn.addEventListener("click", () => {
    hamburgerBtn.classList.toggle("open");
    navLinks.classList.toggle("open");
  });

  navLinks.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      hamburgerBtn.classList.remove("open");
      navLinks.classList.remove("open");
    });
  });
}


// ===============================
// DARK MODE
// ===============================

const themeToggle = document.getElementById("themeToggle");

function applyTheme(theme) {
  document.body.setAttribute("data-theme", theme);
  if (themeToggle) {
    themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
  }
}

const savedTheme = localStorage.getItem("theme") || "light";
applyTheme(savedTheme);

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const current = document.body.getAttribute("data-theme") === "dark" ? "light" : "dark";
    localStorage.setItem("theme", current);
    applyTheme(current);
  });
}


// ===============================
// PILIH MENU (FORM PESANAN)
// ===============================

let selectedMenu = {};

const menuCards = document.querySelectorAll(".menu-card");
const summaryBox = document.getElementById("orderSummary");
const summaryList = document.getElementById("summaryList");
const summaryTotal = document.getElementById("summaryTotal");
const totalEstimasiTampil = document.getElementById("totalEstimasiTampil");
const keteranganField = document.getElementById("keterangan");
const autoFillHint = document.getElementById("autoFillHint");
const clearSummaryBtn = document.getElementById("clearSummary");

function renderSummary() {

  const namaItem = Object.keys(selectedMenu);

  if (!summaryBox) return;

  if (namaItem.length === 0) {
    summaryBox.hidden = true;
    if (autoFillHint) autoFillHint.textContent = "";
    if (totalEstimasiTampil) totalEstimasiTampil.value = formatRupiah(0);
    return;
  }

  summaryBox.hidden = false;
  summaryList.innerHTML = "";

  let total = 0;
  const ringkasanTeks = [];

  namaItem.forEach((nama) => {
    const item = selectedMenu[nama];
    const subtotal = item.price * item.qty;
    total += subtotal;

    summaryList.innerHTML += `
      <li>
        <span>${item.emoji} ${nama} x ${item.qty}</span>
        <span>${formatRupiah(subtotal)}</span>
      </li>
    `;

    ringkasanTeks.push(`${nama} x${item.qty}`);
  });

  summaryTotal.textContent = formatRupiah(total);

  if (totalEstimasiTampil) totalEstimasiTampil.value = formatRupiah(total);

  if (autoFillHint) {
    autoFillHint.textContent = "💡 Otomatis tersinkron dengan menu yang dipilih.";
  }

  if (keteranganField && !keteranganField.dataset.manual) {
    keteranganField.value = ringkasanTeks.join(", ");
  }
}

if (keteranganField) {
  keteranganField.addEventListener("input", () => {
    keteranganField.dataset.manual = "true";
  });
}

if (menuCards.length > 0) {

  menuCards.forEach((card) => {

    card.addEventListener("click", () => {

      const nama = card.dataset.name;
      const price = parseInt(card.dataset.price, 10);
      const emoji = card.dataset.emoji;
      const badge = card.querySelector(".qty-badge");

      if (selectedMenu[nama]) {
        selectedMenu[nama].qty += 1;
      } else {
        selectedMenu[nama] = { price, qty: 1, emoji };
      }

      card.classList.add("selected");

      if (badge) {
        badge.hidden = false;
        badge.textContent = selectedMenu[nama].qty;
      }

      renderSummary();
    });

    card.addEventListener("contextmenu", (e) => {
      e.preventDefault();

      const nama = card.dataset.name;
      const badge = card.querySelector(".qty-badge");

      if (!selectedMenu[nama]) return;

      selectedMenu[nama].qty -= 1;

      if (selectedMenu[nama].qty <= 0) {
        delete selectedMenu[nama];
        card.classList.remove("selected");
        if (badge) badge.hidden = true;
      } else if (badge) {
        badge.textContent = selectedMenu[nama].qty;
      }

      renderSummary();
    });
  });
}

if (clearSummaryBtn) {
  clearSummaryBtn.addEventListener("click", () => {
    selectedMenu = {};
    menuCards.forEach((card) => {
      card.classList.remove("selected");
      const badge = card.querySelector(".qty-badge");
      if (badge) badge.hidden = true;
    });
    if (keteranganField) {
      keteranganField.value = "";
      keteranganField.dataset.manual = "";
    }
    renderSummary();
  });
}


// ===============================
// FORM PESANAN
// ===============================

const form = document.getElementById("orderForm");

if (form) {

  const tanggalInput = document.getElementById("tanggal");

  if (tanggalInput) {
    const today = new Date().toISOString().split("T")[0];
    tanggalInput.min = today;
  }

  form.addEventListener("submit", function (e) {

    e.preventDefault();

    const nama = document.getElementById("nama").value;
    const nohp = document.getElementById("nohp").value;
    const tanggal = document.getElementById("tanggal").value;
    const layanan = document.getElementById("layanan").value;
    const keterangan = document.getElementById("keterangan").value;
    const status = document.getElementById("status") ? document.getElementById("status").value : "Pending";

    if (!nama || !nohp || !layanan || !tanggal) {

      alert("Mohon lengkapi data terlebih dahulu!");

      return;
    }

    let dataPesanan =
      JSON.parse(localStorage.getItem("dataPesanan")) || [];

    const editIndex =
      localStorage.getItem("editIndex");

    const total = Object.values(selectedMenu).reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );

    const dataBaru = {
      nama,
      nohp,
      tanggal,
      layanan,
      keterangan,
      status,
      total,
      menu: selectedMenu,
      waktu: new Date().toLocaleString("id-ID")
    };

    if (editIndex !== null) {

      dataPesanan[editIndex] = dataBaru;

      localStorage.removeItem("editIndex");

      showNotification(
"🧁 Pesanan berhasil diperbarui dengan manis 💖"
);

    } else {

      dataPesanan.push(dataBaru);

      showNotification(
        "🎂 Yeay! Pesanan kamu sudah masuk ke dapur Honeycrumb 💖"
      );
    }

    localStorage.setItem(
      "dataPesanan",
      JSON.stringify(dataPesanan)
    );

    launchConfetti();

    form.reset();
    selectedMenu = {};
    renderSummary();

    setTimeout(() => {
      window.location.href = "data.html";
    }, 1500);

  });


  // ===============================
  // AUTO ISI SAAT EDIT
  // ===============================

  const editIndex =
    localStorage.getItem("editIndex");

  if (editIndex !== null) {

    let dataPesanan =
      JSON.parse(localStorage.getItem("dataPesanan")) || [];

    const data =
      dataPesanan[editIndex];

    if (data) {

      document.getElementById("nama").value =
        data.nama;

      document.getElementById("nohp").value =
        data.nohp;

      document.getElementById("tanggal").value =
        data.tanggal || "";

      document.getElementById("layanan").value =
        data.layanan;

      document.getElementById("keterangan").value =
        data.keterangan;

      if (data.keterangan && keteranganField) {
        keteranganField.dataset.manual = "true";
      }

      const statusSelect = document.getElementById("status");
      if (statusSelect && data.status) {
        statusSelect.value = data.status;
      }

      if (data.menu) {
        selectedMenu = data.menu;

        Object.keys(selectedMenu).forEach((nama) => {
          const card = document.querySelector(`.menu-card[data-name="${nama}"]`);
          if (card) {
            card.classList.add("selected");
            const badge = card.querySelector(".qty-badge");
            if (badge) {
              badge.hidden = false;
              badge.textContent = selectedMenu[nama].qty;
            }
          }
        });

        renderSummary();
      }
    }
  }
}


// ===============================
// TAMPILKAN DATA KE TABEL (DATA.HTML)
// ===============================

const tbody =
  document.getElementById("dataTableBody");

let allData = [];

function getAllData() {
  return JSON.parse(localStorage.getItem("dataPesanan")) || [];
}

function renderTable() {

  if (!tbody) return;

  const searchVal = document.getElementById("searchInput")
    ? document.getElementById("searchInput").value.trim().toLowerCase()
    : "";

  const filterStatusVal = document.getElementById("filterStatus")
    ? document.getElementById("filterStatus").value
    : "";

  allData = getAllData();

  const countPill = document.getElementById("countPill");
  const totalPesanan = document.getElementById("totalPesanan");
  const bestSeller = document.getElementById("bestSeller");
  const totalOmzet = document.getElementById("totalOmzet");

  if (countPill) countPill.textContent = allData.length + " Pesanan";
  if (totalPesanan) totalPesanan.textContent = allData.length;

  // Hitung best seller & omzet dari semua data (tidak terpengaruh filter)
  const itemCount = {};
  let omzet = 0;

  allData.forEach((item) => {
    omzet += item.total || 0;

    if (item.menu) {
      Object.keys(item.menu).forEach((nama) => {
        itemCount[nama] = (itemCount[nama] || 0) + item.menu[nama].qty;
      });
    }
  });

  if (totalOmzet) totalOmzet.textContent = formatRupiah(omzet);

  if (bestSeller) {
    const namaTeratas = Object.keys(itemCount).sort(
      (a, b) => itemCount[b] - itemCount[a]
    )[0];
    bestSeller.textContent = namaTeratas ? namaTeratas : "Belum ada data";
  }

  // Filter data untuk ditampilkan
  let filtered = allData.filter((item) => {
    const matchSearch =
      !searchVal ||
      item.nama.toLowerCase().includes(searchVal) ||
      item.nohp.toLowerCase().includes(searchVal);

    const matchStatus = !filterStatusVal || item.status === filterStatusVal;

    return matchSearch && matchStatus;
  });

  const emptyState = document.getElementById("emptyState");
  const noResultState = document.getElementById("noResultState");
  const tableWrap = document.getElementById("tableWrap");

  if (allData.length === 0) {

    if (emptyState) emptyState.style.display = "block";
    if (noResultState) noResultState.hidden = true;
    if (tableWrap) tableWrap.style.display = "none";
    tbody.innerHTML = "";
    return;

  }

  if (emptyState) emptyState.style.display = "none";

  if (filtered.length === 0) {
    if (noResultState) noResultState.hidden = false;
    if (tableWrap) tableWrap.style.display = "none";
    tbody.innerHTML = "";
    return;
  }

  if (noResultState) noResultState.hidden = true;
  if (tableWrap) tableWrap.style.display = "block";

  tbody.innerHTML = "";

  filtered.forEach((item) => {

    const realIndex = allData.indexOf(item);
    const status = item.status || "Pending";
    const waNumber = item.nohp.replace(/^0/, "62").replace(/\D/g, "");
    const waMessage = encodeURIComponent(
      `Halo ${item.nama}! 🧁 Pesanan kamu (${item.layanan}) untuk tanggal ${item.tanggal || "-"} sudah kami catat ya. Status saat ini: ${status}. Terima kasih sudah memesan di Honeycrumb Bakery 💖`
    );

    tbody.innerHTML += `
      <tr>
        <td data-label="No">${realIndex + 1}</td>
        <td data-label="Nama">${item.nama}</td>
        <td data-label="No HP">${item.nohp}</td>
        <td data-label="Tanggal Ambil">${item.tanggal || "-"}</td>
        <td data-label="Jenis Layanan">${item.layanan}</td>
        <td data-label="Keterangan">${item.keterangan || "-"}</td>
        <td data-label="Total">${formatRupiah(item.total || 0)}</td>
        <td data-label="Status">
          <select class="status-badge status-${status}" onchange="updateStatus(${realIndex}, this.value)">
            <option value="Pending" ${status === "Pending" ? "selected" : ""}>⏳ Pending</option>
            <option value="Diproses" ${status === "Diproses" ? "selected" : ""}>🍳 Diproses</option>
            <option value="Selesai" ${status === "Selesai" ? "selected" : ""}>✅ Selesai</option>
          </select>
        </td>
        <td data-label="Aksi">
          <button class="action-btn edit-btn" onclick="editData(${realIndex})">✏️ Edit</button>
          <button class="action-btn delete-btn" onclick="hapusData(${realIndex})">🗑️ Hapus</button>
          <a class="action-btn whatsapp-btn" href="https://wa.me/${waNumber}?text=${waMessage}" target="_blank">💬 WA</a>
        </td>
      </tr>
    `;
  });
}

if (tbody) {

  renderTable();

  const searchInput = document.getElementById("searchInput");
  const filterStatus = document.getElementById("filterStatus");

  if (searchInput) searchInput.addEventListener("input", renderTable);
  if (filterStatus) filterStatus.addEventListener("change", renderTable);

  const exportBtn = document.getElementById("exportBtn");

  if (exportBtn) {
    exportBtn.addEventListener("click", () => {

      const data = getAllData();

      if (data.length === 0) {
        showNotification("🍪 Belum ada data untuk diexport");
        return;
      }

      const header = ["Nama", "No HP", "Tanggal Ambil", "Layanan", "Keterangan", "Total", "Status", "Waktu Input"];

      const rows = data.map((item) => [
        item.nama,
        item.nohp,
        item.tanggal || "-",
        item.layanan,
        (item.keterangan || "-").replace(/,/g, ";"),
        item.total || 0,
        item.status || "Pending",
        item.waktu
      ]);

      let csv = header.join(",") + "\n";
      rows.forEach((row) => {
        csv += row.join(",") + "\n";
      });

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "data-pesanan-honeycrumb.csv";
      link.click();
      URL.revokeObjectURL(url);

      showNotification("⬇️ Data pesanan berhasil diexport ke CSV 💖");
    });
  }
}


// ===============================
// UPDATE STATUS PESANAN
// ===============================

function updateStatus(index, newStatus) {

  let dataPesanan = getAllData();

  if (dataPesanan[index]) {
    dataPesanan[index].status = newStatus;
    localStorage.setItem("dataPesanan", JSON.stringify(dataPesanan));
    showNotification("📌 Status pesanan diperbarui menjadi " + newStatus);
    renderTable();
  }
}


// ===============================
// HAPUS DATA
// ===============================

let deleteIndex = null;


function hapusData(index){

    deleteIndex = index;


    document
    .getElementById("deleteModal")
    .classList.add("show");

}



function closeDeleteModal(){

    document
    .getElementById("deleteModal")
    .classList.remove("show");


    showNotification(
        "🍰 Penghapusan pesanan dibatalkan"
    );

}



function confirmDelete(){


    let dataPesanan =
    JSON.parse(localStorage.getItem("dataPesanan")) || [];


    dataPesanan.splice(deleteIndex,1);


    localStorage.setItem(
        "dataPesanan",
        JSON.stringify(dataPesanan)
    );


    document
    .getElementById("deleteModal")
    .classList.remove("show");


    showNotification(
        "🗑️ Pesanan berhasil dihapus dari Honeycrumb 💖"
    );


    setTimeout(()=>{

        location.reload();

    },1200);

}


// ===============================
// EDIT DATA
// ===============================

function editData(index) {


  showNotification(
    "✏️ Membuka menu edit pesanan 🧁"
  );


  localStorage.setItem(
    "editIndex",
    index
  );


  setTimeout(()=>{

    window.location.href =
      "index.html";

  },1000);


}
