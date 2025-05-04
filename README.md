# AI Content Extractor

## Description

AI Content Extractor is a full-stack web application built using the T3 Stack (Next.js, tRPC, Tailwind CSS, TypeScript, Prisma) that allows users to extract the content from a given article URL, generate a summary and key points using the Gemini AI API, and display this information in a structured table. The table includes the article URL, the generated summary, key points, and the creation timestamp.

## Tech Stack

- **Framework:** Next.js
- **Frontend:**
  - React 19 (with TypeScript)
  - CSS: Tailwind CSS
  - Table: TanStack Table
- **Backend:**
  - tRPC and Next.js API routing (with TypeScript)
  - HTML Parser: Cheerio (npm module)
  - API Fetch: Axios
- **Database:** NeonDB (PostgreSQL) with Prisma

## Workflow

1.  The user provides an article URL in the input field on the frontend.
2.  This URL is sent to the backend.
3.  On the backend:
    - The raw HTML content of the webpage is fetched using Axios.
    - Cheerio parses the HTML to extract text content, removing unwanted elements like scripts, styles, iframes, nav, and footer.
    - The text content is filtered and selected based on a scoring system that prioritizes longer text blocks with fewer links.
    - Unwanted escape characters are removed from the selected text.
    - The text content is split into chunks of approximately 8000 characters to accommodate Gemini API prompt limits.
    - Each chunk is sent to the Gemini AI API with a prompt to generate a summary.
    - The summaries of all chunks are collected.
    - The combined summary is then sent to the Gemini AI API again with a prompt to generate a concise summary and key points in the following JSON format:
      ```json
      {
        "summary": "summary of the article goes here",
        "keypoints": ["keypoint1", "keypoint2", "keypoint3", "etc"]
      }
      ```
    - The resulting JSON object (after removing any unwanted escape characters and parsing) is stored in the NeonDB PostgreSQL database along with the original URL and a timestamp.
    - The application then fetches all entries from the database, ordered by creation time (descending).
    - This data is sent back to the frontend as the API response.
4.  On the frontend:
    - The received data is stored in a state.
    - This state is passed to a TanStack Table component, which renders the data in a styled table using Tailwind CSS.

## Setup and Installation

**Prerequisites:**

- A modern web browser to access the deployed application. No other proprietary software is required on the user's machine.

**Installation Steps:**

- Once the application is deployed on Vercel, it will be accessible via a unique URL provided by Vercel. Simply open this URL in your web browser to load the application.

**Environment Variables:**

You will need to set the following environment variables for the application to function correctly:

- `GEMINI_APIKEY`: Your Google Gemini API key.
- `DATABASE_URL`: The connection URL for your NeonDB PostgreSQL database.

## Running the Application

**Development Mode:**

1.  Clone the GitHub repository (if you are a developer contributing to the project).
2.  Navigate to the project directory in your terminal.
3.  Install the dependencies using `npm install`.
4.  Run the development server using the command: `npm run dev`.
5.  Generate the Prisma client: `npx prisma generate`.
6.  The application will typically be accessible at `http://localhost:3000` (or another port specified in the terminal).

**Production Mode:**

- The application is designed to be deployed on Vercel. When new code is pushed to the linked GitHub repository, Vercel will automatically build and deploy the changes. The live application will be available at the URL provided by Vercel.
- To build the application locally for production, run: `npm run build`.

## Database Configuration (NeonDB & Prisma)

**NeonDB Setup:**

1.  Go to the [NeonDB website](https://neon.tech/).
2.  Log in or create a new account.
3.  Create a new database using PostgreSQL.
4.  Once the database is created, copy the connection string (PostgreSQL connection URL).
5.  Create a `.env` file in the root of your project (if you are developing locally) and paste the connection string as the value for the `DATABASE_URL` environment variable.

**Prisma Setup:**

1.  Open the `schema.prisma` file in your project. This file defines your database schema. Ensure it includes the following configuration:

    ```prisma
    generator client {
      provider = "prisma-client-js"
      output   = "client"
    }

    datasource db {
      provider = "postgresql"
      url      = env("DATABASE_URL")
    }

    model Content {
      id        Int      @id @default(autoincrement())
      url       String   @unique
      summary   String?
      keyPoints String?
      createdAt DateTime @default(now())
    }
    ```

2.  **Important:** Every time you make changes to the `schema.prisma` file, you need to run the following command in your terminal to update the Prisma Client:

    ```bash
    npx prisma generate
    ```

3.  Create a directory named `lib` in the root of your project.
4.  Import the `PrismaClient` from the output path specified in your `schema.prisma` file (usually `@prisma/client`) within your backend code.

5.  **Checking Database Connection (Live):** You can use Prisma Studio to visually inspect your database in a web browser. Run the following command:

    ```bash
    npx prisma studio
    ```

6.  **Applying Schema Changes:**
    - **Push:** To automatically create or update the database schema based on your `schema.prisma` file, use:
      ```bash
      npx prisma db push
      ```
    - **Pull:** If you have manually created the table in NeonDB, you can pull the schema definition into your `schema.prisma` file using:
      ```bash
      npx prisma db pull
      ```

## Gemini API Key

1.  A Google Gemini API key is required to utilize the AI model for summarization and key point extraction.
2.  To obtain an API key, log in to [Google AI Studio](https://makersuite.google.com/).
3.  Follow the instructions to create a new API key.
4.  Once you have the key, store it in your `.env` file (if developing locally) as the value for the `GEMINI_APIKEY` environment variable:

    ```
    GEMINI_APIKEY=YOUR_API_KEY_HERE
    ```

## Usage

1.  Open the AI Content Extractor application in your web browser using the Vercel-provided URL (or the localhost URL if running locally).
2.  In the input field, paste the URL of the article you want to summarize and extract key points from.
3.  Click the "Search" or a similar button to submit the URL.
4.  Wait for a few seconds while the application processes the article and communicates with the Gemini API.
5.  Once the process is complete, a table will be displayed below the input field, showing the URL of the article, the generated summary, the key points, and the timestamp of when the data was created.

## Technical Details

- **T3 Stack:** This application leverages the T3 Stack, a modern web development stack known for its type safety and developer experience. It combines Next.js for frontend and backend, tRPC for end-to-end type-safe APIs, Tailwind CSS for utility-first styling, TypeScript for enhanced code quality, and Prisma as an ORM for database interactions.
- **HTML Parsing with Cheerio:** The backend uses Cheerio, a fast and flexible library for parsing and manipulating HTML, to extract the relevant text content from the fetched web pages.
- **Text Splitting for Gemini API:** Due to character limitations in Gemini API prompts, the extracted article content is intelligently split into smaller chunks to ensure successful processing.
- **Backend Logic:** The backend API routes handle fetching the article content, processing it for the AI, interacting with the Gemini API, and storing/retrieving data from the NeonDB database.
- **Frontend Display:** The frontend utilizes React and TanStack Table to display the processed data in a user-friendly and organized table format, styled with Tailwind CSS.

## Key Components

All the business logic for both the frontend and backend is located within the `src` folder.

- **Frontend Components:**
  - `./src/app/App.tsx`: The main component of the application.
  - `./src/app/_components`: Contains reusable UI components for the frontend.
- **Backend API Routes:**
  - `./src/server/api/routers/post.tsx`: Defines the tRPC router and API endpoints for handling user requests and data retrieval.
- **Backend Business Logic:**
  - `./src/server/api/services/getArticleContents.ts`: Contains the logic for fetching and processing the raw article content using Axios and Cheerio.
  - `./src/server/api/services/getSummaries.ts`: Handles the interaction with the Gemini AI API for generating summaries and key points.

## Development Workflow

1.  A user provides an article URL on the frontend.
2.  The frontend sends this URL to a backend API endpoint.
3.  The backend fetches the HTML content of the URL.
4.  Cheerio parses and extracts the relevant text content.
5.  The text content is split into chunks if necessary.
6.  Each chunk (or the entire text if it's within limits) is sent to the Gemini AI API with appropriate prompts.
7.  The API responses are processed and formatted.
8.  The final summary and key points are stored in the NeonDB database.
9.  The backend retrieves the data from the database.
10. The data is sent back to the frontend.
11. The frontend renders the data in a table using TanStack Table and Tailwind CSS.
