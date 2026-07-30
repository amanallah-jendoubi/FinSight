<br />
<div align="center">
  <img src="./frontend/src/assets/logo.png" alt="FinSight Logo" width="260" height="260">

  <h3 align="center">FinSight</h3>

  <p align="center">
    Smart personal finance assistant — track, categorize, and manage your money
    <br />
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#features">Features</a></li>
    <li><a href="#tech-stack">Tech Stack</a></li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#environment-variables">Environment Variables</a></li>
        <li><a href="#installation-and-run">Installation and Run</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

## About The Project

FinSight is a personal finance management (PFM) web app that helps users track their expenses, income, and savings. It centralizes transaction management and leverages AI to automate the classification of transactions, offering an experience close to consumer apps like Bankin' or Mint.

The entire application is containerized with Docker: it can be started easily using only Docker Compose, with no complex manual setup needed.

## Features

* **Authentication and user management** — sign-up, secure login via JWT (refresh token rotation) insuring private financial space per user.
* **Main dashboard** — overview of balance, monthly expenses/income, spending breakdown by category, and balance evolution chart.
* **Transaction management (CRUD)** — create, view, edit, delete, filter, and search transactions.
* **CSV transaction import** — upload a bank statement, parsing, duplicate detection, preview before validation.
* **Automatic transaction categorization by AI** — classification of transaction descriptions using TF-IDF + a scikit-learn classifier (Naive Bayes / logistic regression).
* **Alerts system** — real-time notifications (Socket.IO) when a budget threshold is exceeded, notification center with history.
* **Budget management by category** — monthly spending caps, real-time tracking, alerts at 80% and 100% of budget.
* **Data export** — export a monthly report in CSV/PDF format.

<p align="right">(<a href="#finsight">back to top</a>)</p>

## Tech Stack

* Frontend: React.js / Vite + charting library (Chart.js or Recharts)
* Backend: Node.js/Express (REST API + WebSocket)
* AI service: Python (scikit-learn) for automatic categorization
* Database: PostgreSQL
* Authentication: JWT (access token + refresh token)
* Containerization: Docker 

<p align="right">(<a href="#finsight">back to top</a>)</p>

## Getting Started

### Prerequisites

* [Docker Desktop](https://docs.docker.com/desktop/) installed on your machine.

### Environment Variables

Before running the app, create the following environment files.

**`backend/.env`**

```dotenv
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
PORT=3500
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
POSTGRES_HOST=
POSTGRES_PORT=5432
ML_SERVICE_URL=http://ml-service:8001
```

**`frontend/.env.development`**

```dotenv
VITE_API_URL=http://localhost:3500/api
VITE_SOCKET_URL=http://localhost:3500
```

> `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET`: secret strings used to sign the JWTs — use long, random values.
> The `POSTGRES_*` credentials must match those of the PostgreSQL container.

### Installation and Run

1. Clone the repository
   ```sh
   git clone https://github.com/<your-username>/finsight.git
   cd finsight
   ```
2. Create `backend/.env` and `frontend/.env.development` as described above.
3. Start the application:

   **Development environment**
   ```sh
   docker compose -f docker-compose.dev.yml up -d --build
   ```

   **Production environment**
   ```sh
   docker compose -f docker-compose.prod.yml up -d --build
   ```

<p align="right">(<a href="#finsight">back to top</a>)</p>

## Usage

Once the containers are up:
* The app is accessible from your browser at `http://localhost:5173` in development, and at `http://localhost` in production.
* The backend exposes its REST API at `http://localhost:3500/api`, with interactive Swagger documentation available at `http://localhost:3500/api-docs`.

<p align="right">(<a href="#finsight">back to top</a>)</p>

## License

Distributed under the MIT License.

## Contact

Amen Allah Jendoubi — amanallah.jendoubi@gmail.com — [LinkedIn](https://www.linkedin.com/in/amen-allah-jendoubi/)

Project built as part of an internship at Teamwill.

<p align="right">(<a href="#finsight">back to top</a>)</p>
