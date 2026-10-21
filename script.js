
"use strict";

/*
  DATA MENU
  Semua data berada di file ini.
  Tidak membutuhkan database atau internet.
*/

const menus = [
    {
        name: "Nasi Goreng Spesial",
        category: "Makanan Berat",
        price: 18000,
        description: "Nasi goreng dengan telur dan sayuran.",
        icon: "🍛",
        available: true
    },
    {
        name: "Mie Goreng",
        category: "Makanan Berat",
        price: 15000,
        description: "Mie goreng gurih dengan sayuran.",
        icon: "🍜",
        available: true
    },
    {
        name: "Burger Spesial",
        category: "Makanan Berat",
        price: 22000,
        description: "Burger dengan sayuran dan saus spesial.",
        icon: "🍔",
        available: true
    },
    {
        name: "Kentang Goreng",
        category: "Camilan",
        price: 12000,
        description: "Kentang goreng renyah untuk teman santai.",
        icon: "🍟",
        available: false
    },
    {
        name: "Es Kopi Susu",
        category: "Minuman",
        price: 15000,
        description: "Perpaduan kopi, susu, dan es.",
        icon: "🧋",
        available: true
    },
    {
        name: "Matcha Latte",
        category: "Minuman",
        price: 18000,
        description: "Minuman matcha dengan susu yang lembut.",
        icon: "🍵",
        available: true
    }
];

// Mengambil bagian HTML yang akan digunakan
const searchInput = document.getElementById("searchInput");
const categoryButtons = document.getElementById("categoryButtons");
const menuGrid = document.getElementById("menuGrid");
const resultCount = document.getElementById("resultCount");

let activeCategory = "Semua";

// Mengubah angka menjadi format Rupiah
function formatRupiah(price) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(price);
}

// Membuat tombol kategori secara otomatis
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

// Menampilkan menu berdasarkan pencarian dan kategori
function renderMenus() {
    const keyword = searchInput.value.trim().toLowerCase();

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

    if (filteredMenus.length === 0) {
        menuGrid.innerHTML = `
            <div class="empty-message">
                <h3>Menu tidak ditemukan</h3>
                <p>Coba kata kunci lainnya.</p>
            </div>
        `;
    } else {
        menuGrid.innerHTML = filteredMenus.map(menu => `
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
                            menu.available ? "available" : "unavailable"
                        }">
                            ${menu.available ? "Tersedia" : "Habis"}
                        </span>
                    </div>
                </div>
            </article>
        `).join("");
    }

    resultCount.textContent =
        `${filteredMenus.length} menu ditemukan`;
}

// Menangani klik tombol kategori
categoryButtons.addEventListener("click", function(event) {
    const button = event.target.closest("[data-category]");

    if (!button) return;

    activeCategory = button.dataset.category;

    renderCategories();
    renderMenus();
});

// Menangani pencarian saat pengguna mengetik
searchInput.addEventListener("input", renderMenus);

// Menampilkan kategori dan menu saat website dibuka
renderCategories();
renderMenus();

