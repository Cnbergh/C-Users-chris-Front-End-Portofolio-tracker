const form = document.getElementById("contact-form");
const validationErrors = document.getElementById("validation-errors");
const validationSuccess = document.getElementById("validation-success");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const nameInput = document.getElementById("name");
  const subjectInput = document.getElementById("subject");
  const emailInput = document.getElementById("email");
  const addressInput = document.getElementById("address");

  let errors = [];

  if (!nameInput.value) {
    errors.push("Name is required");
    alert("Name is required");
  }
  if (subjectInput.value.length < 10) {
    errors.push("Subject must have a value with a minimum length of 10");
    alert("Subject must have a value with a minimum length of 10");
  }
  if (!emailInput.value || !/\S+@\S+\.\S+/.test(emailInput.value)) {
    errors.push(
      "Email must have a value and be formatted like an email address"
    );
    
  }
  if (addressInput.value.length < 25) {
    errors.push("Address must have a value with a minimum length of 25");
    alert("Address must have a value with a minimum length of 25");
  }

  if (errors.length > 0) {
    validationErrors.innerHTML =
      "<ul><li>" + errors.join("</li><li>") + "</li></ul>";
    validationSuccess.innerHTML = "";
  } else {
    validationErrors.innerHTML = "";
    validationSuccess.innerHTML = "<p>Form passed validation</p>";
    form.reset();
  }
});
