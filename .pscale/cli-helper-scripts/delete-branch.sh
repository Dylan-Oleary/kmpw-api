#!/bin/bash

. use-pscale-docker-image.sh
. wait-for-branch-readiness.sh

. authenticate-ps.sh

BRANCH_NAME="$1"

. ps-create-helper-functions.sh
delete-db-branch "$DB_NAME" "$BRANCH_NAME" "$ORG_NAME"