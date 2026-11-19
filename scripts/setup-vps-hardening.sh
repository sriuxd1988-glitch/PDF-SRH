#!/usr/bin/env bash
# =============================================================================
# SimplifyPDF Production VPS Hardening Script (Ubuntu 24.04 LTS / Hostinger)
# Configures UFW firewall, fail2ban, SSH key-only auth, and TCP kernel optimization.
# =============================================================================

set -euo pipefail

echo "🛡️  Starting SimplifyPDF Hostinger VPS Hardening..."

# 1. Update OS packages
echo "📦 Updating Ubuntu package repositories..."
sudo apt-get update && sudo apt-get upgrade -y
sudo apt-get install -y ufw fail2ban curl git unattended-upgrades

# 2. Configure Hardened UFW Firewall
echo "🔒 Configuring UFW Firewall..."
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp comment 'Hardened SSH'
sudo ufw allow 80/tcp comment 'HTTP Let\'s Encrypt Challenge'
sudo ufw allow 443/tcp comment 'HTTPS Traefik Proxy'
# Do NOT expose Postgres (5432), Redis (6379), or MinIO (9000) externally!
sudo ufw --force enable
sudo ufw status verbose

# 3. Configure Fail2Ban Protection
echo "🛡️  Configuring Fail2Ban Jails..."
sudo cat << 'EOF' > /etc/fail2ban/jail.local
[DEFAULT]
bantime  = 1h
findtime = 10m
maxretry = 5

[sshd]
enabled = true
port    = ssh
filter  = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime  = 24h
EOF

sudo systemctl enable fail2ban
sudo systemctl restart fail2ban

# 4. SSH Hardening (SSH Keys Only, Disable Passwords)
echo "🔑 Hardening SSH Server..."
sudo sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin prohibit-password/' /etc/ssh/sshd_config
sudo systemctl reload sshd || sudo systemctl reload ssh

# 5. Linux Kernel Network Performance & SYN Flood Defense
echo "⚡ Tuning Linux Kernel sysctl for High-Throughput & DDoS Protection..."
sudo cat << 'EOF' >> /etc/sysctl.d/99-simplifypdf-tuning.conf
# TCP SYN Cookies to resist SYN flood attacks
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_max_syn_backlog = 8192
net.ipv4.tcp_synack_retries = 2

# Increase connection queue capacity for high concurrent users
net.core.somaxconn = 65535
net.ipv4.tcp_max_tw_buckets = 1440000
net.ipv4.ip_local_port_range = 1024 65535

# Virtual Memory OOM tuning
vm.swappiness = 10
vm.overcommit_memory = 1
EOF

sudo sysctl --system

echo "✅ VPS Hardening complete! The server is protected by UFW, Fail2Ban, and optimized for high-traffic PDF concurrency."
