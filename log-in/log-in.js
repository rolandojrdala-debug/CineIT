// CineIT authentication using Supabase Auth.
const supabaseClient = window.cineitSupabase;
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

const tabBtns = document.querySelectorAll(".tab-btn");
const authForms = document.querySelectorAll(".auth-form");
const authMessage = document.getElementById("auth-message");
function showAuthMessage(message, type = "error") {
  authMessage.textContent = message;
  authMessage.className = `auth-message ${type}`;
}
function hideAuthMessage() {
  authMessage.textContent = "";
  authMessage.className = "auth-message";
}
tabBtns.forEach(button => button.addEventListener("click", () => {
  tabBtns.forEach(btn => btn.classList.toggle("active", btn === button));
  authForms.forEach(form => form.classList.toggle("active", form.id === button.dataset.target));
  hideAuthMessage();
}));
function setBusy(button, busy, label) {
  button.disabled = busy;
  if (busy) button.dataset.originalText = button.textContent;
  button.textContent = busy ? label : (button.dataset.originalText || label);
}
function homeUrl() { return new URL("../index.html", window.location.href).href; }

// If an existing session is present, send the user back to the homepage.
if (supabaseClient) {
  supabaseClient.auth.getSession().then(({ data }) => {
    if (data?.session) window.location.replace(homeUrl());
  });
} else {
  showAuthMessage("Supabase could not be initialized. Check the configuration script.");
}

document.getElementById("signin").addEventListener("submit", async event => {
  event.preventDefault();
  hideAuthMessage();
  const button = event.currentTarget.querySelector('button[type="submit"]');
  const email = document.getElementById("signin-email").value.trim();
  const password = document.getElementById("signin-password").value;
  setBusy(button, true, "Signing in...");
  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) throw error;
    showAuthMessage("Welcome back to CineIT! Redirecting...", "success");
    window.location.assign(homeUrl());
  } catch (error) {
    showAuthMessage(error.message || "Unable to sign in. Please try again.");
  } finally {
    setBusy(button, false, "Sign In →");
  }
});

document.getElementById("register").addEventListener("submit", async event => {
  event.preventDefault();
  hideAuthMessage();
  const button = event.currentTarget.querySelector('button[type="submit"]');
  const name = document.getElementById("reg-name").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const password = document.getElementById("reg-password").value;
  const termsAccepted = document.getElementById("terms").checked;
  if (name.length < 2 || name.length > 100) return showAuthMessage("Name must be between 2 and 100 characters.");
  if (password.length < 12 || password.length > 128) return showAuthMessage("Password must contain between 12 and 128 characters.");
  if (!termsAccepted) return showAuthMessage("Please accept the Terms and Privacy Policy.");
  setBusy(button, true, "Creating account...");
  try {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: homeUrl()
      }
    });
    if (error) throw error;
    if (data.session) {
      showAuthMessage("Your CineIT account has been created! Redirecting...", "success");
      window.location.assign(homeUrl());
    } else {
      showAuthMessage("Account created! Check your email to confirm your address before signing in.", "success");
      document.getElementById("register").reset();
    }
  } catch (error) {
    showAuthMessage(error.message || "Unable to create your account. Please try again.");
  } finally {
    setBusy(button, false, "Create Account →");
  }
});
