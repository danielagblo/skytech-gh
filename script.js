const overlay = document.getElementById("overlay");
let selectedPackage = null;

function openOverlay(title, price) {
  selectedPackage = { title, price };
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeOverlay() {
  overlay.classList.remove("open");
  document.body.style.overflow = "";
}

// Wire every "Click" button to its parent .package's data
document.querySelectorAll(".select-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const pkg = btn.closest(".package");
    openOverlay(pkg.dataset.title, pkg.dataset.price);
  });
});

document.getElementById("closeBtn").addEventListener("click", closeOverlay);
document.getElementById("returnBtn").addEventListener("click", closeOverlay);
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) closeOverlay();
});

// Yes/No behave like radios
document.querySelectorAll(".choice-row").forEach((row) => {
  const boxes = row.querySelectorAll('input[type="checkbox"]');
  boxes.forEach((b) => {
    b.addEventListener("change", () => {
      if (b.checked)
        boxes.forEach((o) => {
          if (o !== b) o.checked = false;
        });
    });
  });
});

// Pills: single-select per group
document.querySelectorAll(".pill-group").forEach((group) => {
  group.querySelectorAll(".pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      group
        .querySelectorAll(".pill")
        .forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
    });
  });
});

// ==========================================================
// THE UPDATED FORM SUBMIT LOGIC
// ==========================================================
document.getElementById("waForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // 1. Gather ALL form variables
  const name = document.querySelector('input[name="name"]').value;
  const phone = document.querySelector('input[name="phone"]').value;
  // const email = document.querySelector('input[name="email"]').value;

  const meeting =
    document.querySelector('input[name="meeting"]:checked')?.value ||
    "Not selected";
  const office =
    document.querySelector('input[name="office"]:checked')?.value ||
    "Not selected";

  // Get the active pill for Timeline
  const activeTimeline = document.querySelector(
    '.pill-group[data-group="timeline"] .pill.active',
  );
  const timeline = activeTimeline
    ? activeTimeline.dataset.value
    : "Not selected";

  // Get the active pill for Industry
  const activeIndustry = document.querySelector(
    '.pill-group[data-group="industry"] .pill.active',
  );
  const industry = activeIndustry
    ? activeIndustry.dataset.value
    : "Not selected";

  // GET THE ACTUAL SELECTED PACKAGE (Fixing your hardcoded issue)
  const pkgTitle = selectedPackage ? selectedPackage.title : "Not specified";
  const pkgPrice = selectedPackage ? selectedPackage.price : "Not specified";

  // 2. OPEN WHATSAPP IMMEDIATELY
  const businessPhone = "233538853087"; // <-- PASTE YOUR NUMBER HERE!

  const waMessage =
    `*Service Request!*\n\n` +
    `- *Package:* ${pkgTitle} (${pkgPrice})\n` +
    `- *Name:* ${name}\n` +
    `- *Phone:* ${phone}\n` +
    // `- *Email:* ${email}\n` +
    `- *Meeting:* ${meeting}\n` +
    `- *Office:* ${office}\n` +
    `- *Timeline:* ${timeline}\n` +
    `- *Industry:* ${industry}`;

  const waUrl = `https://wa.me/${businessPhone}?text=${encodeURIComponent(waMessage)}`;
  window.open(waUrl, "_blank");

  // 3. Send data to Vercel backend IN THE BACKGROUND (For Arkesel SMS)
  fetch("/api/sms", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      phone,
      // email,
      package: pkgTitle,
      meeting,
      office,
      timeline,
      industry,
    }),
  })
    .then((response) => response.json())
    .then((result) => console.log("SMS Triggered:", result))
    .catch((error) => console.error("SMS failed silently:", error));

  // 4. Close the modal
  document.getElementById("overlay").classList.remove("open");

  // (Optional) Reset form
  document.getElementById("waForm").reset();
  document
    .querySelectorAll(".pill.active")
    .forEach((p) => p.classList.remove("active"));
});
