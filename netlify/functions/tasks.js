const https = require('https');

exports.handler = async (event, context) => {
  const url = 'https://extendsclass.com/api/json-storage/bin/ccfedca';

  // Helper to make HTTPS requests server-side in Node.js
  const makeRequest = (method, body = null) => {
    return new Promise((resolve, reject) => {
      const parsedUrl = new URL(url);
      const options = {
        hostname: parsedUrl.hostname,
        path: parsedUrl.pathname,
        method: method,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
      });

      req.on('error', (e) => reject(e));

      if (body) {
        req.write(body);
      }
      req.end();
    });
  };

  try {
    // Enable CORS for development/local testing
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
      'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers,
        body: ''
      };
    }

    if (event.httpMethod === 'GET') {
      const result = await makeRequest('GET');
      return {
        statusCode: result.statusCode,
        headers,
        body: result.body
      };
    }

    if (event.httpMethod === 'POST' || event.httpMethod === 'PUT') {
      const result = await makeRequest('PUT', event.body);
      return {
        statusCode: result.statusCode,
        headers,
        body: result.body
      };
    }

    return {
      statusCode: 405,
      headers,
      body: 'Method Not Allowed'
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
