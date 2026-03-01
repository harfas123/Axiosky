// Form submission handler
document.getElementById('pilotForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Collect form data
    const formData = new FormData(this);
    
    // Validate at least one checkbox is selected
    const checkboxes = document.querySelectorAll('input[name="help"]:checked');
    if (checkboxes.length === 0) {
        alert('Please select at least one option for "What Can We Help With?"');
        return;
    }
    
    // Collect selected help options
    const helpOptions = Array.from(checkboxes).map(cb => cb.value).join(', ');
    
    // Create submission object
    const submission = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        jobTitle: formData.get('jobTitle'),
        workEmail: formData.get('workEmail'),
        company: formData.get('company'),
        country: formData.get('country'),
        sector: formData.get('sector'),
        orgSize: formData.get('orgSize'),
        help: helpOptions,
        challenge: formData.get('challenge'),
        timeline: formData.get('timeline'),
        source: formData.get('source'),
        submittedAt: new Date().toISOString()
    };
    
    // Log submission (in production, send to server)
    console.log('Pilot Request Submitted:', submission);
    
    // Show success message
    alert('Thank you! Your pilot request has been submitted. We will review your application and respond within 5 business days.');
    
    // Reset form
    this.reset();
});
