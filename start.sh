#!/bin/bash

echo "🚀 Starting application..."

# Push database schema first
echo "📊 Pushing database schema..."
npx prisma db push --accept-data-loss

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
