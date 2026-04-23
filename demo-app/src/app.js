'use strict';

const express = require('express');
const axios = require('axios');
const _ = require('lodash');
const minimist = require('minimist');
const fetch = require('node-fetch');

const app = express();

app.use(express.json());

// Demo route: greet with lodash template
app.get('/', (req, res) => {
  const name = _.escape(req.query.name || 'World');
  res.send(`Hello, ${name}!`);
});

// Demo route: fetch remote data via axios
// NOTE: The arbitrary URL parameter is intentional — it demonstrates the kind of
// SSRF surface that vulnerability scanners (grype, trivy) and SAST tools detect.
// Do NOT use this pattern in production code.
app.get('/fetch', async (req, res) => {
  try {
    const url = req.query.url || 'https://httpbin.org/get';
    const response = await axios.get(url); // lgtm[js/request-forgery] — intentional SSRF demo
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Demo route: parse CLI-style args with minimist
// NOTE: minimist@1.2.5 has a known prototype pollution vulnerability
// (GHSA-xvch-5gv4-984h). This is intentional to exercise scanner detection.
app.get('/args', (req, res) => {
  const args = minimist(req.query.args ? req.query.args.split(' ') : []);
  res.json(args);
});

module.exports = app;
