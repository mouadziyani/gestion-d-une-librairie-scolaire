const BLOCKED_PASSWORD_WORDS = [
  "password",
  "passw0rd",
  "admin",
  "administrator",
  "qwerty",
  "azerty",
  "123456",
  "123456789",
  "111111",
  "000000",
  "bougdim",
  "librairie",
  "library",
  "welcome",
  "letmein",
  "iloveyou",
  "secret",
  "user",
  "client",
  "moderator",
  "maroc",
  "morocco",
];

export const PASSWORD_POLICY_TEXT =
  "Use at least 10 characters with uppercase, lowercase, a number, and a symbol. Avoid password, admin, qwerty, the site name, or your name/email.";

function compact(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function personalTerms(context = {}) {
  return [context.name, context.email]
    .flatMap((value) => String(value || "").toLowerCase().replace("@", " ").split(/[^a-z0-9]+/g))
    .filter((term) => term.length >= 4);
}

export function validatePasswordPolicy(password, context = {}) {
  const value = String(password || "");
  const normalized = compact(value);

  if (value.length < 10) {
    return "Password must be at least 10 characters.";
  }

  if (!/[a-z]/.test(value) || !/[A-Z]/.test(value)) {
    return "Password must include uppercase and lowercase letters.";
  }

  if (!/\d/.test(value)) {
    return "Password must include at least one number.";
  }

  if (!/[^A-Za-z0-9]/.test(value)) {
    return "Password must include at least one symbol.";
  }

  if (BLOCKED_PASSWORD_WORDS.some((word) => normalized === word || normalized.includes(word))) {
    return "Do not use common words like password, admin, qwerty, or the site name.";
  }

  if (personalTerms(context).some((term) => normalized.includes(term))) {
    return "Password must not contain your name or email.";
  }

  return "";
}
