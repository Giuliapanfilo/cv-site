fetch('https://countapi.mileshilliard.com/api/v1/hit/giuliapanfilo-cv-site')
  .then(res => res.json())
  .then(data => {
    document.getElementById('visit-count').textContent = data.value;
  })
  .catch(() => {
    document.getElementById('visit-count').textContent = '—';
  });
