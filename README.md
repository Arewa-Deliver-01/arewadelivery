# Arewadeliver – Demo Authentication System (v1)

Arewadeliver is a regional delivery platform in development.  
This repository includes **Version 1**, featuring a complete **client-side authentication workflow** for demo and testing purposes.

## 🚀 Features
- Role-based system:
  - **Customer**
  - **Vendor**
  - **Rider**
  - **Admin**
- Login & registration (localStorage-based)
- Forgot password + token reset flow
- Mobile-friendly UI
- Demo database with pre-seeded accounts

---

## 📂 Project Structure

---

## 🧪 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Customer | demo.customer@example.com | password |
| Vendor | demo.vendor@example.com | password |
| Rider | demo.rider@example.com | password |
| Admin | demo.admin@example.com | password |

---

## 📌 API Endpoints (Mocked)
These are **pseudo-endpoints** showing how the real backend API will look in the future.

### `POST /api/auth/register`
Registers a new user.

**Payload:**
```json
{
  "name": "",
  "email": "",
  "phone": "",
  "role": "",
  "password": ""
}
{
  "email": "",
  "password": ""
}

{
  "email": ""
}
{
  "token": "",
  "newPassword": ""
}
