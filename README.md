# [LEGO Collection](https://lego-collection-chi.vercel.app/)

This web application manages LEGO sets using Node.js and Express.js. It supports CRUD (Create, Read, Update, Delete) operations, dynamic HTML rendering with EJS templates, responsive forms, and integrates with a PostgreSQL database through Sequelize ORM.

## Technologies Used and Features

### Frontend
- **EJS (Embedded JavaScript)**: Renders dynamic HTML content on the server side.
- **Tailwind CSS**: Builds a responsive and visually appealing user interface.
- **JavaScript**: Adds interactivity and client-side functionality.

### Backend
- **Node.js**: Provides server-side scripting capabilities.
- **Express.js**: A lightweight framework for handling routing and middleware.

### Database
- **PostgreSQL**: A robust, open-source relational database for storing and managing data.
- **Sequelize ORM**: A promise-based Node.js ORM for managing database operations with PostgreSQL.
- **CRUD Operations**: Allows users to create new sets, read existing sets, update set details, and delete sets as needed.

## Installation and Setup

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add:
   ```env
   PORT=8080
   DATABASE_URL=postgres://username:password@localhost:5432/database_name
   SESSION_SECRET=your_session_secret
   ```

4. **Set Up the Database**

5. **Start the Application**
   ```bash
   npm start
   ```
   Access the app at `http://localhost:8080`.

## Usage

- **Home Page**: Displays all LEGO sets with links to details about each set.
- **Add Set**: Form for submitting new LEGO sets with details like name, year, number of parts, and image URL.
- **Edit Set**: Modify details of existing LEGO sets.
- **Delete Set**: Remove LEGO sets from the collection.
- **Register** Allows new users to create an account and access the application.
- **Login/Logout**: Manages user authentication; login is required for accessing and managing protected routes.
- **User History**: View login history and activity for authenticated users.

## Error Handling

- **404 (Not Found)**: Displays an error page when a resource or page is not found.
- **500 (Internal Server Error)**: Shows an error page for unexpected server issues, with detailed logs for debugging.
