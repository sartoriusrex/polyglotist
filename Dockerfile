# Pull from a base image
FROM node:12-alpine

# Copy the files from the current directory to app/
COPY . app/

# Skip downloading chromium for puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Use app/ as the working directory
WORKDIR app/

# Install dependencies (npm ci is similar to npm i, but for automated builds)
RUN npm i

# Build production client side React application
RUN npm run build

# Listen on the specified port
EXPOSE 8080

# Set Node server
ENTRYPOINT npm run start

