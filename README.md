# Pombo Labs: The Chain Builder

<p align="center">
  <img src="public/logo.png" alt="Pombo Labs Logo" width="150">
</p>

<p align="center">
  <strong>Building free, evidence-based tools to empower parents of children with autism.</strong>
  <br />
  <a href="#our-mission">Our Mission</a> •
  <a href="#about-the-chain-builder">About The Project</a> •
  <a href="#key-features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#license">License</a>
</p>

---

## Our Mission

For many parents of children with autism, accessing effective, evidence-based programs like Applied Behavior Analysis (ABA) is prohibitively expensive and logistically challenging. Pombo Labs was created to bridge that gap.

We translate proven clinical strategies into simple, free, and accessible digital tools that parents can use at home. Our goal is to empower parents with the resources they need to teach their children critical life skills, foster independence, and build a more confident and joyful life together.

## About the "Chain Builder"

This repository contains the source code for our first flagship tool: the **Chain Builder**.

Chaining is a powerful behavioral strategy used to teach complex skills by breaking them down into a sequence of smaller, manageable steps. For example, a skill like "Washing Hands" can be broken down into 10-12 individual actions.

The Chain Builder helps parents create, manage, and track these skill chains for their children. It provides a structured, visual, and data-driven way to teach multi-step tasks, turning what can be an overwhelming process into a clear, step-by-step journey. The tool is designed to support the two primary methods of chaining:

-   **Forward Chaining:** Teaching the first step of the chain until it's mastered, then the second, and so on.
-   **Backward Chaining:** Teaching the last step of the chain first. This is highly motivating as the child always gets to complete the task and immediately experience the successful outcome.

## Key Features

-   **Task Analysis Library:** Start with pre-built templates for common daily routines like "Brushing Teeth," "Getting Dressed," and "Setting the Table."
-   **Fully Customizable Chains:** Edit, reorder, or delete steps in any template. Add your own photos or icons to make each step visually clear and personalized for your child. Create entirely new chains from scratch for any skill you want to teach.
-   **Live Training Module:** An "in-the-moment" interface for teaching. As you guide your child through the skill, you can quickly mark each step as Independent (★) or Prompted . The tool automatically highlights the target step based on the chaining method you've chosen.
-   **Visual Progress Dashboard:** See your child's progress at a glance. The tool visualizes which steps are mastered, which are in progress, and which are yet to be taught. Simple charts and encouraging feedback help you stay motivated and celebrate every success.

## Tech Stack

This project is built with a modern, scalable, and cost-effective tech stack.

| Category           | Technology                                       |
| ------------------ | ------------------------------------------------ |
| **Framework**      | [Next.js](https://nextjs.org/)                   |
| **Language**       | [TypeScript](https://www.typescriptlang.org/)    |
| **Styling**        | [Tailwind CSS](https://tailwindcss.com/)         |
| **UI Components**  | [Shadcn/ui](https://ui.shadcn.com/)              |
| **Backend**        | [Firebase](https://firebase.google.com/)         |
| **Database**       | [Firestore](https://firebase.google.com/docs/firestore) |
| **Authentication** | [Firebase Auth](https://firebase.google.com/docs/auth) |
| **Deployment**     | [Vercel](https://vercel.com/)                    |

## Project Structure

The project follows the Next.js App Router paradigm for a clear and scalable architecture.

```
src/
├── app/                # Next.js App Router
│   ├── (auth)/         # Routes for unauthenticated users
│   ├── (app)/          # Main application (protected) routes
│   ├── api/            # Server-side API routes
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Landing page
├── components/         # React components
│   ├── ui/             # Generic, reusable UI elements (e.g., Button, Card)
│   ├── layout/         # Major layout components (e.g., Navbar)
│   └── features/       # Feature-specific components (e.g., ChainBuilder)
├── lib/                # Helper functions, hooks, and core logic
│   ├── firebase/       # All Firebase client logic (config, auth, firestore)
│   ├── hooks/          # Custom React Hooks (e.g., useAuth)
│   └── utils.ts        # General utility functions
└── types/              # Centralized TypeScript type definitions
```

## Getting Started

Follow these steps to get the project running locally.

### Prerequisites

-   Node.js (v18 or later)
-   `pnpm` (or `npm`/`yarn`)
-   A Firebase project (create one for free at [firebase.google.com](https://firebase.google.com))

### Installation

1.  **Clone the repository:**
    *(Note: Please fork the repository first and clone your fork if you intend to contribute.)*

    ```bash
    git clone https://github.com/your-github-username/pombo-labs.git
    cd pombo-labs
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**

    -   Create a file named `.env.local` in the root of the project.
    -   In your Firebase project settings, find your web app's configuration object.
    -   Add your Firebase configuration to the `.env.local` file. It should look like this:

    ```
    NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
    NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
    ```

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

We recommend following the standard GitHub flow:

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

For more detailed guidelines, please see the (upcoming) `CONTRIBUTING.md` file.

## License

This project is distributed under the MIT License. See `LICENSE.txt` for more information.

*(Note: I can help you create a `LICENSE.txt` file if you'd like.)*

Contact
Pombo Labs - code@pombolabs.com

Project Link: https://github.com/Pombo-Labs/chaining