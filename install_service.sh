#!/usr/bin/env bash

if [[ $EUID -gt 0 ]]; then
  echo "Error: run as root/sudo" >&2
  exit 1
fi

if ! [ -x "$(command -v npm)" ]; then
  echo 'Error: "npm" not found' >&2
  exit 1
fi

if ! [ -d "/lib/systemd/system" ]; then
  echo 'Services folder is not exists. Script is not prepared for current OS' >&2
  exit 1
fi

read -rp "Enter service name [dc_bot]: " SERVICE_NAME
SERVICE_NAME=${SERVICE_NAME:-dc_bot}

SCRIPT_DIR=$(realpath "$(dirname "${BASH_SOURCE[0]}")")

cat << EoF > /lib/systemd/system/"$SERVICE_NAME".service
[Unit]
Description="DisCord Bot on node.js"
After=network.target

[Service]
Type=simple
User=root
Group=root
ExecStart=/bin/sh $SCRIPT_DIR/start.sh
WorkingDirectory=$SCRIPT_DIR
Restart=always

StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=$SERVICE_NAME

[Install]
WantedBy=multi-user.target
EoF

systemctl daemon-reload

NPM_PATH=$(command -v npm)
NPM_DIR=$(dirname "$NPM_PATH")

cat << EoF > "$SCRIPT_DIR"/start.sh
export PATH=\$PATH:$NPM_DIR
npm run start
EoF

chmod +x "$SCRIPT_DIR"/start.sh

while true; do
    read -rp "Do you want to start service after reboot? yn: " yn
    case $yn in
        [Yy]* ) systemctl enable "$SERVICE_NAME"; break;;
        [Nn]* ) exit;;
        * ) echo "Please answer yes or no.";;
    esac
done

echo "Starting service..."
service "$SERVICE_NAME" start

echo "Show service log in 3 seconds..."w\
sleep 3
journalctl -u "$SERVICE_NAME"
