
"use strict";

/* =========================================
   1. KONFIGURASI WEBSITE
   Ubah nama cafe dan nomor WhatsApp di sini.
   Nomor memakai kode negara 62 tanpa tanda +.
   ========================================= */

const KONFIGURASI = {
  namaCafe: "DigiMenu Cafe",
  nomorWhatsApp: "6281234567890"
};

/* =========================================
   2. DATA MENU
   Tambahkan produk baru dengan menyalin format objek.
   Harga menggunakan angka, bukan teks Rupiah.
   tersedia: false berarti menu sedang habis.
   ========================================= */

const menu = [
  {
    id: 1,
    nama: "Nasi Goreng",
    kategori: "Makanan",
    deskripsi: "Nasi goreng spesial dengan bumbu pilihan.",
    harga: 18000,
    foto: "https://placehold.co/600x400/f0e4d0/173f35?text=Nasi+Goreng",
    tersedia: true
  },
  {
    id: 2,
    nama: "Mie Goreng",
    kategori: "Makanan",
    deskripsi: "Mie goreng gurih dengan topping lezat.",
    harga: 15000,
    foto: "https://placehold.co/600x400/e9dfc8/173f35?text=Mie+Goreng",
    tersedia: true
  },
  {
    id: 3,
    nama: "Ayam Geprek",
    kategori: "Makanan",
    deskripsi: "Ayam renyah dengan sambal pilihan.",
    harga: 20000,
    foto: "https://placehold.co/600x400/f1d8c8/173f35?text=Ayam+Geprek",
    tersedia: true
  },
  {
    id: 4,
    nama: "Kentang Goreng",
    kategori: "Camilan",
    deskripsi: "Kentang goreng renyah untuk menemani santai.",
    harga: 12000,
    foto: "https://placehold.co/600x400/efdfb8/173f35?text=Kentang+Goreng",
    tersedia: true
  },
  {
    id: 5,
    nama: "Es Teh",
    kategori: "Minuman",
    deskripsi: "Teh manis segar yang cocok diminum kapan saja.",
    harga: 5000,
    foto: "https://placehold.co/600x400/d9e8d8/173f35?text=Es+Teh",
    tersedia: true
  },
  {
    id: 6,
    nama: "Kopi Susu",
    kategori: "Minuman",
    deskripsi: "Perpaduan kopi dan susu yang nikmat.",
    harga: 12000,
    foto: "https://placehold.co/600x400/e2d3c4/173f35?text=Kopi+Susu",
    tersedia: true
  },
  {
    id: 7,
    nama: "Jus Buah",
    kategori: "Minuman",
    deskripsi: "Minuman buah segar untuk menemani makan.",
    harga: 10000,
    foto: "https://placehold.co/600x400/e6e8c8/173f35?text=Jus+Buah",
    tersedia: true
  },
  {
    id: 8,
    nama: "Roti Bakar",
    kategori: "Camilan",
    deskripsi: "Roti panggang dengan topping manis.",
    harga: 10000,
    foto: "https://placehold.co/600x400/e9d1b6/173f35?text=Roti+Bakar",
    tersedia: false
  }
];

/* =========================================
   3. VARIABEL DAN ELEMEN HTML
   Keranjang menyimpan ID produk dan jumlahnya.
   Contoh: { 1: 2, 5: 1 }
   Artinya 2 nasi goreng dan 1 es teh.
   ========================================= */

const keranjang = {};

const elemen = {
  pencarian: document.getElementById("pencarian"),
  kategori: document.getElementById("filter-kategori"),
  daftarMenu: document.getElementById("daftar-menu"),
  infoMenu: document.getElementById("info-menu"),
  daftarKeranjang: document.getElementById("daftar-keranjang"),
  badgeKeranjang: document.getElementById("badge-keranjang"),
  jumlahItem: document.getElementById("jumlah-item"),
  subtotal: document.getElementById("subtotal"),
  totalHarga: document.getElementById("total-harga"),
  tombolPesan: document.getElementById("tombol-pesan"),
  kosongkan: document.getElementById("kosongkan-keranjang"),
  bukaKeranjang: document.getElementById("buka-keranjang"),
  notifikasi: document.getElementById("notifikasi"),
  tahun: document.getElementById("tahun")
};

/* =========================================
   4. FUNGSI PEMBANTU
   ========================================= */

// Mengubah angka menjadi format mata uang Rupiah.
function formatRupiah(angka) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(angka);
}

// Melindungi teks data ketika dimasukkan ke HTML.
function aman(teks) {
  return String(teks).replace(/[&<>"']/g, function(karakter) {
    const pengganti = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };

    return pengganti[karakter];
  });
}

// Mengambil produk berdasarkan ID.
function cariProduk(id) {
  return menu.find(function(produk) {
    return produk.id === Number(id);
  });
}

// Mengambil seluruh produk yang jumlahnya lebih dari nol.
function ambilPesanan() {
  return menu.filter(function(produk) {
    return Number(keranjang[produk.id]) > 0;
  });
}

// Menghitung jumlah seluruh unit barang.
function hitungJumlahItem() {
  return ambilPesanan().reduce(function(total, produk) {
    return total + keranjang[produk.id];
  }, 0);
}

// Menghitung total harga semua produk.
function hitungTotal() {
  return ambilPesanan().reduce(function(total, produk) {
    return total + produk.harga * keranjang[produk.id];
  }, 0);
}

/* =========================================
   5. NOTIFIKASI
   Menampilkan pesan ketika pelanggan berinteraksi.
   ========================================= */

let waktuNotifikasi;

function beriNotifikasi(pesan) {
  elemen.notifikasi.textContent = pesan;
  elemen.notifikasi.classList.add("show");

  clearTimeout(waktuNotifikasi);

  waktuNotifikasi = setTimeout(function() {
    elemen.notifikasi.classList.remove("show");
  }, 2200);
}

/* =========================================
   6. MENAMPILKAN KATALOG MENU
   Pencarian dilakukan berdasarkan nama dan deskripsi.
   Filter kategori menyaring jenis produk.
   ========================================= */

function tampilkanMenu() {
  const kataKunci = elemen.pencarian.value
    .trim()
    .toLocaleLowerCase("id-ID");

  const kategoriDipilih = elemen.kategori.value;

  const hasil = menu.filter(function(produk) {
    const teksProduk =
      (produk.nama + " " + produk.deskripsi).toLocaleLowerCase("id-ID");

    const cocokPencarian = teksProduk.includes(kataKunci);

    const cocokKategori =
      kategoriDipilih === "Semua" ||
      produk.kategori === kategoriDipilih;

    return cocokPencarian && cocokKategori;
  });

  // Menampilkan jumlah menu yang ditemukan.
  elemen.infoMenu.textContent =
    hasil.length + " menu ditemukan";

  // Menangani hasil pencarian yang kosong.
  if (hasil.length === 0) {
    elemen.daftarMenu.innerHTML = `
      <div class="empty-state">
        <h3>Menu tidak ditemukan</h3>
        <p>Coba kata kunci atau kategori lainnya.</p>
      </div>
    `;
    return;
  }

  // Membuat kartu untuk setiap produk.
  elemen.daftarMenu.innerHTML = hasil.map(function(produk) {
    const status = produk.tersedia
      ? "Tersedia"
      : "Menu Habis";

    const kelasStatus = produk.tersedia ? "" : "habis";

    return `
      <article class="menu-card">
        <div class="menu-image-wrap">
          <img
            class="menu-image"
            src="${aman(produk.foto)}"
            alt="${aman(produk.nama)}"
            loading="lazy"
          >

          <span class="menu-status ${kelasStatus}">
            ${status}
          </span>
        </div>

        <div class="menu-card-body">
          <span class="menu-category">
            ${aman(produk.kategori)}
          </span>

          <h3>${aman(produk.nama)}</h3>

          <p class="menu-description">
            ${aman(produk.deskripsi)}
          </p>

          <div class="menu-card-bottom">
            <span class="menu-price">
              ${formatRupiah(produk.harga)}
            </span>

            <button
              type="button"
              class="add-button"
              data-aksi="tambah"
              data-id="${produk.id}"
              ${produk.tersedia ? "" : "disabled"}
            >
              ${produk.tersedia ? "+ Tambah" : "Habis"}
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");

  // Mengganti gambar yang gagal dimuat dengan gambar cadangan.
  elemen.daftarMenu.querySelectorAll(".menu-image").forEach(
    function(gambar) {
      gambar.addEventListener("error", function() {
        gambar.removeAttribute("src");
        gambar.alt = "Gambar menu tidak tersedia";
      }, { once: true });
    }
  );
}

/* =========================================
   7. MENAMBAHKAN PRODUK KE KERANJANG
   Menggunakan event delegation agar lebih efisien.
   ========================================= */

elemen.daftarMenu.addEventListener("click", function(event) {
  const tombol = event.target.closest("[data-aksi='tambah']");

  if (!tombol) return;

  const produk = cariProduk(tombol.dataset.id);

  // Memastikan produk benar-benar tersedia.
  if (!produk || !produk.tersedia) {
    beriNotifikasi("Maaf, menu sedang tidak tersedia.");
    return;
  }

  // Menambah jumlah produk yang dipilih.
  keranjang[produk.id] = (keranjang[produk.id] || 0) + 1;

  simpanKeranjang();
  tampilkanKeranjang();

  beriNotifikasi(produk.nama + " ditambahkan ke keranjang.");
});

/* =========================================
   8. MENAMPILKAN KERANJANG DAN TOTAL HARGA
   ========================================= */

function tampilkanKeranjang() {
  const pesanan = ambilPesanan();

  // Jika belum ada produk yang dipilih.
  if (pesanan.length === 0) {
    elemen.daftarKeranjang.innerHTML = `
      <div class="cart-empty">
        <strong>Keranjang masih kosong</strong>
        <p>Silakan pilih makanan atau minuman dari katalog.</p>
      </div>
    `;
  } else {
    // Menampilkan setiap produk dalam keranjang.
    elemen.daftarKeranjang.innerHTML = pesanan.map(function(produk) {
      const jumlah = keranjang[produk.id];
      const subtotalProduk = produk.harga * jumlah;

      return `
        <article class="cart-item">
          <div>
            <h3>${aman(produk.nama)}</h3>

            <p class="cart-item-price">
              ${formatRupiah(produk.harga)} per item
            </p>

            <p class="cart-item-subtotal">
              ${formatRupiah(subtotalProduk)}
            </p>
          </div>

          <div class="cart-controls">
            <button
              type="button"
              class="quantity-button"
              data-aksi="kurang"
              data-id="${produk.id}"
              aria-label="Kurangi ${aman(produk.nama)}"
            >−</button>

            <span class="quantity-value">${jumlah}</span>

            <button
              type="button"
              class="quantity-button"
              data-aksi="tambah-jumlah"
              data-id="${produk.id}"
              aria-label="Tambah ${aman(produk.nama)}"
            >+</button>

            <button
              type="button"
              class="remove-button"
              data-aksi="hapus"
              data-id="${produk.id}"
            >Hapus</button>
          </div>
        </article>
      `;
    }).join("");
  }

  // Memperbarui ringkasan jumlah dan harga.
  const jumlah = hitungJumlahItem();
  const total = hitungTotal();

  elemen.badgeKeranjang.textContent = jumlah;
  elemen.jumlahItem.textContent = jumlah + " item";
  elemen.subtotal.textContent = formatRupiah(total);
  elemen.totalHarga.textContent = formatRupiah(total);

  // Tombol pesan dinonaktifkan jika keranjang kosong.
  elemen.tombolPesan.disabled = jumlah === 0;

  // Tombol kosongkan dinonaktifkan jika keranjang kosong.
  elemen.kosongkan.disabled = jumlah === 0;
}

/* =========================================
   9. MENGUBAH JUMLAH DAN MENGHAPUS PRODUK
   ========================================= */

elemen.daftarKeranjang.addEventListener("click", function(event) {
  const tombol = event.target.closest("[data-aksi]");

  if (!tombol) return;

  const aksi = tombol.dataset.aksi;
  const id = Number(tombol.dataset.id);
  const produk = cariProduk(id);

  if (!produk || !keranjang[id]) return;

  if (aksi === "kurang") {
    keranjang[id]--;

    // Menghapus produk jika jumlahnya menjadi nol.
    if (keranjang[id] <= 0) {
      delete keranjang[id];
    }
  }

  if (aksi === "tambah-jumlah") {
    // Tidak mengizinkan penambahan produk yang sudah habis.
    if (!produk.tersedia) {
      beriNotifikasi("Menu tersebut sedang habis.");
      return;
    }

    keranjang[id]++;
  }

  if (aksi === "hapus") {
    delete keranjang[id];
    beriNotifikasi(produk.nama + " dihapus dari keranjang.");
  }

  simpanKeranjang();
  tampilkanKeranjang();
});

/* =========================================
   10. MENGOSONGKAN KERANJANG
   ========================================= */

elemen.kosongkan.addEventListener("click", function() {
  // Menghapus seluruh isi keranjang.
  Object.keys(keranjang).forEach(function(id) {
    delete keranjang[id];
  });

  simpanKeranjang();
  tampilkanKeranjang();

  beriNotifikasi("Keranjang berhasil dikosongkan.");
});

/* =========================================
   11. PENCARIAN DAN FILTER KATEGORI
   ========================================= */

// Menu diperbarui ketika pengguna mengetik.
elemen.pencarian.addEventListener("input", tampilkanMenu);

// Menu diperbarui ketika kategori diganti.
elemen.kategori.addEventListener("change", tampilkanMenu);

/* =========================================
   12. PENYIMPANAN KERANJANG DI BROWSER
   localStorage menyimpan data di perangkat yang sama.
   Data ini bukan database bersama untuk seluruh pelanggan.
   ========================================= */

const KUNCI_PENYIMPANAN = "digimenu_keranjang_v1";

function simpanKeranjang() {
  try {
    localStorage.setItem(
      KUNCI_PENYIMPANAN,
      JSON.stringify(keranjang)
    );
  } catch (error) {
    // Website tetap dapat digunakan meskipun penyimpanan gagal.
    console.warn("Keranjang tidak dapat disimpan di browser.");
  }
}

function muatKeranjang() {
  try {
    const data = localStorage.getItem(KUNCI_PENYIMPANAN);

    if (!data) return;

    const tersimpan = JSON.parse(data);

    // Pastikan data yang dipulihkan berbentuk objek.
    if (
      !tersimpan ||
      typeof tersimpan !== "object" ||
      Array.isArray(tersimpan)
    ) {
      return;
    }

    Object.entries(tersimpan).forEach(function([id, jumlah]) {
      const produk = cariProduk(id);

      // Hanya memulihkan ID yang valid dan produk yang tersedia.
      if (
        produk &&
        produk.tersedia &&
        Number.isSafeInteger(jumlah) &&
        jumlah > 0 &&
        jumlah <= 99
      ) {
        keranjang[produk.id] = jumlah;
      }
    });
  } catch (error) {
    console.warn("Data keranjang lama tidak dapat dibaca.");
  }
}

/* =========================================
   13. MEMBUKA KERANJANG DARI NAVIGASI
   ========================================= */

elemen.bukaKeranjang.addEventListener("click", function() {
  document.getElementById("keranjang").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

/* =========================================
   14. KONFIRMASI PESANAN VIA WHATSAPP
   Pelanggan tetap perlu memeriksa dan mengirim pesan.
   ========================================= */

function nomorWhatsAppValid(nomor) {
  // Nomor harus terdiri dari 8 sampai 15 digit
  // dan dimulai dengan kode negara yang sesuai.
  return /^[1-9]\d{7,14}$/.test(nomor);
}

elemen.tombolPesan.addEventListener("click", function() {
  const pesanan = ambilPesanan();

  if (pesanan.length === 0) {
    beriNotifikasi("Pilih menu terlebih dahulu.");
    return;
  }

  if (!nomorWhatsAppValid(KONFIGURASI.nomorWhatsApp)) {
    beriNotifikasi("Nomor WhatsApp cafe belum benar.");
    return;
  }

  // Membuat rincian pesanan.
  const rincian = pesanan.map(function(produk) {
    const jumlah = keranjang[produk.id];

    return (
      "- " + produk.nama +
      " x" + jumlah +
      " = " + formatRupiah(produk.harga * jumlah)
    );
  });

  const total = hitungTotal();

  // Menyusun pesan yang akan dibuka di WhatsApp.
  const pesan = [
    "Halo " + KONFIGURASI.namaCafe + ", saya ingin memesan:",
    "",
    ...rincian,
    "",
    "Jumlah item: " + hitungJumlahItem(),
    "Total: " + formatRupiah(total),
    "",
    "Mohon konfirmasi pesanan saya. Terima kasih."
  ].join("\n");

  // Mengubah pesan agar aman digunakan dalam URL.
  const tautan =
    "https://wa.me/" +
    KONFIGURASI.nomorWhatsApp +
    "?text=" +
    encodeURIComponent(pesan);

  // Membuka WhatsApp di tab baru.
  // Pelanggan harus menekan tombol Kirim di WhatsApp.
  const jendela = window.open(
    tautan,
    "_blank",
    "noopener,noreferrer"
  );

  // Jika browser memblokir tab baru, tampilkan tautan alternatif.
  if (!jendela) {
    beriNotifikasi(
      "WhatsApp tidak terbuka. Izinkan tab baru di browser."
    );
  }
});

/* =========================================
   15. INISIALISASI WEBSITE
   Dijalankan saat file JavaScript pertama kali dibaca.
   ========================================= */

// Mengisi tahun secara otomatis.
elemen.tahun.textContent = new Date().getFullYear();

// Memulihkan keranjang yang tersimpan di browser.
muatKeranjang();

// Menampilkan katalog dan isi keranjang.
tampilkanMenu();
tampilkanKeranjang();
