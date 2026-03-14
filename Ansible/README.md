# Oversized-LLM Ansible

This folder provisions the host prerequisites for `Oversized-LLM`.

Container and stack lifecycle is managed in Portainer, not by Ansible.

Windows remains the primary boot target. Use boot controls only when you intentionally want Debian to stay active.

## 0. Prerequisites: Target Host

Before running Ansible, ensure SSH is configured on the Debian host.

### On Oversized-LLM (Debian):

1. **Install OpenSSH Server:**

   ```bash
   apt-get update
   apt-get install -y openssh-server
   systemctl enable ssh
   systemctl start ssh
   ```

2. **Configure SSH for Ansible user (run as root):**
   - Create user if needed: `useradd -m -s /bin/bash ansible_user`
   - Install `sudo` only if you want sudo-based privilege escalation:
     ```bash
     apt-get install -y sudo
     usermod -aG sudo ansible_user
     ```
   - If you install sudo and want passwordless sudo, create `/etc/sudoers.d/ansible_user`:
     ```bash
     echo 'ansible_user ALL=(ALL) NOPASSWD:ALL' > /etc/sudoers.d/ansible_user
     chmod 440 /etc/sudoers.d/ansible_user
     ```

### On your control machine (macOS):

1. **Generate SSH key (if you don't have one):**

   ```bash
   ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519 -C "ansible-control"
   ```

2. **Copy public key to Oversized-LLM:**

   ```bash
   ssh-copy-id -i ~/.ssh/id_ed25519.pub -p 22 ansible_user@<oversized-llm-ip>
   ```

   Replace `<oversized-llm-ip>` with the Debian host's LAN IP address.

3. **Test SSH connectivity:**

   ```bash
   ssh -i ~/.ssh/id_ed25519 ansible_user@<oversized-llm-ip> "echo 'SSH works!'"

   ssh -i /Users/chill/.ssh/id_ed25519 -p 22 'ansible_user@192.168.1.38'
   ```

4. **Verify privilege escalation path (optional):**
   ```bash
   ssh -i ~/.ssh/id_ed25519 ansible_user@<oversized-llm-ip> "su -c 'whoami'"
   ```
   If using sudo instead, test with: `sudo whoami`.

## 1. Prepare control machine

Install Ansible (macOS): ✅

```bash
brew install ansible
```

Set host values in `inventory/hosts.yml`:

- Replace `<oversized-llm-ip>` with the Debian host's LAN IP address
- Replace `ansible_user` with the SSH user (created in prerequisites)
- Ensure `ansible_ssh_private_key_file` points to your SSH private key (e.g., `~/.ssh/id_ed25519`)

If your Debian host does **not** use sudo, add these host vars in `inventory/hosts.yml`:

```yaml
ansible_become: true
ansible_become_method: su
```

When using `su`, run playbooks with `--ask-become-pass` (or set `ansible_become_password` securely via vault).

Update `host_vars/Oversized-LLM.yml` with GPU and Ollama model settings: ✅

Create encrypted secrets file: ✅

```bash
cd Ansible
cp secrets/vault.template.yml secrets/vault.yml
ansible-vault encrypt secrets/vault.yml
```

Set these secrets in `secrets/vault.yml`: ✅

- `tailscale_auth_key` (must be a node auth key starting with `tskey-auth-`, not `tskey-api-`)

## 2. Provision host

```bash
ansible-playbook playbooks/provision_gpu_server.yml --ask-vault-pass
```

## 3. Stack management (Portainer)

Use Portainer Stack UI/API with compose files in top-level stack folders.

See stack-specific setup docs:

- `../portainer/README.md`
- `../ollama/README.md`
- `../traefik/README.md`
- `../adguard-home/README.md`
- `../linkwarden/README.md`
- `../openobserve/README.md`
- `../birdnet-go/README.md`
- `../birdnet-pi/README.md`
- `../git-sync/README.md`

## 4. Boot policy controls

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

## 5. Validation

On Debian:

```bash
nvidia-smi
```
