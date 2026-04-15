#!/usr/bin/env bash
set -euo pipefail

echo "== Render Auto-Deploy Diagnostics =="

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Not inside a Git repository."
  exit 1
fi

branch=$(git rev-parse --abbrev-ref HEAD)
echo "Current branch: ${branch}"

if git rev-parse --abbrev-ref --symbolic-full-name "@{u}" >/dev/null 2>&1; then
  upstream=$(git rev-parse --abbrev-ref --symbolic-full-name "@{u}")
  ahead_behind=$(git rev-list --left-right --count "${upstream}...HEAD")
  behind=$(echo "$ahead_behind" | awk '{print $1}')
  ahead=$(echo "$ahead_behind" | awk '{print $2}')
  echo "Upstream tracking branch: ${upstream}"
  echo "Ahead by ${ahead}, behind by ${behind} commit(s)."
else
  echo "No upstream tracking branch is configured for ${branch}."
fi

if [ -z "$(git remote)" ]; then
  echo "No git remotes are configured. Render cannot detect local-only commits."
else
  echo "Configured remotes:"
  git remote -v
fi

echo
cat <<'TIP'
Next checks in Render dashboard:
1) Confirm the service is connected to the same Git provider/repository.
2) Confirm the production branch in Render matches your push target.
3) Confirm Auto-Deploy is enabled for that service.
4) Verify the latest pushed commit SHA appears in the Render deploy logs.
TIP
