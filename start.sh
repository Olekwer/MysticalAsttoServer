#!/bin/bash

echo "🚀 Starting application..."

# Run migrations first
echo "📊 Running database migrations..."
npx prisma migrate deploy

# Check if migrations succeeded
if [ $? -eq 0 ]; then
    echo "✅ Migrations completed successfully"
else
    echo "❌ Migration failed"
    exit 1
fi

# Start the application
echo "🌟 Starting NestJS application..."
npm run start:prod
