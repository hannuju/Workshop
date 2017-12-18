#!/bin/sh

# Database connection and output filename
DATABASE="store"
USER="root"
PASSWORD="rooot"
FILENAME=`date +%d_%m_%Y`

# Create backup and compress it to gzip
mysqldump --opt --user=${USER} --password=${PASSWORD} $DATABASE | gzip > /media/windows-share/backups/${FILENAME}.gz

echo "Backup: ${FILENAME}.gz was created"

