
"use strict";

/* =========================================
   1. DATA MENU
   Semua data disimpan langsung di JavaScript.
   Tidak menggunakan database.
   ========================================= */

const menus = [
    {
        id: 1,
        name: "Nasi Goreng Spesial",
        category: "Makanan Berat",
        price: 18000,
        description: "Nasi goreng dengan telur dan sayuran.",
        icon: "🍛",
        available: true
    },
    {
        id: 2,
        name: "Mie Goreng",
        category: "Makanan Berat",
        price: 15000,
        description: "Mie goreng gurih dengan sayuran.",
        icon: "🍜",
        available: true
    },
    {
        id: 3,
        name: "Burger Spesial",
        category: "Makanan Berat",
        price: 22000,
        description: "Burger dengan sayuran dan saus spesial.",
        icon: "🍔",
        available: true
    },
    {
        id: 4,
        name: "Kentang Goreng",
        category: "Camilan",
        price: 12000,
        description: "Kentang goreng renyah untuk teman santai.",
        icon: "🍟",
        available: false
    },
    {
        id: 5,
        name: "Es Kopi Susu",
        category: "Minuman",
        price: 15000,
        description: "Perpaduan kopi, susu, dan es.",
        icon: "🧋",
        available: true
    },
    {
        id: 6,
        name: "Matcha Latte",
        category: "Minuman",
        price: 18000,
        description: "Minuman matcha dengan susu yang lembut.",
        icon: "🍵",
        available: true
    }
];


/* =========================================
   2. TEMPAT MENYIMPAN PESANAN SEMENTARA

   Contoh:
   cart[1] = 2 berarti membeli 2 Nasi Goreng.
   cart[5] = 1 berarti membeli 1 Es Kopi Susu.

   Data ini hanya disimpan selama halaman
   digunakan dan tidak masuk ke database.
   ========================================= */

const cart = {};

let activeCategory = "Semua";


/* =========================================
   3. MENGAMBIL ELEMEN HTML
   JavaScript memakai ID berikut untuk
   memperbarui tampilan halaman.
   ========================================= */

const searchInput = document.getElementById("searchInput");
const categoryButtons = document.getElementById("categoryButtons");
const menuGrid = document.getElementById("menuGrid");
const resultCount = document.getElementById("resultCount");

const cartCount = document.getElementById("cartCount");
const summaryCount = document.getElementById("summaryCount");
const cartItems = document.getElementById("cartItems");
const cartEmpty = document.getElementById("cartEmpty");
const cartTotal = document.getElementById("cartTotal");
const clearCartBtn = document.getElementById("clearCartBtn");


/* =========================================
   4. FORMAT HARGA MENJADI RUPIAH
   Contoh: 18000 menjadi Rp18.000
   ========================================= */

function formatRupiah(price) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(price);
}


/* =========================================
   5. MEMBUAT TOMBOL KATEGORI
   Kategori dibuat berdasarkan data menu.
   ========================================= */

function renderCategories() {
    const categories = [
        "Semua",
        ...new Set(menus.map(menu => menu.category))
    ];

    categoryButtons.innerHTML = categories.map(category => `
        <button
            type="button"
            class="category-btn ${
                category === activeCategory ? "active" : ""
            }"
            data-category="${category}"
            aria-pressed="${category === activeCategory}"
        >
            ${category}
        </button>
    `).join("");
}


/* =========================================
   6. MENAMPILKAN DAFTAR MENU
   Memproses pencarian, kategori, harga,
   status, dan tombol tambah pesanan.
   ========================================= */

function renderMenus() {
    const keyword = searchInput.value.trim().toLowerCase();

    // Menyaring menu berdasarkan pencarian dan kategori.
    const filteredMenus = menus.filter(menu => {
        const matchesSearch =
            menu.name.toLowerCase().includes(keyword) ||
            menu.category.toLowerCase().includes(keyword) ||
            menu.description.toLowerCase().includes(keyword);

        const matchesCategory =
            activeCategory === "Semua" ||
            menu.category === activeCategory;

        return matchesSearch && matchesCategory;
    });

    // Pesan jika menu tidak ditemukan.
    if (filteredMenus.length === 0) {
        menuGrid.innerHTML = `
            <div class="empty-message">
                <h3>Menu tidak ditemukan</h3>
                <p>Coba kata kunci lainnya.</p>
            </div>
        `;
    } else {
        // Membuat kartu untuk setiap menu.
        menuGrid.innerHTML = filteredMenus.map(menu => {
            const quantity = cart[menu.id] || 0;

            return `
                <article class="menu-card">

                    <div class="menu-visual" aria-hidden="true">
                        ${menu.icon}
                    </div>

                    <div class="menu-info">

                        <span class="menu-category">
                            ${menu.category}
                        </span>

                        <h3>${menu.name}</h3>

                        <p class="menu-description">
                            ${menu.description}
                        </p>

                        <div class="menu-bottom">

                            <span class="menu-price">
                                ${formatRupiah(menu.price)}
                            </span>

                            <span class="status ${
                                menu.available
                                    ? "available"
                                    : "unavailable"
                            }">
                                ${menu.available ? "Tersedia" : "Habis"}
                            </span>

                        </div>

                        ${
                            quantity > 0
                                ? `<p>Jumlah dipilih: ${quantity}</p>`
                                : ""
                        }

                        <button
                            type="button"
                            class="add-btn"
                            data-add-id="${menu.id}"
                            ${menu.available ? "" : "disabled"}
                        >
                            ${
                                menu.available
                                    ? "Tambah ke Pesanan (+)"
                                    : "Menu Sedang Habis"
                            }
                        </button>

                    </div>

                </article>
            `;
        }).join("");
    }

    // Memperbarui jumlah hasil pencarian.
    resultCount.textContent =
        `${filteredMenus.length} menu ditemukan`;
}


/* =========================================
   7. MENAMBAH ATAU MENGURANGI JUMLAH MENU
   delta = 1 untuk menambah.
   delta = -1 untuk mengurangi.
   ========================================= */

function changeQuantity(id, delta) {
    const menu = menus.find(item => item.id === id);

    // Memastikan menu benar-benar tersedia.
    if (!menu || !menu.available) {
        return;
    }

    const currentQuantity = cart[id] || 0;
    const newQuantity = currentQuantity + delta;

    // Jika jumlah mencapai nol, hapus dari keranjang.
    if (newQuantity <= 0) {
        delete cart[id];
    } else {
        cart[id] = newQuantity;
    }

    // Segarkan kartu menu dan daftar pesanan.
    renderMenus();
    renderCart();
}


/* =========================================
   8. MENGHITUNG DAN MENAMPILKAN PESANAN
   Menghitung jumlah item dan total harga.
   ========================================= */

function renderCart() {
    // Mengambil menu yang jumlahnya lebih dari nol.
    const orderedMenus = menus.filter(
        menu => (cart[menu.id] || 0) > 0
    );

    let totalItems = 0;
    let totalPrice = 0;

    // Menjumlahkan semua kuantitas dan harga.
    orderedMenus.forEach(menu => {
        const quantity = cart[menu.id];

        totalItems += quantity;
        totalPrice += menu.price * quantity;
    });

    // Menampilkan jumlah seluruh item.
    cartCount.textContent = totalItems;
    summaryCount.textContent = `${totalItems} item`;

    // Menampilkan total harga seluruh pesanan.
    cartTotal.textContent = formatRupiah(totalPrice);

    // Menampilkan atau menyembunyikan pesan keranjang kosong.
    cartEmpty.hidden = orderedMenus.length > 0;
    cartItems.hidden = orderedMenus.length === 0;

    // Tombol kosongkan aktif jika ada pesanan.
    clearCartBtn.disabled = totalItems === 0;

    // Membuat daftar item yang sedang dipesan.
    cartItems.innerHTML = orderedMenus.map(menu => {
        const quantity = cart[menu.id];
        const subtotal = menu.price * quantity;

        return `
            <div class="cart-item">

                <div class="cart-item-info">
                    <h3>${menu.name}</h3>

                    <p>
                        ${formatRupiah(menu.price)} per item
                    </p>
                </div>

                <div class="quantity-controls">

                    <button
                        type="button"
                        class="quantity-btn"
                        data-cart-action="decrease"
                        data-id="${menu.id}"
                        aria-label="Kurangi ${menu.name}"
                    >
                        −
                    </button>

                    <span class="quantity-number">
                        ${quantity}
                    </span>

                    <button
                        type="button"
                        class="quantity-btn"
                        data-cart-action="increase"
                        data-id="${menu.id}"
                        aria-label="Tambah ${menu.name}"
                    >
                        +
                    </button>

                </div>

                <div class="cart-line-total">
                    ${formatRupiah(subtotal)}
                </div>

            </div>
        `;
    }).join("");
}


/* =========================================
   9. KLIK TOMBOL KATEGORI
   ========================================= */

categoryButtons.addEventListener("click", function(event) {
    const button = event.target.closest("button[data-category]");

    if (!button) {
        return;
    }

    activeCategory = button.dataset.category;

    renderCategories();
    renderMenus();
});


/* =========================================
   10. KLIK TOMBOL TAMBAH KE PESANAN
   ========================================= */

menuGrid.addEventListener("click", function(event) {
    const button = event.target.closest("button[data-add-id]");

    if (!button) {
        return;
    }

    const id = Number(button.dataset.addId);

    changeQuantity(id, 1);
});


/* =========================================
   11. KLIK TOMBOL + ATAU - DI KERANJANG
   ========================================= */

cartItems.addEventListener("click", function(event) {
    const button = event.target.closest("button[data-cart-action]");

    if (!button) {
        return;
    }

    const id = Number(button.dataset.id);
    const action = button.dataset.cartAction;

    if (action === "increase") {
        changeQuantity(id, 1);
    }

    if (action === "decrease") {
        changeQuantity(id, -1);
    }
});


/* =========================================
   12. PENCARIAN MENU
   ========================================= */

searchInput.addEventListener("input", renderMenus);


/* =========================================
   13. MENGOSONGKAN SEMUA PESANAN
   ========================================= */

clearCartBtn.addEventListener("click", function() {
    // Menghapus semua data jumlah pesanan.
    Object.keys(cart).forEach(id => {
        delete cart[id];
    });

    // Memperbarui tampilan setelah keranjang kosong.
    renderMenus();
    renderCart();
});


/* =========================================
   14. MENJALANKAN WEBSITE PERTAMA KALI
   ========================================= */

renderCategories();
renderMenus();
renderCart();
