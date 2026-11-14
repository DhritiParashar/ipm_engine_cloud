window.switchTab = function (tabId) {
  window.IPM_STATE.activeTab = tabId;
  document.querySelectorAll("[data-tab-btn]").forEach(btn => {
    const active = btn.getAttribute("data-tab-btn") === tabId;
    btn.className = active
      ? "px-3.5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow"
      : "px-3.5 py-2 rounded-xl bg-slate-900 text-slate-300 hover:bg-slate-800 text-xs font-semibold border border-slate-800";
  });
  window.renderActiveTab();
};

window.renderActiveTab = function () {
  const el = document.getElementById("tab-content");
  if (!el) return;
  const tab = window.IPM_STATE.activeTab;
  if (tab === "tab1") window.renderTab1(el);
  else if (tab === "tab2") window.renderTab2(el);
  else if (tab === "tab3") window.renderTab3(el);
  else if (tab === "tab4") window.renderTab4(el);
  else if (tab === "tab5") window.renderTab5(el);
  else if (tab === "tab6") window.renderTab6(el);
  else if (tab === "tab7") window.renderTab7(el);
  else if (tab === "tab8") window.renderTab8(el);
  else if (tab === "tab9") window.renderTab9(el);
};

document.addEventListener("DOMContentLoaded", () => {
  window.renderExamSwitcher();
  window.switchTab("tab1");
});