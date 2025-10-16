docker run --rm -it \
  -p 8080:80 \
  -v "$PWD:/srv:ro" \
  caddy:alpine \
  caddy file-server --root /srv --listen :80

