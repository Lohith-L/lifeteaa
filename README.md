Here’s a **professional README** for your Life Tea project (ready to paste into `README.md`):

---

# 🌿 Life Tea

**Life Tea** is an AI-powered emotional storytelling platform where users can anonymously share their feelings, tag emotions, and connect with a supportive community. Built with sentiment analysis, real-time feed updates, and intuitive analytics, Life Tea focuses on emotional awareness, privacy, and meaningful connection.

---

## 🚀 Live Demo

🔗 [https://lifeteaa.lovable.app/](https://lifeteaa.lovable.app/)

---

## 💡 Overview

Life Tea enables users to:

* Share personal stories and emotions anonymously
* Tag posts with emotion and category (e.g., Happy, Sad, Work, Relationships)
* Browse community feed with emotion filters
* Receive AI-driven sentiment feedback
* View daily and weekly emotion analytics

---

## ✨ Features

### 📌 Core Functionality

* **Anonymous Story Posting** – Share emotions without revealing your identity
* **Emotion Tags & Categories** – Organize and filter stories
* **Real-Time Feed Updates** – Fresh posts shown automatically
* **Likes & Reports** – Engage with or flag content

### 🤖 AI Integration

* **Sentiment Analysis** – Detects emotional tone (Positive / Neutral / Negative)
* Suggests tag corrections when sentiment and selected emotion differ

### 📊 Analytics

* **Mood Analytics Dashboard**

  * Daily and Weekly emotion summaries
  * Emotion distribution charts
  * Trends over time

### 🔐 Authentication

* Secure login/signup
* Forgot password and email reset flow

---

## 🧠 Technology Stack

| Frontend | Backend           | Database | AI                     |
| -------- | ----------------- | -------- | ---------------------- |
| React    | Node.js + Express | MongoDB  | Sentiment Analysis API |

Styling with Tailwind CSS and responsive design.

---

## 📁 Folder Structure

```
/client
  /src
    /components
    /pages
    /utils
/server
  /models
  /routes
  /controllers
  /middleware
```

---

## 🛠 API Endpoints

### ✨ Authentication

* `POST /api/auth/signup` — Register user
* `POST /api/auth/login` — Authenticate user
* `POST /api/auth/forgot-password` — Send reset email
* `POST /api/auth/reset-password` — Reset password

### 📝 Posts

* `POST /api/posts` — Create new post
* `GET /api/posts` — List feed
* `PUT /api/posts/:id` — Update own post
* `DELETE /api/posts/:id` — Delete own post

### 📊 Analytics

* `GET /api/analytics/overview` — Summary stats
* `GET /api/analytics/daily` — Today emotion counts
* `GET /api/analytics/weekly` — Last 7-day report

---

## ⚡ How It Works (User Flow)

1. **Signup / Login**
2. **Share Emotional Story**
3. **View Community Feed**
4. **React & Filter by Emotion**
5. **Explore Analytics Dashboard**

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repo
2. Create a feature branch
3. Submit a pull request

---

## 🏆 Credits

Built with ❤️ during a hackathon to promote emotional well-being through storytelling and AI insights.

---

If you want, I can also generate:

* 📌 Badges (Build, License, Demo) for the top of the README
* 📊 Deployment instructions
* 💻 CLI setup steps (install, run locally)


