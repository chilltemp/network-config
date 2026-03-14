# Portainer Agent Stack

## Deploy

Deploy this stack from Portainer Stack UI/API using `docker-compose.yml` in this folder.

## Purpose

Runs Portainer Agent on the target host so a central Portainer Server can manage local Docker resources.

## Required Environment Variables

- `PORTAINER_AGENT_SECRET`

## Optional Environment Variables

- `PORTAINER_AGENT_IMAGE` (default: `portainer/agent:2.27.9`)
- `PORTAINER_AGENT_CONTAINER_NAME` (default: `portainer_agent`)
- `PORTAINER_AGENT_PORT` (default: `9001`)

## Host Setup

- No data directory setup required.

## Host Requirements

- Docker Engine running on host.
- Port `9001/tcp` reachable from central Portainer Server only (recommended via host firewall).
- Central Portainer Server container configured with matching `AGENT_SECRET`.

## Notes

- In recent Portainer versions, the endpoint wizard does not ask for `AGENT_SECRET`; this is configured on Portainer Server container deployment.
