#!/usr/bin/env bash
# deploy.sh — Build, commit, pin CDN URLs to exact commit sha, push, purge cache.
#
# Usage:
#   ./scripts/deploy.sh
#   ./scripts/deploy.sh "optional commit message"
#
# How it works:
#   1. npm run build
#   2. Commit all staged+unstaged changes (including dist/)
#   3. Read the new commit sha
#   4. Update the two Konimbo HTML files to use @{sha} instead of @master
#   5. Commit the updated HTML files
#   6. git push
#   7. Purge jsDelivr cache for both assets
#
# Result: every deploy gets a unique, uncacheable CDN URL.
set -euo pipefail

REPO="Yuki-az-23/aluf-frontend"
HEAD_HTML="konimbo/aluf-ui-shell.head.html"
FOOT_HTML="konimbo/aluf-ui-shell.foot.html"
MSG="${1:-deploy: $(date '+%Y-%m-%d %H:%M')}"

echo "🔨  Building..."
npm run build

echo "📦  Staging all changes..."
git add -A

if git diff --cached --quiet; then
  echo "⚠️   Nothing new to commit — re-using current HEAD sha"
  HASH=$(git rev-parse HEAD)
else
  git commit -m "$MSG"
  HASH=$(git rev-parse HEAD)
  echo "✅  Committed: ${HASH:0:7}"
fi

echo "🔗  Pinning CDN references to @${HASH:0:7}..."
# Replace whatever ref is currently in the URLs with the new full sha
if [[ "$OSTYPE" == "darwin"* ]]; then
  sed -i '' "s|aluf-frontend@[^/]*/dist/|aluf-frontend@${HASH}/dist/|g" "$HEAD_HTML" "$FOOT_HTML"
else
  sed -i "s|aluf-frontend@[^/]*/dist/|aluf-frontend@${HASH}/dist/|g" "$HEAD_HTML" "$FOOT_HTML"
fi

echo "📝  Committing CDN pin..."
git add "$HEAD_HTML" "$FOOT_HTML"
if ! git diff --cached --quiet; then
  git commit -m "deploy: pin CDN to ${HASH:0:7}"
fi

echo "🚀  Pushing..."
git push

echo "🧹  Purging jsDelivr cache..."
curl -sf "https://purge.jsdelivr.net/gh/${REPO}@${HASH}/dist/aluf-app.css" -o /dev/null && echo "   purged: aluf-app.css"
curl -sf "https://purge.jsdelivr.net/gh/${REPO}@${HASH}/dist/aluf-app.js"  -o /dev/null && echo "   purged: aluf-app.js"

echo ""
echo "✅  Deploy complete!"
echo "   CSS: https://cdn.jsdelivr.net/gh/${REPO}@${HASH}/dist/aluf-app.css"
echo "   JS:  https://cdn.jsdelivr.net/gh/${REPO}@${HASH}/dist/aluf-app.js"
