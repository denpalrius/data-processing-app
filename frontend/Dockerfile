# Use the official Node.js image as the base image
FROM node:22

# Install pnpm globally
RUN npm install -g pnpm

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and pnpm-lock.yaml to the working directory
COPY package.json pnpm-lock.yaml ./

# Install the application dependencies using pnpm
RUN pnpm install

# Copy the rest of the application files
COPY . .

# Build the Next.js application
RUN pnpm build

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["pnpm", "start"]