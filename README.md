# CMath Education Platform

This is a web application built with Next.js and TypeScript for the online education system of the CMath Mathematics Club. The platform supports multiple roles such as students, teachers, parents, assistants, managers, and administrators, helping manage courses, classes, documents, assignments, announcements, and the overall learning experience.

## Overview

This project uses the Next.js App Router together with Ant Design to build a modern, user-friendly interface. The application provides the following main features:

> This frontend project is designed to work together with the Node.js backend repository available at https://github.com/Kouhakouu/NODEJS. Please make sure the backend service is running as well for full functionality.

- Homepage and club introduction
- User login and registration
- Course and class management
- Documents, assignments, and student profiles
- Role-based interfaces for students, teachers, assistants, managers, and admins
- Chatbot integration and other interactive components

## Technologies Used

- Next.js 14
- React 18
- TypeScript
- Ant Design
- Axios
- Recharts
- Day.js
- Xlsx
- dotenv

## Project Structure

- src/app: main routes and layouts
- src/components: UI components organized by module
- src/library: context providers and application state
- src/utils: utility functions such as API calls
- src/types: TypeScript type definitions
- public: static assets such as images and banners

## Requirements

- Node.js 18+
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd REACTJS
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create an environment file if needed:
   ```bash
   cp .env.example .env.local
   ```
   If there is no .env.example file, you can create .env.local manually and add the required environment variables.

## Run the Application in Development Mode

```bash
npm run dev
```

Then open your browser at:

```bash
http://localhost:3000
```

## Build for Production

```bash
npm run build
npm run start
```

## Lint

```bash
npm run lint
```

## Notes

- The application currently uses the Next.js App Router and contains separate modules for different user roles.
- If you need to connect to a backend, configure the appropriate API URL in the environment variables or related configuration files.
- For further development, you can extend the modules inside the src/components and src/app folders based on the required features.

## Author

PhongBui
