FROM node:16.13.1-alpine as builder
# Specify the working directory inside the container
WORKDIR /app
# Copy package.json
COPY package.json ./
# Copy Prisma schema
COPY ./prisma/schema.prisma ./prisma/
# Install dependencies
RUN yarn install
# Generate Prisma Client
RUN yarn prisma generate
# Copy the rest of the source files
COPY ./ ./
# Build the application
RUN yarn build

FROM node:16.13.1-alpine
# Specify the working directory inside the container
WORKDIR /app
# Copy built application to the container
COPY --from=builder app/dist/ ./dist/
COPY --from=builder app/package.json ./
COPY --from=builder app/node_modules ./node_modules
COPY --from=builder app/buildPaths.js ./
COPY --from=builder app/tsconfig.json ./
COPY --from=builder app/prisma/schema.prisma ./prisma/
# Remove development dependencies
RUN npm prune --production
# The command to execute on image start
CMD ["npm", "run", "start"]

