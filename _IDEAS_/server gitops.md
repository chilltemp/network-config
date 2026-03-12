I have a home network with multiple servers. My preferred server OS's are Raspbian, Debian, and Ubuntu, and I use Portainer to manage docker containers. I've been managing them the traditional way of ssh into the server, install stuff, updates, etc. The only devops style management I currently do is Portainer Stacks (aka Docker Compose) via github.

Current / planned general servers:

- x86 Unraid file server with many docker containers managed by Unraid
- MacMini x86 with T2 - Ubuntu with T2 libraries / services; Portainer manages containers
- x86 - Currently running Unraid, but will migrate Ubuntu or Debian with Portainer manages containers

Current / planned specialized servers:

- Raspberry Pi 4 - Raspbian setup as an interface to my ScanSnap s1500 scanner\*
- Raspberry Pi 4 - Raspbian running BirdNET (aka BirdPi)
- Raspberry Pi Zero - Raspbian running NodeRed and a WaveShare e-paper display as an interface to Home Assistant\*

I'll include my setup notes for asterisked servers

Is there a reasonable way for a home lab to manage servers via git, without writing custom scripts for everything?

=======================================================================

# HomeLab Management Strategy: GitOps & Ansible Transition

This document outlines a transition from manual SSH management to a **GitOps-lite** workflow for your x86 and Raspberry Pi servers, specifically addressing the stability of your **E-Ink Display** and the complexity of your **ScanSnap S1500** setup.

## Table of Contents

1. [Core Strategy: The Two-Pillar Approach](#1-core-strategy-the-two-pillar-approach)
2. [Refactoring the Pi Zero (E-Ink)](#2-refactoring-the-pi-zero-e-ink)
3. [Automating the ScanSnap Pi 4](#3-automating-the-scansnap-pi-4)
4. [Recommended Repository Structure](#4-recommended-repository-structure)
5. [Summary of Benefits](#5-summary-of-benefits)

---

## 1. Core Strategy: The Two-Pillar Approach

To avoid custom scripts, you should split your management into two standardized tools:

### Pillar A: Portainer Edge (For Containers)

- **The Workflow:** Continue using GitHub for Docker Compose.
- **The Improvement:** Install **Portainer Edge Agents** on all nodes (including the Pis). Link them to one central Portainer instance (e.g., on your Unraid server).
- **GitOps:** Use the "Automatic Updates" polling feature in Portainer. When you push a change to a Compose file on GitHub, the Edge Agent pulls and redeploys the container automatically.

### Pillar B: Ansible (For OS & Hardware)

- **The Workflow:** Ansible replaces your manual setup notes. It is "agentless" and runs over SSH.
- **The Improvement:** Instead of `nano /etc/fstab`, you define the mount in a YAML file. Ansible ensures the state of the machine matches your Git repo.

---

## 2. Refactoring the Pi Zero (E-Ink)

The freezes on your Pi Zero are likely due to the overhead of **Node-Red** on a single-core CPU.

- **The Fix:** Replace Node-Red with a single **Python Service** using `paho-mqtt`.
- **Automation:** Use Ansible to enable SPI, install Python dependencies, and deploy a `systemd` unit file to keep the script running.
- **Stability:** This reduces memory usage by ~70%, eliminating the primary cause of OS freezes.

---

## 3. Automating the ScanSnap Pi 4

Your ScanSnap setup is excellent but complex to rebuild. Ansible can consolidate your documentation into executable code.

### Automated Tasks:

- **Package Management:** Bulk install the 15+ `apt` dependencies you listed.
- **Configuration:** Deploy `scanbd.conf` and your custom `scan.sh` as templates.
- **Secrets Management:** Use **Ansible Vault** to store your SMB credentials. This allows you to commit your configuration to GitHub securely without exposing passwords.
- **Kiosk Mode:** Automate the `wayfire.ini` edits and the `wvkbd` installation.

---

## 4. Recommended Repository Structure

Organize your single "HomeLab" GitHub repository as follows:

```text
/inventory.ini          # List of server IPs/hostnames
/group_vars/            # Shared variables (e.g., SMB server IP)
/playbooks/
  ├── common.yml        # Updates and security for all servers
  ├── scanner.yml       # ScanSnap specific logic (SANE/scanbd)
  └── display.yml       # Pi Zero logic (SPI/Python/MQTT)
/roles/
  ├── scanner/templates # Your scan.sh and scanbd.conf files
  └── display/files     # Your E-Ink Python drawing script
/stacks/                # Folder for Portainer to watch
  ├── docker-compose.yml

## 5. Summary of Benefits
Disaster Recovery: If a Pi SD card dies, you run one Ansible command to fully restore it.
Consistency: No more "I forgot how I configured that" scenarios.
No Scripts: You use built-in Ansible modules (like apt, mount, git, and template) instead of writing custom Bash logic.

AI: "Would you like me to provide a starter Ansible Playbook that specifically automates the apt installs and the SMB mount for your ScanSnap Pi?"
```
