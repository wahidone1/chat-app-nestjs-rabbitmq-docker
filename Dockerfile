# Tahap 1: Build untuk Development
FROM node:alpine AS development

# Menetapkan direktori kerja
WORKDIR /usr/src/app

# Salin package.json dan package-lock.json
COPY package*.json ./

# Install semua dependencies
RUN npm install

# Salin seluruh kode aplikasi
COPY . .

# Build aplikasi
RUN npm run build

# Tahap 2: Build untuk Production
FROM node:alpine AS production

# Set variabel lingkungan untuk produksi
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Menetapkan direktori kerja
WORKDIR /usr/src/app

# Salin hanya package.json dan package-lock.json untuk produksi
COPY package*.json ./

# Install hanya dependencies untuk produksi
RUN npm install --only=production

# Salin aplikasi yang sudah dibuild dari tahap development
COPY --from=development /usr/src/app/dist ./dist

# Set entry point untuk aplikasi
CMD ["node", "dist/main"]
