const messages = {
  home: "أنت الآن في الصفحة الرئيسية",
  medicines: "قسم الأدوية — سيتم ربط قاعدة بيانات الأدوية هنا",
  cases: "قسم الكيسات — ستُضاف الحالات التدريبية هنا",
  progress: "قسم التقدم — ستظهر إحصائيات إنجازك هنا",
  developers: "قسم المبرمجين — أضف أسماء فريق التطوير هنا"
};
const toast = document.getElementById("toast");
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}
document.querySelectorAll("[data-page]").forEach(button => {
  button.addEventListener("click", () => {
    const page = button.dataset.page;
    document.querySelectorAll(".nav-item").forEach(item => {
      item.classList.toggle("active", item.dataset.page === page);
    });
    if (page === "home") {
      window.scrollTo({top: 0, behavior: "smooth"});
    }
    showToast(messages[page] || "قريباً");
  });
});
document.querySelector(".profile-button").addEventListener("click", () => {
  showToast("الملف الشخصي — قريباً");
});
