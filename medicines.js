
import { medicines } from "./medicines-data.js";

export function renderMedicines(container) {
  if (!container) {
    console.error("Medicines container was not found.");
    return;
  }

  container.innerHTML = `
    <section class="medicines-page" dir="rtl">
      <header class="medicines-header">
        <div>
          <span class="medicines-eyebrow">SAYDALATI</span>
          <h1>الأدوية</h1>
          <p>ابحث عن الدواء وتعرّف على معلوماته الأساسية</p>
        </div>
        <div class="medicines-icon">💊</div>
      </header>

      <div class="medicines-search">
        <span aria-hidden="true">⌕</span>
        <input
          id="medicineSearch"
          type="search"
          placeholder="ابحث بالاسم العلمي أو العربي..."
          aria-label="البحث عن دواء"
        />
      </div>

      <div class="medicines-filter">
        <label for="medicineCategory">التصنيف</label>
        <select id="medicineCategory">
          <option value="all">جميع التصنيفات</option>
        </select>
      </div>

      <div class="medicines-count" id="medicineCount"></div>
      <div class="medicines-list" id="medicineList"></div>

      <div class="medicine-details" id="medicineDetails" hidden>
        <button class="medicine-close" id="medicineClose">
          إغلاق ✕
        </button>
        <div id="medicineDetailsContent"></div>
      </div>

      <p class="medicines-disclaimer">
        المعلومات تعليمية أولية ولا تغني عن النشرة الدوائية
        أو تقييم الطبيب والصيدلي.
      </p>
    </section>
  `;

  const searchInput = container.querySelector("#medicineSearch");
  const categorySelect = container.querySelector("#medicineCategory");
  const list = container.querySelector("#medicineList");
  const count = container.querySelector("#medicineCount");
  const details = container.querySelector("#medicineDetails");
  const detailsContent = container.querySelector("#medicineDetailsContent");
  const closeButton = container.querySelector("#medicineClose");

  const escapeHTML = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);

  const categories = [
    ...new Map(
      medicines.map((medicine) => [
        medicine.category,
        medicine.categoryAr
      ])
    )
  ];

  categories.forEach(([category, categoryAr]) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = categoryAr;
    categorySelect.appendChild(option);
  });

  function showDetails(medicine) {
    detailsContent.innerHTML = `
      <span class="medicine-detail-category">
        ${escapeHTML(medicine.categoryAr)}
      </span>
      <h2>${escapeHTML(medicine.nameAr)}</h2>
      <h3>${escapeHTML(medicine.name)}</h3>

      <div class="medicine-info-block">
        <h4>الاستخدامات</h4>
        <p>${escapeHTML(medicine.usesAr)}</p>
        <p class="medicine-english">
          ${escapeHTML(medicine.uses)}
        </p>
      </div>

      <div class="medicine-info-block medicine-warning">
        <h4>تنبيهات مهمة</h4>
        <p>${escapeHTML(medicine.warningsAr)}</p>
        <p class="medicine-english">
          ${escapeHTML(medicine.warnings)}
        </p>
      </div>
    `;

    details.hidden = false;
    details.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function renderList() {
    const query = searchInput.value.trim().toLowerCase();
    const selectedCategory = categorySelect.value;

    const filtered = medicines.filter((medicine) => {
      const matchesSearch = [
        medicine.name,
        medicine.nameAr,
        medicine.category,
        medicine.categoryAr,
        medicine.uses,
        medicine.usesAr
      ].some((value) =>
        String(value ?? "").toLowerCase().includes(query)
      );

      const matchesCategory =
        selectedCategory === "all" ||
        medicine.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    count.textContent = `عدد النتائج: ${filtered.length}`;

    if (filtered.length === 0) {
      list.innerHTML = `
        <div class="medicines-empty">
          <span>🔎</span>
          <h3>ما لقينا دواء مطابق</h3>
          <p>جرّب اسم ثاني أو غيّر التصنيف.</p>
        </div>
      `;
      return;
    }

    list.innerHTML = filtered.map((medicine) => `
      <button
        type="button"
        class="medicine-card"
        data-medicine-id="${escapeHTML(medicine.id)}"
      >
        <span class="medicine-card-icon">💊</span>
        <span class="medicine-card-content">
          <strong>${escapeHTML(medicine.nameAr)}</strong>
          <span class="medicine-scientific">
            ${escapeHTML(medicine.name)}
          </span>
          <span class="medicine-card-category">
            ${escapeHTML(medicine.categoryAr)}
          </span>
        </span>
        <span class="medicine-arrow" aria-hidden="true">←</span>
      </button>
    `).join("");
  }

  searchInput.addEventListener("input", renderList);
  categorySelect.addEventListener("change", renderList);

  list.addEventListener("click", (event) => {
    const card = event.target.closest("[data-medicine-id]");
    if (!card) return;

    const medicine = medicines.find(
      (item) => String(item.id) === card.dataset.medicineId
    );

    if (medicine) showDetails(medicine);
  });

  closeButton.addEventListener("click", () => {
    details.hidden = true;
  });

  renderList();
}
