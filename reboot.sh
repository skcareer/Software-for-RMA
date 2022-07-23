#!/bin/bash

if ping -q -c 1 -w 1 8.8.8.8 >/dev/null;  then
    echo "Online"
else
    echo "Offline"
    sudo sudo reboot
fi
