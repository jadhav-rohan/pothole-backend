const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.get('/:lat/:lng', async (req, res) => {
  try {
    const { lat, lng } = req.params;
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
    const data = await response.json();
    const state = data.address.state;
    const city = data.address.county;
    const postalCode = data.address.postcode;
    res.json({ state, city ,postalCode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
