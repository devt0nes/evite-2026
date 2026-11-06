const allowedNames = new Set([
  "v1",
  "jujhar",
  "jesika",
  "vanshika",
  "ankila",
  "aditi",
  "pragati",
  "devansh",
  "virat",
  "aditya",
  "jujhar singh",
  "jesika poonia",
  "vanshika agarwal",
  "ankila bajaj",
  "aditi srivastava",
  "pragati jain",
  "devansh tandon",
  "virat sahlot",
  "aditya kalra",
  "jujhi",
  "jesu",
  "vanshi",
  "anki",
  "adeetee",
  "pragga",
  "litchi",
  "veera",
  "kalra",
]);

module.exports = (request, response) => {
  if (request.method !== "POST") {
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  const submittedName = typeof request.body?.name === "string"
    ? request.body.name.trim()
    : "";
  const firstName = submittedName.split(/\s+/)[0] || "";
  const normalizedName = submittedName.toLowerCase();
  const normalizedFirstName = firstName.toLowerCase();
  const allowed = allowedNames.has(normalizedName) || allowedNames.has(normalizedFirstName);

  response.status(200).json({
    allowed,
    ...(allowed
      ? { firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase() }
      : {}),
  });
};
