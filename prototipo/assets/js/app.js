document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("#login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!loginForm.checkValidity()) {
        loginForm.classList.add("was-validated");
        return;
      }
      const role = new FormData(loginForm).get("perfil");
      window.location.href = role === "coordenador"
        ? "tela3_painel.html"
        : "tela2_frequencia.html";
    });
  }

  const showToast = (message) => {
    const region = document.querySelector("#toast-region");
    if (!region) return;
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    region.append(toast);
    window.setTimeout(() => toast.remove(), 3200);
  };

  document.querySelectorAll(".student-card").forEach((card) => {
    const inputs = card.querySelectorAll("input");
    const theoretical = card.querySelector(".horas-teoricas");
    const practical = card.querySelector(".horas-praticas");
    const absences = card.querySelector(".faltas");
    const result = card.querySelector(".hours-result strong");

    const updateResult = () => {
      const values = [theoretical, practical, absences].map((input) => Number(input.value));
      if (!theoretical.value || !practical.value) {
        result.textContent = "—";
        return;
      }
      const [hoursTheoretical, hoursPractical, justifiedAbsences] = values;
      const valid = [hoursTheoretical, hoursPractical, justifiedAbsences].every((value) => value >= 0);
      if (!valid) {
        result.textContent = "Inválido";
        return;
      }
      const liquidHours = hoursTheoretical + hoursPractical - justifiedAbsences;
      result.textContent = `${liquidHours}h`;
    };

    inputs.forEach((input) => input.addEventListener("input", updateResult));
  });

  const updateSummary = () => {
    const cards = [...document.querySelectorAll(".student-card")];
    const completed = cards.filter((card) => card.dataset.status === "concluido").length;
    const completedNow = cards.filter((card) => {
      const t = card.querySelector(".horas-teoricas");
      const p = card.querySelector(".horas-praticas");
      return t?.value && p?.value;
    }).length;
    const totalCompleted = completedNow || completed;
    const pending = cards.length - totalCompleted;
    const concluded = document.querySelector("#total-concluidos");
    const pendingElement = document.querySelector("#total-pendentes");
    if (concluded) concluded.textContent = String(totalCompleted);
    if (pendingElement) pendingElement.textContent = String(pending);
  };

  document.querySelectorAll(".horas-teoricas, .horas-praticas").forEach((input) => {
    input.addEventListener("input", updateSummary);
  });

  document.querySelector("#save-draft")?.addEventListener("click", () => {
    showToast("Rascunho salvo com sucesso.");
  });

  document.querySelector("#submit-frequency")?.addEventListener("click", () => {
    const cards = [...document.querySelectorAll(".student-card")];
    const incomplete = cards.filter((card) => {
      const theoretical = card.querySelector(".horas-teoricas");
      const practical = card.querySelector(".horas-praticas");
      return !theoretical.value || !practical.value;
    });
    if (incomplete.length) {
      showToast(`Preencha ${incomplete.length} lançamento(s) pendente(s).`);
      incomplete[0].scrollIntoView({ behavior: "smooth", block: "center" });
      incomplete[0].querySelector(".horas-teoricas").focus();
      return;
    }
    showToast("Frequência enviada para a coordenação.");
  });

  const statusFilter = document.querySelector("#filter-status");
  const unitFilter = document.querySelector("#filter-unit");
  const rows = [...document.querySelectorAll("#unit-table tr")];

  const filterTable = () => {
    const status = statusFilter?.value || "";
    const unit = unitFilter?.value || "";
    let visible = 0;
    rows.forEach((row) => {
      const matchesStatus = !status || row.dataset.status === status;
      const matchesUnit = !unit || row.dataset.unit.includes(unit.split(" ")[0]);
      const show = matchesStatus && matchesUnit;
      row.hidden = !show;
      if (show) visible += 1;
    });
    const count = document.querySelector("#unit-count");
    if (count) count.textContent = `${visible} unidade${visible === 1 ? "" : "s"}`;
  };

  statusFilter?.addEventListener("change", filterTable);
  unitFilter?.addEventListener("change", filterTable);

  document.querySelector("#select-all")?.addEventListener("change", (event) => {
    document.querySelectorAll(".unit-check").forEach((checkbox) => {
      if (!checkbox.closest("tr").hidden) checkbox.checked = event.target.checked;
    });
  });

  document.querySelector("#approve-all")?.addEventListener("click", () => {
    const checked = [...document.querySelectorAll(".unit-check:checked")];
    if (!checked.length) {
      showToast("Selecione ao menos uma unidade.");
      return;
    }
    checked.forEach((checkbox) => {
      const row = checkbox.closest("tr");
      row.dataset.status = "Aprovada";
      const badge = row.querySelector(".status-badge");
      badge.className = "status-badge status-success";
      badge.textContent = "Aprovada";
    });
    showToast(`${checked.length} unidade(s) aprovada(s).`);
  });

  document.querySelectorAll(".review-btn").forEach((button) => {
    button.addEventListener("click", () => showToast("Detalhes da unidade disponíveis para revisão."));
  });
});
