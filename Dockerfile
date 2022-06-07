from node:16.15.0-slim

# Get dependencies ready
RUN apt-get -y update \
    && apt-get install git -y

# Cleanup
RUN rm -rf /var/lib/apt/lists/* \
    && apt-get clean

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
RUN yarn build

# Expose the PORT
EXPOSE 3000

# Start the container
ENTRYPOINT ["yarn", "run"]
