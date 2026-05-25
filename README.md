# The Grove Dance Manager

The Grove Dance Manager is a full-stack application for managing a dance school. It supports user authentication plus core operations around students, instructors, classes/sessions, time slots, and bookings through an ASP.NET Core API and an Angular frontend.

## Project structure

```text
.
├── TheGrove.sln                 # .NET solution
├── docker-compose.yml           # Local container setup (SQL Server, API, client)
└── src
    ├── API                      # ASP.NET Core Web API (minimal API modules, auth, startup)
    ├── Core                     # Domain models and feature/application logic
    ├── Infrastructure           # EF Core DbContext, migrations, identity/data persistence
    └── client                   # Angular frontend application
```

## Development environment setup

### Prerequisites

- .NET SDK 10
- Node.js 22+ and npm
- Docker + Docker Compose (used for SQL Server and optional full-stack container run)

### 1) Clone and enter the repository

```bash
git clone https://github.com/Mitch7709/dotnet-angular-dance-manager.git
cd dotnet-angular-dance-manager
```

### 2) Start SQL Server for local API development

```bash
docker compose up -d sqlserver
```

The API development config expects SQL Server at `localhost:1433` with:

- User: `sa`
- Password: `Password@1`
- Database: `TheGroveDB`

### 3) Run the API

```bash
dotnet restore TheGrove.sln
dotnet run --project src/API/API.csproj
```

API default local URL: `http://localhost:5190`  
OpenAPI (development): `http://localhost:5190/openapi/v1.json`

### 4) Run the Angular client

In a new terminal:

```bash
cd src/client
npm ci
npm start
```

Client default URL: `http://localhost:4200`  
The frontend development environment is configured to call the API at `http://localhost:5190/api`.

### 5) Useful development commands

From repository root:

```bash
dotnet build TheGrove.sln
dotnet test TheGrove.sln
```

From `src/client`:

```bash
npm run build
npm run test -- --watch=false
```

## Optional: run everything with Docker Compose

```bash
docker compose up --build
```

This starts SQL Server, the API (`http://localhost:5190`), and the containerized client (`http://localhost:4200`).
