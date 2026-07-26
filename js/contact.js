const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const status = document.getElementById('form-status');
    status.textContent = 'Invio in corso...';

    const formData = new FormData(contactForm);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: json
      });
      const result = await response.json();
      if (result.success) {
        status.textContent = 'Messaggio inviato, grazie!';
        contactForm.reset();
      } else {
        status.textContent = 'Qualcosa è andato storto, riprova.';
      }
    } catch (error) {
      status.textContent = 'Errore di connessione, riprova più tardi.';
    }
  });
}
