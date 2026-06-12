const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".section");
const tagRows = document.querySelectorAll(".tag-row");
const copyEmailButton = document.querySelector(".copy-email-button");
const copyFeedback = document.querySelector(".copy-feedback");
let copyFeedbackTimer;

function getHeaderHeight() {
  return header ? header.offsetHeight : 0;
}

function closeMobileMenu() {
  menuToggle.classList.remove("open");
  navMenu.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "메뉴 열기");
}

function openMobileMenu() {
  menuToggle.classList.add("open");
  navMenu.classList.add("open");
  menuToggle.setAttribute("aria-expanded", "true");
  menuToggle.setAttribute("aria-label", "메뉴 닫기");
}

function setActiveNavLink() {
  const scrollPosition = window.scrollY + getHeaderHeight() + 120;
  let currentSectionId = sections[0].id;

  sections.forEach((section) => {
    if (scrollPosition >= section.offsetTop) {
      currentSectionId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const linkTarget = link.getAttribute("href").replace("#", "");
    link.classList.toggle("active", linkTarget === currentSectionId);
  });
}

function updateTagRowLineState() {
  tagRows.forEach((tagRow) => {
    const tagLinePositions = new Set(
      Array.from(tagRow.children).map((tag) => tag.offsetTop)
    );

    tagRow.classList.toggle("single-line", tagLinePositions.size <= 1);
  });
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

function showCopyFeedback(message) {
  copyFeedback.textContent = message;
  copyFeedback.classList.add("show");
  clearTimeout(copyFeedbackTimer);

  copyFeedbackTimer = window.setTimeout(() => {
    copyFeedback.classList.remove("show");
  }, 1600);
}

menuToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.contains("open");

  if (isOpen) {
    closeMobileMenu();
    return;
  }

  openMobileMenu();
});

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    const targetId = link.getAttribute("href");
    const targetSection = document.querySelector(targetId);

    if (!targetSection) {
      return;
    }

    const targetPosition = targetSection.offsetTop - getHeaderHeight() + 1;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth"
    });

    closeMobileMenu();
  });
});

document.addEventListener("click", (event) => {
  const clickedInsideMenu = navMenu.contains(event.target);
  const clickedToggle = menuToggle.contains(event.target);

  if (!clickedInsideMenu && !clickedToggle && navMenu.classList.contains("open")) {
    closeMobileMenu();
  }
});

copyEmailButton.addEventListener("click", async () => {
  const targetId = copyEmailButton.dataset.copyTarget;
  const target = document.getElementById(targetId);

  if (!target) {
    return;
  }

  try {
    await copyTextToClipboard(target.textContent.trim());
    showCopyFeedback("복사 완료");
  } catch (error) {
    showCopyFeedback("복사 실패");
  }
});

window.addEventListener("scroll", setActiveNavLink);
window.addEventListener("resize", () => {
  setActiveNavLink();
  updateTagRowLineState();

  if (window.innerWidth > 720 && navMenu.classList.contains("open")) {
    closeMobileMenu();
  }
});

setActiveNavLink();
updateTagRowLineState();
