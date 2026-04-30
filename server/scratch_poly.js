const axios = require('axios');

async function test() {
  try {
    const res = await axios.get('https://gamma-api.polymarket.com/events?active=true&closed=false&limit=5', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    console.log(JSON.stringify(res.data[0], null, 2));
  } catch (err) {
    console.error(err.message);
  }
}

test();
