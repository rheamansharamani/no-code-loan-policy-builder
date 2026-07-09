const authStorageKey = "ruleEngineAuth";

const mockUsers = [
  { email: "admin@example.com", password: "admin123", role: "admin" },
  { email: "user@example.com", password: "user123", role: "user" },
];

export function authenticateUser(email, password, selectedRole) {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPassword = password.trim();

  const matchedUser = mockUsers.find(
    (user) =>
      user.email === normalizedEmail && user.password === normalizedPassword
  );

  if (!matchedUser) {
    return null;
  }

  if (selectedRole && matchedUser.role !== selectedRole) {
    return null;
  }

  return {
    email: matchedUser.email,
    role: matchedUser.role,
    name: matchedUser.role === "admin" ? "Admin User" : "Loan Applicant",
  };
}

export function saveAuthSession(user) {
  localStorage.setItem(authStorageKey, JSON.stringify(user));
  return user;
}

export function getStoredAuthSession() {
  if (typeof window === "undefined") {
    return null;
  }

  const storedUser = localStorage.getItem(authStorageKey);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch (error) {
    return null;
  }
}

export function clearAuthSession() {
  localStorage.removeItem(authStorageKey);
}

export function clearStoredAuthSession() {
  localStorage.removeItem(authStorageKey);
}
