FROM node:alpine as builder
# Specify the working directory inside the container
WORKDIR /app
# Copy package.json
COPY package.json ./
# Install dependencies
RUN npm install
# Copy the rest of the source files
COPY ./ ./
# Build the application
RUN npm run build

FROM node:alpine
# Specify the working directory inside the container
WORKDIR /app
# Copy built application to the container
COPY --from=builder app/dist/ /app/dist/
COPY --from=builder app/package.json /app/
COPY --from=builder app/buildPaths.js /app/
COPY --from=builder app/tsconfig.json /app/
# Install production dependencies
RUN npm install --production --ignore-scripts
# Expose the port the container will listen on
EXPOSE 3000
# The command to execute on image start
CMD ["npm", "run", "start"]

