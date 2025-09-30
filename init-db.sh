#!/bin/bash

echo "🚀 Initializing database..."

# Run migrations
echo "📊 Running Prisma migrations..."
npx prisma migrate deploy

# Seed database
echo "🌱 Seeding database..."
npx prisma db seed

echo "✅ Database initialization complete!"
