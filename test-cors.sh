#!/bin/bash

echo "🧪 Testing CORS configuration..."
echo ""

echo "1. Testing preflight request (OPTIONS):"
curl -X OPTIONS \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v http://localhost:3010/auth/login 2>&1 | grep -E "(Access-Control|HTTP)"

echo ""
echo "2. Testing actual request (POST):"
curl -X POST \
  -H "Origin: http://localhost:5173" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test"}' \
  -v http://localhost:3010/auth/login 2>&1 | grep -E "(Access-Control|HTTP)"

echo ""
echo "✅ CORS test completed!"
