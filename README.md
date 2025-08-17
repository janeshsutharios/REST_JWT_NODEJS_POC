# REST_JWT_NODEJS_POC

A Node.js proof-of-concept REST API using JWT authentication.

## Features

- User registration & login
- JWT-based authentication
- Protected API endpoints

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or above recommended)
- MacBook (macOS)

## Setup Instructions

1. **Clone & start local server**

   ```bash
   git clone https://github.com/janeshsutharios/REST_JWT_NODEJS_POC.git
   
   cd REST_JWT_NODEJS_POC

   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   
   brew install node

   npm install express
   
   cd /Users/path/Downloads/REST_JWT_NODEJS_POC-main/jwt-demo-api
   
   node server.js
   ```
   Hence console will look like Server running on http://localhost:300

2. **Access the API**

   - By default, the server runs on [http://localhost:3000](http://localhost:3000)
   - Use tools like [Postman](https://www.postman.com/) or `curl` to interact with the endpoints. demo JSON collection is here https://github.com/janeshsutharios/REST_JWT_NODEJS_POC/blob/main/JWT%20Auth%20Demo%20Postman%20Local.postman_collection.json


