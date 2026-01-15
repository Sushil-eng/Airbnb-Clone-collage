  
  // Create map and set view (latitude, longitude, zoom)
  var map = L.map('map').setView([19.0760, 72.8777], 13);

  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // Add marker
  L.marker([18.9582, 72.8321])
        .addTo(map)
        .bindPopup("Hello Mumbai")
        .openPopup();


