
# Use the official Node.js image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install pnpm 
RUN npm install -g pnpm@latest-10

# Install the application dependencies
RUN pnpm install

# Copy the rest of the application files
COPY . .

# Build the NestJS application
RUN pnpm run build

# Expose the application port
EXPOSE 3002

# Command to run the application
# CMD ["node", "dist/main"]
CMD ["pnpm", "start:prod"]