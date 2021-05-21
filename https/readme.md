# server https sign files directory

1. Package: openssl
2. Command used in this directory: 
openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
3. Ouutput file names:
- key.pem
- cert.pem