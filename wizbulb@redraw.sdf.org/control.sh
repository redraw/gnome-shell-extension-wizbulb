#!/bin/bash
ip=$1
port=38899
action=$2
state=$(echo '{"method": "getPilot"}' | nc -u $ip $port -w1 | jq ".result")

send() {
    nc -u $ip $port -w1 > /dev/null
}

case $action in
    "on")
        echo '{"method": "setPilot", "params": {"state": true}}' | send
        ;;
    "off")
        echo '{"method": "setPilot", "params": {"state": false}}' | send
        ;;
    "night")
        echo '{"method": "setPilot", "params": {"sceneId": 14}}' | send
        ;;
    "brighter")
        dimming=$(echo $state | jq -r .dimming)
        echo '{"method": "setPilot", "params": {"dimming": '$((dimming + 10))'}}' | send
        ;;
    "darker")
        dimming=$(echo $state | jq -r .dimming)
        echo '{"method": "setPilot", "params": {"dimming": '$((dimming - 10))'}}' | send
        ;;
    "warmer")
        temp=$(echo $state | jq -r .temp)
        echo '{"method": "setPilot", "params": {"temp": '$((temp - 500))'}}' | send
        ;;
    "colder")
        temp=$(echo $state | jq -r .temp)
        echo '{"method": "setPilot", "params": {"temp": '$((temp + 500))'}}' | send
        ;;
esac

