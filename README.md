# Waste Management Backend

Backend API untuk sistem manajemen pemusnahan limbah.

## Prerequisites

- Node.js (v18 atau lebih tinggi)
- PostgreSQL database

## Installation

1. Install dependencies:

```bash
npm install
```

2. Copy dan configure environment variables:

```bash
cp .env.example .env
```

3. Edit file `.env` dengan konfigurasi database dan environment yang sesuai.

## Running the Application

### Development Mode

```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000` dengan auto-reload menggunakan nodemon.

**Atau menggunakan nodemon langsung:**

```bash
npx nodemon
```

### Production Mode

```bash
npm start
```

**Note:** Backend dapat berjalan tanpa database untuk development/testing. Jika database tidak tersedia, aplikasi akan menampilkan warning tapi tetap berjalan di port 3000.

## API Endpoints

Backend menyediakan RESTful API endpoints untuk:

- Authentication (`/auth`)
- User management (`/users`)
- Permohonan pemusnahan limbah (`/permohonan`)
- Berita acara (`/berita-acara`)
- Workflow management (`/workflow`)
- Document generation (`/documents`)
- Labels (`/labels`)
- Configuration (`/config`)

## Environment Variables

Pastikan file `.env` berisi konfigurasi berikut:

- `DB_HOST`: Database host
- `DB_PORT`: Database port
- `DB_NAME`: Database name
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
- `JWT_SECRET`: Secret key untuk JWT
- `PORT`: Port server (default: 3000)
- `NODE_ENV`: Environment (development/production)
