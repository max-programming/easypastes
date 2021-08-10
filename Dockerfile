from node:16.6.1-slim

# Get the dependencies ready
RUN apt-get -y update \
    && apt-get install git -y \
    && rm -rf /root/.cache/pip/* \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Define the working directory
WORKDIR /app

# Copy all the package files and Next config
COPY package.json next.config.js ./

# Copy the environmental file
COPY .env.local ./

# Install the dependencies
RUN yarn install

# Copy the source files
COPY . .

# Run build command
RUN npm run build

# Expose the PORT
EXPOSE 3000

# Start the container
ENTRYPOINT ["npm", "run"]
