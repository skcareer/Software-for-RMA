#!/bin/bash

if ping -q -c 1 -w 1 8.8.8.8 >/dev/null;  then
    echo "Online"
else
    echo "Offline"
    sudo wvdial 3gconnect &
    sleep 15
    sudo route add default dev ppp0
fi

