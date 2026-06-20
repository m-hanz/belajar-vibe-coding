# Perencanaan Implementasi: Fitur Registrasi User Baru

Dokumen ini berisi panduan dan tahapan (step-by-step) untuk mengimplementasikan fitur registrasi pengguna baru. Panduan ini dirancang agar dapat diimplementasikan dengan mudah oleh junior programmer atau AI model.

---

## 1. Pembaruan Skema Database

Langkah pertama adalah memperbarui definisi tabel `users` di dalam file `src/db/schema.ts`.

**Spesifikasi Kolom `users`**:
- `id`: integer, auto increment, primary key
- `name`: varchar(255), tidak boleh kosong (not null)
- `email`: varchar(255), tidak boleh kosong (not null), harus unik (unique)
- `password`: varchar(255), tidak boleh kosong (not null) - **Catatan:** Kolom ini akan menyimpan password yang sudah di-hash menggunakan `bcrypt`.
- `created_at`: timestamp, default ke waktu saat ini (current_timestamp)
- `updated_at`: timestamp, default ke waktu saat ini (current_timestamp), dan otomatis diperbarui saat ada pembaruan (on update current_timestamp)

**Aksi yang Diperlukan**:
Setelah memperbarui file `schema.ts`, jalankan tool migrasi dari Drizzle Kit (misal: `bunx drizzle-kit generate` dan aplikasikan ke database) agar perubahan ini terefleksi di database MySQL.

---

## 2. Struktur Folder & Penamaan File

Untuk menjaga kerapian arsitektur kode (Separation of Concerns), kita akan memisahkan antara bagian routing (ElysiaJS) dan logika bisnis.

Buat struktur folder dan file berikut di dalam folder `src`:
- `src/routes/` : Folder ini berisi routing ElysiaJS.
  - 📄 Buat file: `users-route.ts`
- `src/services/` : Folder ini berisi logika bisnis aplikasi yang berinteraksi langsung dengan database.
  - 📄 Buat file: `users-service.ts`

---

## 3. Instalasi Dependency Hashing

Karena kita akan menggunakan `bcrypt` untuk melakukan hashing password, pastikan package tersebut terinstal:
```bash
bun add bcryptjs
bun add -d @types/bcryptjs
```
*(Catatan: `bcryptjs` lebih disarankan karena merupakan implementasi pure JavaScript yang lebih mudah diinstal di berbagai environment tanpa perlu build tool C++ dibandingkan `bcrypt` native).*

---

## 4. Spesifikasi API Endpoint

Implementasikan API endpoint untuk menangani pendaftaran pengguna baru dengan spesifikasi berikut:

- **Method & Endpoint**: `POST /api/users`

**Request Body (Format JSON)**:
```json
{
    "name": "example",
    "email": "example@gmail.com",
    "password": "password" 
}
```

**Response Body (Jika Berhasil)**:
```json
{
    "data": "OK"
}
```

**Response Body (Jika Gagal - Email sudah terdaftar)**:
```json
{
    "error": "Email sudah terdaftar"
}
```

---

## 5. Tahapan Implementasi (Langkah demi Langkah)

Berikut adalah urutan pengerjaan yang harus diikuti oleh Programmer / AI:

1. **Update Skema & Database**:
   - Buka `src/db/schema.ts` dan ubah skema tabel `users` sesuai spesifikasi pada Poin 1.
   - Buat file migrasi dan jalankan migrasi ke database.

2. **Buat Logika Bisnis (Service)**:
   - Buka (atau buat) file `src/services/users-service.ts`.
   - Buat sebuah fungsi asynchronous, misalnya `registerUser(data)`.
   - Di dalam fungsi tersebut:
     - Lakukan pengecekan ke database menggunakan Drizzle ORM: apakah `email` yang dikirim sudah ada di tabel `users`?
     - Jika email sudah ada, langsung kembalikan atau `throw` sebuah error yang menyatakan "Email sudah terdaftar".
     - Jika email belum ada, lakukan hashing pada password yang diterima menggunakan library `bcryptjs` (gunakan `bcrypt.hash` atau `bcrypt.hashSync`).
     - Simpan data user baru (name, email, password hash) ke dalam database.
     - Kembalikan status berhasil.

3. **Buat Routing (Controller/Route)**:
   - Buka (atau buat) file `src/routes/users-route.ts`.
   - Inisialisasi routing menggunakan ElysiaJS (`new Elysia()`).
   - Buat endpoint `POST /api/users`.
   - Di dalam handler endpoint ini, panggil fungsi `registerUser` dari `users-service.ts` dengan melemparkan `body` dari request.
   - Gunakan blok `try...catch` untuk menangani proses. Jika sukses, kembalikan JSON `{ "data": "OK" }`. Jika terjadi error (khususnya karena email duplikat), tangkap error tersebut dan kembalikan JSON `{ "error": "Email sudah terdaftar" }`.
   - (Opsional/Direkomendasikan): Gunakan schema validation bawaan Elysia (`t.Object(...)`) untuk memvalidasi body request agar sesuai format.

4. **Registrasi Route ke Entrypoint Utama**:
   - Buka file utama server di `src/index.ts`.
   - Import routing yang ada di `users-route.ts`.
   - Daftarkan routing tersebut ke instance utama Elysia menggunakan metode `.use()`.

5. **Testing & Verifikasi**:
   - Jalankan server secara lokal (`bun run dev`).
   - Lakukan request HTTP POST ke `http://localhost:3000/api/users` menggunakan Postman, cURL, atau tool serupa.
   - Pastikan response sesuai spesifikasi saat membuat user baru.
   - Lakukan request kedua dengan email yang sama dan pastikan pesan error `"Email sudah terdaftar"` muncul dengan benar.
