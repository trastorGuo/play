#!/usr/bin/env bash
set -Eeuo pipefail
version="${1:?Usage: release-v2.sh vX.Y.Z}"
[[ "$version" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]] || exit 2
image="yizhuoji-backend:$version"
previous="play-backend-pre-$version-20261020"
envfile=/opt/yizhuoji-v1.0.1/backend.env
test -s "$envfile"
test -s /root/backups/yizhuoji/play-pre-20261020.sql.gz
docker inspect play-backend >/dev/null
if docker inspect "$previous" >/dev/null 2>&1; then echo 'Rollback container already exists; refusing overwrite'; exit 2; fi
docker image inspect "$image" >/dev/null
rollback() {
  echo 'Startup failed; restoring the previous application container (no database restore)'
  docker rm -f play-backend >/dev/null 2>&1 || true
  docker rename "$previous" play-backend
  docker start play-backend >/dev/null
}
docker stop -t 20 play-backend >/dev/null
docker rename play-backend "$previous"
trap rollback ERR
docker run -d --name play-backend --restart unless-stopped \
  --network yizhuoji-internal --env-file "$envfile" \
  -e DB_SYNCHRONIZE_LEGACY=false -e DB_MIGRATIONS_RUN=false \
  -p 6015:6015 \
  -v /opt/yizhuoji-v1.0.1/storage/feedback-images:/app/storage/feedback-images \
  -v /opt/yizhuoji-v1.0.1/storage/profile-avatars:/app/storage/profile-avatars \
  "$image" >/dev/null
ready=false
for attempt in $(seq 1 20); do
  if curl --fail --silent http://127.0.0.1:6015/api/v2/health >/dev/null; then ready=true; break; fi
  sleep 1
done
$ready
docker exec play-backend node dist/v2/verify.mjs
curl --fail --silent https://www.6rem.com/api/v2/health
trap - ERR
echo "Deployed $image; rollback container: $previous"
