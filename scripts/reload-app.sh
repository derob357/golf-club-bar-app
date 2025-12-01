#!/bin/bash

# Kill Metro bundler
echo "Stopping Metro bundler..."
lsof -ti:8081 | xargs kill -9 2>/dev/null || true

# Wait a moment
sleep 2

# Start Metro in background
echo "Starting Metro bundler..."
cd "$(dirname "$0")/.." && npm start &

# Wait for Metro to start
sleep 5

# Restart the app
echo "Restarting app on emulator..."
export PATH="$PATH:$HOME/Library/Android/sdk/platform-tools"
adb shell am force-stop com.intentionai.dhgcbar
sleep 1
adb shell am start -n com.intentionai.dhgcbar/com.intentionai.dhgcbar.MainActivity

echo "Done! App is reloading..."
