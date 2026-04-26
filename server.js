const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const API_KEY = process.env.API_KEY;
const ENDPOINT = 'https://api.smartpaypesa.com/v1/initiatestk';

app.post('/stkpush', async (req, res) => {
  try {
    const { numbers, amount, reference } = req.body;

    if (!numbers || !amount) {
      return res.status(400).json({ error: 'Numbers and amount required' });
    }

    const results = [];

    for (let phone of numbers) {
      try {
        const response = await axios.post(ENDPOINT, {
          phone: phone,
          amount: amount,
          reference: reference
        }, {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
          }
        });

        results.push({ phone, success: true, data: response.data });
      } catch (err) {
        results.push({ phone, success: false, error: err.message });
      }
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
