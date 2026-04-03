import http from 'http';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3001;
const TRANSACTIONS_FILE = path.resolve(__dirname, '../mock-api/transactions/transactions.json');

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

const server = http.createServer(async (req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, headers);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  try {
    // GET /api/transactions
    if (pathname === '/api/transactions' && req.method === 'GET') {
      const data = await fs.readFile(TRANSACTIONS_FILE, 'utf-8');
      res.writeHead(200, headers);
      res.end(data);
      return;
    }

    // POST /api/transactions
    if (pathname === '/api/transactions' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const newTxn = JSON.parse(body);
          const data = await fs.readFile(TRANSACTIONS_FILE, 'utf-8');
          const transactions = JSON.parse(data);
          
          // Add ID and date if missing
          if (!newTxn.id) newTxn.id = `txn_${Date.now()}`;
          if (!newTxn.date) newTxn.date = new Date().toISOString().slice(0, 10);
          
          transactions.unshift(newTxn);
          await fs.writeFile(TRANSACTIONS_FILE, JSON.stringify(transactions, null, 2));
          
          res.writeHead(201, headers);
          res.end(JSON.stringify(newTxn));
        } catch (err) {
          res.writeHead(400, headers);
          res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });
      return;
    }

    // PUT /api/transactions/:id
    if (pathname.startsWith('/api/transactions/') && req.method === 'PUT') {
      const id = pathname.split('/').pop();
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const updates = JSON.parse(body);
          const data = await fs.readFile(TRANSACTIONS_FILE, 'utf-8');
          let transactions = JSON.parse(data);
          
          let updatedTxn = null;
          transactions = transactions.map(t => {
            if (t.id === id) {
              updatedTxn = { ...t, ...updates };
              return updatedTxn;
            }
            return t;
          });

          if (!updatedTxn) {
            res.writeHead(404, headers);
            res.end(JSON.stringify({ error: 'Not Found' }));
            return;
          }

          await fs.writeFile(TRANSACTIONS_FILE, JSON.stringify(transactions, null, 2));
          res.writeHead(200, headers);
          res.end(JSON.stringify(updatedTxn));
        } catch (err) {
          res.writeHead(400, headers);
          res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });
      return;
    }

    // DELETE /api/transactions/:id
    if (pathname.startsWith('/api/transactions/') && req.method === 'DELETE') {
      const id = pathname.split('/').pop();
      const data = await fs.readFile(TRANSACTIONS_FILE, 'utf-8');
      let transactions = JSON.parse(data);
      
      const filtered = transactions.filter(t => t.id !== id);
      if (filtered.length === transactions.length) {
        res.writeHead(404, headers);
        res.end(JSON.stringify({ error: 'Not Found' }));
        return;
      }

      await fs.writeFile(TRANSACTIONS_FILE, JSON.stringify(filtered, null, 2));
      res.writeHead(200, headers);
      res.end(JSON.stringify({ success: true }));
      return;
    }

    // Default 404
    res.writeHead(404, headers);
    res.end(JSON.stringify({ error: 'Route not found' }));

  } catch (error) {
    console.error('Server Error:', error);
    res.writeHead(500, headers);
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
});

server.listen(PORT, () => {
  console.log(`Mock API Server running at http://localhost:${PORT}`);
  console.log(`Persisting to: ${TRANSACTIONS_FILE}`);
});
