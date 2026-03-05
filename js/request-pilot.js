document.getElementById('pilotForm').addEventListener('submit', function(e) {

  // Validate at least one checkbox is selected
  const checkboxes = document.querySelectorAll('input[name="help"]:checked');
  if (checkboxes.length === 0) {
    e.preventDefault();
    alert('Please select at least one option for "What Can We Help With?"');
    return;
  }

  // Let Netlify handle the submission and redirect to thank-you.html
});
