#!/bin/bash

set -a
source /etc/profile.d/go_path.sh

ipfs init
ipfs config Addresses.Gateway /ip4/0.0.0.0/tcp/8080
# SECURITY FIX (2026-06-29 audit): API was previously bound to 0.0.0.0 with
# Access-Control-Allow-Origin "*" + Allow-Credentials "true" — the original
# "TODO: Fix this / SECURITY BREACH" comment below was never acted on. The
# IPFS API is the full read/write/admin interface (pin, add, config, shutdown,
# swarm, etc.) with no authentication of its own. Binding it to 0.0.0.0 plus a
# wildcard+credentials CORS policy meant any website in any visitor's browser,
# or anyone who could reach the host on the network, had unauthenticated full
# control of the node. Fixed by binding to loopback only; if a host process or
# reverse proxy needs to reach this from outside the container, do it via an
# authenticated, narrowly-scoped proxy — do not restore 0.0.0.0 or wildcard CORS.
ipfs config Addresses.API /ip4/127.0.0.1/tcp/5001
# No CORS headers are set: the API is loopback-only now. If a specific trusted
# origin genuinely needs cross-origin access, set Access-Control-Allow-Origin
# to that exact origin (never "*") and only pair it with Allow-Credentials if
# that origin is fully trusted — do not reinstate the wildcard.
ipfs daemon &

set +a

cd $HOME
npm start
