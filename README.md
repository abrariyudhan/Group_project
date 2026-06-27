# Taskflow 📋🚀

Taskflow adalah platform manajemen tugas berbasis Kanban (*Trello-clone*) yang dirancang untuk kolaborasi tim secara *real-time*. Platform ini dilengkapi dengan fitur otomatisasi cerdas berbasis kecerdasan buatan (AI) untuk membantu meningkatkan produktivitas dan alur kerja tim.

---

## 🌟 Fitur Utama

*   **Papan Kanban Interaktif:** Manajemen kartu tugas yang intuitif menggunakan sistem *drag-and-drop*.
*   **Kolaborasi Real-Time:** Sinkronisasi data instan antar-pengguna menggunakan **Socket.io** tanpa perlu memuat ulang halaman.
*   **Automated Sub-task Generation (AI Feature):** Integrasi dengan **Google Gemini AI** yang mampu memecah tugas besar menjadi beberapa sub-tugas secara otomatis berdasarkan deskripsi proyek.
*   **Manajemen Autentikasi & Otorisasi:** Pengamanan hak akses pengguna untuk memastikan privasi dan keamanan data pada setiap board.

---

## 🛠️ Tech Stack

### Backend (Core Architecture)
*   **Runtime Environment:** Node.js
*   **Framework:** Express.js
*   **Database:** Supabase
*   **ORM:** Sequelize
*   **Real-Time Communication:** Socket.io
*   **AI Integration:** Google Gen-AI (Gemini API)

### Frontend
*   **Library:** React.js

---

## 🚀 Panduan Instalasi & Menjalankan Aplikasi (Backend)

Ikuti blok perintah di bawah ini di terminal Anda untuk menjalankan server Taskflow di lingkungan lokal secara cepat:

```bash
# 1. Klon repositori dan masuk ke direktori utama backend proyek
git clone [https://github.com/yourusername/taskflow-backend.git](https://github.com/yourusername/taskflow-backend.git) && cd taskflow-backend

# 2. Instal seluruh dependensi yang dibutuhkan
npm install

# 3. Konfigurasi Environment Variables
# Jalankan perintah ini untuk membuat file .env otomatis, kemudian lengkapi nilainya nanti
echo "PORT=3000
DATABASE_URL=postgres://postgres:password@localhost:5432/taskflow_db
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_google_gemini_api_key" > .env

# 4. Jalankan migrasi skema database PostgreSQL menggunakan Sequelize
npx sequelize-cli db:migrate

# 5. Jalankan server aplikasi dalam mode pengembangan (Development)
npm run dev
