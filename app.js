import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import https from 'https';
import http from 'http';
import fs from 'fs';
import fetch from 'node-fetch';

const app = express();

const tokenList = JSON.parse(process.env.githubToken);

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Define a route to handle requests
app.get('/', (req, res) => {
  const token = tokenList[Math.floor(Math.random() * tokenList.length)];
  // Search for a specific file on GitHub using the GitHub REST API
  fetch('https://api.github.com/search/code?q=filename:project.properties+in:path&per_page=1', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Accept': 'application/vnd.github+json',
      'User-Agent': 'node-fetch',
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })
    .then(response => response.json())
    .then(data => {
      // Get the contents of the first search result and render it in the index.ejs template
      if (data.items.length > 0) {
        const result = data.items[0];
        const repo = result.repository.full_name;
        const repoUrl = result.repository.html_url;
        const filePath = result.path;
        const filePathUrl = result.html_url;
        const htmlUrl = result.html_url.replace(/github\.com/, 'raw.githubusercontent.com').replace(/\/blob\//, '/');
        fetch(htmlUrl, {
          headers: {
            'User-Agent': 'node-fetch'
          }
        })
          .then(response => response.text())
          .then(text => {
            res.render('index', { content: text, REPO: repo, REPO_URL: repoUrl, filePath: filePath, filePathUrl: filePathUrl });
          })
          .catch(error => {
            console.log("An error occurred", error.message, token);
            res.render('index', { content: '', REPO: '', REPO_URL: '', filePath: '', filePathUrl: '' });
          });
      } else {
        res.render('index', { content: '', REPO: '', REPO_URL: '', filePath: '', filePathUrl: '' });
      }    
    })
    .catch(error => {
      console.error("An error occurred", error.message, token);
      res.render('index', { content: '', REPO: '', REPO_URL: '', filePath: '', filePathUrl: '' });
    });
});

// Read the SSL/TLS certificates
const options = {
  key: fs.readFileSync('private.key'),
  cert: fs.readFileSync('certificate.crt')
};

// Create a secure server
https.createServer(options, app).listen(443, () => {
  console.log('Secure server started on port 443');
});

// Create an HTTP server to redirect to HTTPS
http.createServer((req, res) => {
  res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
  res.end();
}).listen(80, () => {
  console.log('HTTP server started on port 80');
});

