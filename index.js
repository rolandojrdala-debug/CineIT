// CineIT homepage: theme, carousel, and Supabase session display.
const themeToggle = document.getElementById("themeToggle");
let currentTheme = localStorage.getItem("cineit-theme") || "dark";
function applyTheme() {
  document.documentElement.setAttribute("data-theme", currentTheme);
  if (themeToggle) themeToggle.textContent = currentTheme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";
}
applyTheme();
themeToggle?.addEventListener("click", () => {
  currentTheme = currentTheme === "dark" ? "light" : "dark";
  localStorage.setItem("cineit-theme", currentTheme);
  applyTheme();
});

// Carousel
const track = document.getElementById("track");
const slides = document.querySelectorAll(".carousel-slide");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const dots = document.querySelectorAll(".dot");
const carousel = document.getElementById("carousel");
let currentIndex = 0;
let autoPlayInterval;
function updateCarousel() {
  if (!track || !slides.length) return;
  track.style.transform = `translateX(-${currentIndex * 100}%)`;
  dots.forEach((dot, index) => dot.classList.toggle("active", index === currentIndex));
}
function nextSlide() { currentIndex = (currentIndex + 1) % slides.length; updateCarousel(); }
function prevSlide() { currentIndex = (currentIndex - 1 + slides.length) % slides.length; updateCarousel(); }
nextBtn?.addEventListener("click", nextSlide);
prevBtn?.addEventListener("click", prevSlide);
dots.forEach(dot => dot.addEventListener("click", () => {
  currentIndex = Number(dot.dataset.index) || 0;
  updateCarousel();
}));
function startAutoPlay() {
  if (autoPlayInterval || slides.length < 2) return;
  autoPlayInterval = setInterval(nextSlide, 4000);
}
function stopAutoPlay() { clearInterval(autoPlayInterval); autoPlayInterval = null; }
carousel?.addEventListener("mouseenter", stopAutoPlay);
carousel?.addEventListener("mouseleave", startAutoPlay);
startAutoPlay();

// Supabase authentication state
const supabaseClient = window.cineitSupabase;
const signedOutPanel = document.getElementById("signed-out-panel");
const signedInPanel = document.getElementById("signed-in-panel");
const welcomeUser = document.getElementById("welcome-user");
const accountTitle = document.getElementById("account-title");
const accountDescription = document.getElementById("account-description");
const homeAuthMessage = document.getElementById("home-auth-message");
async function updateAccountUI(session) {
  if (!signedOutPanel || !signedInPanel) return;
  const user = session?.user;
  signedOutPanel.hidden = Boolean(user);
  signedInPanel.hidden = !user;
  if (user) {
    const name = user.user_metadata?.full_name || user.email || "CineIT member";
    if (welcomeUser) welcomeUser.textContent = `Welcome, ${name}!`;
    if (accountTitle) accountTitle.textContent = "You're signed in";
    if (accountDescription) accountDescription.textContent = "Your CineIT account is ready.";
  } else {
    if (accountTitle) accountTitle.textContent = "Account Access";
    if (accountDescription) accountDescription.textContent = "Sign in or create an account to manage your CineIT experience.";
  }
}
if (supabaseClient) {
  supabaseClient.auth.getSession().then(({ data, error }) => {
    if (error && homeAuthMessage) homeAuthMessage.textContent = error.message;
    updateAccountUI(data?.session);
  });
  supabaseClient.auth.onAuthStateChange((_event, session) => updateAccountUI(session));
  document.getElementById("logoutButton")?.addEventListener("click", async () => {
    if (homeAuthMessage) homeAuthMessage.textContent = "Signing out...";
    const { error } = await supabaseClient.auth.signOut();
    if (homeAuthMessage) homeAuthMessage.textContent = error ? error.message : "You have signed out.";
  });
} else if (homeAuthMessage) {
  homeAuthMessage.textContent = "Authentication configuration could not be loaded.";
}
