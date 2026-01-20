# !/bin/sh

echo "compiling files..."
npm run build

echo "starting the server..."
exec npm run start-dev