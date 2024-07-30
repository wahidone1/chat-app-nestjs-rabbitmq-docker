# Aplikasi Chat Berbasis Microservices

## Deskripsi

Aplikasi chat ini dibangun menggunakan NestJS dengan arsitektur microservices. Fitur utama mencakup autentikasi pengguna, pengelolaan pengguna, pengiriman pesan, dan notifikasi. Aplikasi juga menggunakan Swagger untuk dokumentasi API, unit testing, end-to-end testing, serta di-deploy menggunakan Docker.

## Daftar Isi

1. [Struktur Proyek](#struktur-proyek)
2. [Prasyarat](#prasyarat)
3. [Instalasi](#instalasi)
4. [Penggunaan](#penggunaan)
5. [Dokumentasi API](#dokumentasi-api)
6. [Testing](#testing)
7. [Docker](#docker)

## Struktur Proyek

```
.
├── src
│   ├── auth
│   │   ├── dto
│   │   │   ├── login.dto.ts
│   │   │   ├── register.dto.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   ├── common
│   │   ├── services
│   │   │   ├── astrology.service.ts
│   ├── messages
│   │   ├── dto
│   │   │   ├── create-message.dto.ts
│   │   ├── schemas
│   │   │   ├── message.schema.ts
│   │   ├── messages.controller.ts
│   │   ├── messages.module.ts
│   │   ├── messages.service.ts
│   ├── notification
│   │   ├── notification.module.ts
│   │   ├── notification.service.ts
│   ├── user
│   │   ├── dto
│   │   │   ├── update-user.dto.ts
│   │   ├── schemas
│   │   │   ├── user.schema.ts
│   │   ├── user.controller.ts
│   │   ├── user.module.ts
│   │   ├── user.service.ts
│   ├── app.module.ts
│   ├── main.ts
├── test
│   ├── app.e2e-spec.ts
├── docker-compose.yml
├── Dockerfile
├── package.json
├── README.md
└── tsconfig.json
```

## Prasyarat

- Node.js (versi 14 atau lebih baru)
- NestJS
- Docker
- MongoDB

## Instalasi

1. Clone repositori:

   ```bash
   git clone <repository-url>
   cd chat-app
   ```

2. Instalasi dependensi:
   ```bash
   npm install
   ```

## Penggunaan

1. Menjalankan aplikasi secara lokal:

   ```bash
   npm run start:dev
   ```

2. Menjalankan aplikasi menggunakan Docker:
   Buat file `docker-compose.yml` dengan isi berikut:

   ```yaml
   version: '3.8'

    services:
      chat-app:
        build:
          context: .
          dockerfile: Dockerfile
          target: development
        command: npm run start:dev main
        env_file: .env
        volumes:
          - .:/usr/src/app
          - /usr/src/app/node_modules
        ports:
          - '3000:3000'
        environment:
          - MONGO_URI=mongodb://mongodb:27017/db-chat
          - JWT_SECRET=your_jwt_secret
          - AMQP_URL=amqp://rabbitmq:5672
        networks:
          - chat-app-network

      rabbitmq:
        image: rabbitmq:management
        ports:
          - '5672:5672'
          - '15672:15672' # RabbitMQ Management UI
        networks:
          - chat-app-network

      mongodb:
        image: mongo:6.0
        volumes:
          - mongodb_data:/data/db
        networks:
          - chat-app-network

    volumes:
      mongodb_data:

    networks:
      chat-app-network:
        driver: bridge

   ```

   Kemudian jalankan:

   ```bash
   docker-compose up --build
   ```

## Dokumentasi API

API didokumentasikan menggunakan Swagger. Setelah aplikasi berjalan, Anda dapat mengakses dokumentasi API di `http://localhost:3000/api`.

## Testing

### Unit Testing

Untuk menjalankan unit tests:

```bash
npm run test
```

### End-to-End Testing

Untuk menjalankan end-to-end tests:

```bash
npm run test:e2e
```

## Docker

Aplikasi ini menggunakan Docker untuk kontainerisasi. Gunakan `docker-compose` untuk menjalankan seluruh stack aplikasi beserta dependensinya (misalnya MongoDB).

Masih banyak kekurangan dari segi kemampuan bahkan kurang memadainya device saya, tapi saya berharap ini bisa membantu bagi siapapun

sangat terbuka untuk diskusi

saya akan sangat senang bila ada yang mau membantu memperbaiki aplikasi ini
