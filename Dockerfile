# Use an official Node.js runtime as a parent image
FROM node:14-alpine

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the Angular application
RUN npm run build -- --prod

# Expose port 80
EXPOSE 80

# Run the Angular application when the container starts
CMD ["npm", "run", "start"]
