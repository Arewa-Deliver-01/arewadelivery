/* assets/js/auth.js
   Simple client-side authentication mock for demo/testing.
   - Stores users in localStorage under key: "arewadeliver_users"
   - Stores reset tokens in localStorage under key: "arewadeliver_reset_tokens"
   - Passwords are base64-encoded for demo only (NOT secure). Replace with real hashing on server.
*/

/* Utilities */
const AV_USERS_KEY = "arewadeliver_users";
const AV_RESET_KEY = "arewadeliver_reset_tokens";

function loadUsers() {
  return JSON.parse(localStorage.getItem(AV_USERS_KEY) || "[]");
}
function saveUsers(users) {
  localStorage.setItem(AV_USERS_KEY, JSON.stringify(users));
}

function loadTokens() {
  return JSON.parse(localStorage.getItem(AV_RESET_KEY) || "{}");
}
function saveTokens(tokens) {
  localStorage.setItem(AV_RESET_KEY, JSON.stringify(tokens));
}

function encodePwd(pwd) {
  return btoa(pwd); // demo only — replace with secure hashing on server
}

/* Registration */
function registerUser(data) {
  const users = loadUsers();
  if (users.find(u => u.email.toLowerCase() === data.email.toLowerCase())) {
    return { ok: false, message: "Email already registered." };
  }
  const id = 'u_' + Date.now();
  const user = {
    id,
    name: data.name || "",
    email: data.email,
    phone: data.phone || "",
    role: data.role || "customer",
    password: encodePwd(data.password),
    createdAt: new Date().toISOString()
  };
  users.push(user);
  saveUsers(users);
  return { ok: true, user };
}

/* Login */
function loginUser(email, password) {
  const users = loadUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return { ok: false, message: "No account found with that email." };
  if (user.password !== encodePwd(password)) return { ok: false, message: "Invalid password." };
  // Save session (demo)
  sessionStorage.setItem("arewa_session", JSON.stringify({ id: user.id, role: user.role, email: user.email }));
  return { ok: true, user };
}

/* Logout */
function logout() {
  sessionStorage.removeItem("arewa_session");
  // optionally redirect to index
  window.location = "/index.html";
}

/* Password reset - create token and "send email" */
function createResetToken(email) {
  const users = loadUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return { ok: false, message: "No account found with that email." };
  const tokens = loadTokens();
  const token = Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
  // store token -> email mapping and expiry (1 hour)
  tokens[token] = { email: user.email, expires: Date.now() + 1000 * 60 * 60 };
  saveTokens(tokens);
  // For demo: return token (so you can display it or include in URL). In real app you'd email it.
  const resetUrl = `${location.origin}${location.pathname.replace(/[^\/]*$/, "")}reset_password.html?token=${token}`;
  return { ok: true, token, resetUrl };
}

/* Validate token */
function validateResetToken(token) {
  const tokens = loadTokens();
  const entry = tokens[token];
  if (!entry) return { ok: false, message: "Invalid token." };
  if (Date.now() > entry.expires) {
    delete tokens[token];
    saveTokens(tokens);
    return { ok: false, message: "Token expired." };
  }
  return { ok: true, email: entry.email };
}

/* Consume token and change password */
function resetPassword(token, newPassword) {
  const validation = validateResetToken(token);
  if (!validation.ok) return validation;
  const email = validation.email;
  const users = loadUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return { ok: false, message: "No user for token." };
  user.password = encodePwd(newPassword);
  saveUsers(users);
  // remove token
  const tokens = loadTokens();
  delete tokens[token];
  saveTokens(tokens);
  return { ok: true, message: "Password reset successful." };
}

/* Helper: route by role after login */
function redirectAfterLogin(user) {
  const r = (user && user.role) || (JSON.parse(sessionStorage.getItem("arewa_session") || "{}").role);
  switch (r) {
    case "admin": window.location = "/admin/admin_dashboard.html"; break;
    case "vendor": window.location = "/vendor/vendor_dashboard.html"; break;
    case "rider": window.location = "/rider/rider_dashboard.html"; break;
    default: window.location = "/customer/customer_dashboard.html";
  }
}

/* Expose for pages */
window.AV = {
  registerUser,
  loginUser,
  logout,
  createResetToken,
  validateResetToken,
  resetPassword,
  loadUsers,
  redirectAfterLogin
};
