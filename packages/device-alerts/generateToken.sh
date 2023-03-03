#!/bin/sh
user=$1
password=$2
env=$3
curl --silent -X POST -H "Authorization: Basic `printf '%s' $user:$password | base64`" https://api-$env.k4connect.com/v3/auth | {
    read body
    read code
    if [ "$body" == 'Access Denied' ];
    then
    	echo "unauthorized" >&2
    	exit
    else
    	echo $body
    fi
}


