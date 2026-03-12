# Project Handoff: Local LLM Coding Server (RTX 3080 10GB)

## 1. Hardware Context

- **Host:** Windows 10 (Primary) / Debian (Coding Partition).
- **GPU:** NVIDIA RTX 3080 (10GB GDDR6X VRAM).
- **Client:** MacBook running VS Code (v1.110+).

## 2. Model Strategy (The "Architect & Builder" Workflow)

To manage a **4,000 LOC Next.js/HeroUI/Tailwind** codebase within 10GB VRAM:

- **Architect (Cloud):** Use **Claude 4.6 Opus** or **GPT-5.3 Codex**.
  - _Role:_ Analyze entire repo, create modular implementation plans, and identify specific "context chunks" (types/helpers) for the local model.
- **Builder (Local):** Use **Qwen3.5-9B** or **Qwen3-Coder (7B/9B)**.
  - _Role:_ Fast, private code generation and "Auto Agent" task execution.
  - _Quantization:_ Use **GGUF/EXL2 (4-bit or 6-bit)** to stay under 8GB VRAM usage, leaving 2GB for KV Cache (approx. 8k-16k context).

## 3. Infrastructure & Deployment (GitOps)

- **OS:** Dual-boot into **Debian** for headless LLM serving.
- **Orchestration:** **Ansible** provisions the node:
  - Installs NVIDIA drivers + `nvidia-persistenced` (keeps GPU ready).
  - Deploys **Portainer** and connects it to a **Git Repository**.
  - Deploys the LLM Stack (Ollama/vLLM) via **Portainer Stacks** linked to Git.
- **Networking:** **Tailscale** for secure, encrypted MagicDNS access (`http://debian-box:11434`) from the MacBook.
- **Boot Flow:**
  - Windows is default.
  - Use a PowerShell script (`bcdedit`) for a "one-time boot" into Debian.
  - Debian auto-starts Tailscale and Ollama via Systemd.

## 4. Security Configuration

- **Access:** Restricted to Tailscale interface (`tailscale0`) via `ufw`.
- **Execution:** VS Code "Auto Agent" set to **Manual Approval** for terminal commands.
- **Isolation:** Rootless Docker containers for LLM processes.

## 5. Next Steps / Pending Tasks

- [ ] Finalize the **Ansible Playbook** for NVIDIA + Portainer.
- [ ] Create the **PowerShell "One-Time Boot"** script for Windows.
- [ ] Configure the **Claude 4.6 System Prompt** to output "VRAM-optimized" task chunks.
