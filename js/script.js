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

    if (!nama || !nohp || !layanan || !tanggal) {

      alert("Mohon lengkapi data terlebih dahulu!");

      return;
    }

    let dataPesanan =
      JSON.parse(localStorage.getItem("dataPesanan")) || [];

    const editIndex =
      localStorage.getItem("editIndex");

    const dataBaru = {
      nama,
      nohp,
      tanggal,
      layanan,
      keterangan,
      waktu: new Date().toLocaleString("id-ID")
    };

    const isEdit = editIndex !== null;

    if (isEdit) {

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

    form.reset();

    const overlay = document.getElementById("successOverlay");

    if (overlay) {

      const overlayTitle = overlay.querySelector("h3");
      const overlayText = overlay.querySelector("p");

      if (isEdit) {
        overlayTitle.textContent = "Pesanan Diperbarui!";
        overlayText.textContent = "Perubahan pesananmu sudah disimpan. Mengarahkan ke halaman data...";
      } else {
        overlayTitle.textContent = "Pesanan Terkirim!";
        overlayText.textContent = "Yeay, pesananmu sudah masuk ke dapur Honeycrumb. Mengarahkan ke halaman data...";
      }

      overlay.classList.add("show");
    }

    setTimeout(() => {
      window.location.href = "data.html";
    }, 1600);

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
    }
  }
}


// ===============================
// TAMPILKAN DATA KE TABEL
// ===============================

const tbody =
  document.getElementById("dataTableBody");

if (tbody) {

  let dataPesanan =
    JSON.parse(localStorage.getItem("dataPesanan")) || [];

  const countPill =
    document.getElementById("countPill");

  const totalPesanan =
    document.getElementById("totalPesanan");

  if (countPill) {

    countPill.textContent =
      dataPesanan.length + " Pesanan";
  }

  if (totalPesanan) {

    totalPesanan.textContent =
      dataPesanan.length;
  }

  if (dataPesanan.length === 0) {

    document.getElementById("emptyState").style.display =
      "block";

    document.getElementById("tableWrap").style.display =
      "none";

  } else {

    document.getElementById("emptyState").style.display =
      "none";

    document.getElementById("tableWrap").style.display =
      "block";

    dataPesanan.forEach((item, index) => {

      tbody.innerHTML += `
        <tr>
          <td>${index + 1}</td>
          <td>${item.nama}</td>
          <td>${item.nohp}</td>
          <td>${item.tanggal || "-"}</td>
          <td>${item.layanan}</td>
          <td>${item.keterangan || "-"}</td>
          <td>${item.waktu}</td>
          <td>
            <button
class="action-btn edit-btn"
onclick="editData(${index})">
✏️ Edit
</button>


<button
class="action-btn delete-btn"
onclick="hapusData(${index})">
🗑️ Hapus
</button>

            

          </td>

        </tr>
      `;
    });
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

// ===============================
// BACKGROUND DECOR — CUTE FLOATING
// (cupcake, donut, sprinkles, hati, bintang)
// Dipasang otomatis di semua halaman
// ===============================

function initBackgroundDecor() {

  const existing = document.querySelector(".bg-decor");
  if (existing) return; // jangan dobel kalau sudah ada

  const wrap = document.createElement("div");
  wrap.className = "bg-decor";

  const icons = ["🧁", "🍩", "🍰", "🍪", "🎂", "🍓", "💖", "✨", "⭐", "🌸"];
  const totalItems = window.innerWidth < 600 ? 16 : 26;

  for (let i = 0; i < totalItems; i++) {

    const el = document.createElement("span");
    const icon = icons[Math.floor(Math.random() * icons.length)];

    el.textContent = icon;

    if (icon === "✨" || icon === "⭐") {
      el.classList.add("sparkle");
    }

    const size = (Math.random() * 1.6 + 1).toFixed(2);
    const left = (Math.random() * 100).toFixed(2);
    const duration = (Math.random() * 12 + 14).toFixed(1);
    const delay = (Math.random() * 18).toFixed(1);

    el.style.left = left + "vw";
    el.style.fontSize = size + "rem";
    el.style.setProperty("--fall-duration", duration + "s");
    el.style.animationDuration = duration + "s";
    el.style.animationDelay = "-" + delay + "s";

    wrap.appendChild(el);
  }

  document.body.prepend(wrap);
}

document.addEventListener("DOMContentLoaded", initBackgroundDecor);
