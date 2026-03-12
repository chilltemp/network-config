# Oversized-LLM Ansible

This folder provisions a single GPU host (`Oversized-LLM`) with only two containers:

- `ollama`
- `portainer_agent`

Portainer Server is external to this host. Oversized-LLM runs only the Portainer Agent.
Tailscale is used only for Ollama access.

Windows remains the primary boot target. Use boot controls only when you intentionally want Debian to stay active.

## 1. Prepare control machine

Install Ansible (macOS): ✅

```bash
brew install ansible
```

Set host values:

- `inventory/hosts.yml`
- `host_vars/Oversized-LLM.yml` ✅

Create encrypted secrets file: ✅

```bash
cd Ansible
cp secrets/vault.example.yml secrets/vault.yml
ansible-vault encrypt secrets/vault.yml
```

Set these secrets in `secrets/vault.yml`: ✅

- `tailscale_auth_key`
- `portainer_agent_secret`

## 2. Provision host

```bash
cd Ansible
ansible-playbook playbooks/provision_gpu_server.yml --ask-vault-pass
```

## 3. Deploy containers

```bash
ansible-playbook playbooks/deploy_portainer.yml
ansible-playbook playbooks/deploy_ollama.yml
```

## 4. Connect Oversized-LLM Agent to your existing Portainer Server

In your central Portainer Server UI:

1. Go to `Endpoints`.
2. Select `Add endpoint`.
3. Choose Docker environment with `Agent`.
4. Set endpoint URL to `tcp://<oversized-llm-lan-ip>:9001`.
5. Enter the same `AGENT_SECRET` used in `secrets/vault.yml` (`portainer_agent_secret`).
6. Save and verify endpoint health.

## 5. Boot policy controls

From Debian host (via Ansible):

```bash
# Keep Windows as persistent default
ansible-playbook playbooks/boot_target.yml -e boot_mode=windows_default

# Switch to persistent Debian mode
ansible-playbook playbooks/boot_target.yml -e boot_mode=debian_persistent

# One-time next boot into Debian only
ansible-playbook playbooks/boot_target.yml -e boot_mode=debian_next_boot
```

From Windows host (PowerShell as Administrator):

```powershell
# One-time next boot into Debian
.\windows-scripts\Reboot from Windows to Linux.ps1

# Persistently switch to Debian and reboot
.\windows-scripts\Reboot and Stay in Debian.ps1 -DebianGuid "{GUID-HERE}"

# Restore Windows as persistent default
.\windows-scripts\Restore Windows as Primary Boot.ps1
```

## 6. Validation

On Debian:

```bash
nvidia-smi
docker ps --format '{{.Names}}'
curl -fsS http://127.0.0.1:11434/api/tags
```

Expected containers on host:

- `ollama_server`
- `portainer_agent`

Network intent:

- Ollama (`11434`) is reachable only from Tailscale subnet.
- Portainer Agent (`9001`) is reachable only from the central Portainer Server LAN IP.
