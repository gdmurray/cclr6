# Canada Contenders League R6 (CCLR6)

## About CCLR6

CCLR6, or Canada Contenders League R6, represents the newest chapter in Canadian Rainbow 6 Siege eSports. Designed as a comprehensive platform, CCLR6 facilitates the management of league competitions, including team registrations, player management, and real-time updates for fans and participants alike. Leveraging cutting-edge web technologies, CCLR6 aims to provide a seamless, interactive experience for both competitors and spectators, promoting the growth of Rainbow 6 Siege eSports in Canada.

## How It Works

CCLR6 operates through a web-based platform that integrates various functionalities to manage eSports competitions:

- **Team Management:** Teams can register, update their rosters, and manage their profiles. Team owners have the ability to add or remove players, as well as to update team information.
  
- **Player Registrations:** Players can join teams through invitations. They can also update their personal information, including in-game IDs and contact information.
  
- **Live Updates:** Fans and participants can follow live updates of matches, including scores, player statistics, and standings.

- **Payment Processing:** The platform supports secure payment processing for team registrations and sponsorships.

- **Automated Notifications:** CCLR6 sends out automated email notifications for important updates, registration confirmations, and competition results.

## What It Uses

CCLR6 is built using a modern tech stack, emphasizing reliability, scalability, and user experience:

- **Frontend:**
  - React.js for building the user interface, offering a responsive and dynamic experience.
  - Next.js for server-side rendering and static site generation, improving SEO and performance.
  - Tailwind CSS for styling, facilitating a customizable and maintainable CSS architecture.
  - Chakra UI for a comprehensive set of accessible and modular UI components.

- **Backend:**
  - Firebase for authentication, database storage (Firestore), and hosting.
  - Node.js and Express for server-side logic and API endpoints.
  - PostgreSQL for relational data storage, handling more complex queries and relationships.
  - Prisma as an ORM for efficient database access and management.
  - Google Cloud Functions for serverless computing, enabling scalable backend services.

- **DevOps & CI/CD:**
  - Docker for containerization, ensuring consistency across development and production environments.
  - Vercel for continuous integration and deployment, streamlining the development workflow.
  - GitHub Actions for automating workflows, including testing and linting.

- **Testing & Quality Assurance:**
  - Jest and React Testing Library for unit and integration tests.
  - ESLint and Prettier for code linting and formatting, maintaining code quality and consistency.

## Getting Started

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Set up environment variables for Firebase and other services in a `.env.local` file.
4. Start the development server with `npm run dev`.
