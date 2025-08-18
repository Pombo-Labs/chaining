Pombo Labs: The Chain Builder
<p align="center">
<img src="https://placehold.co/600x300/e2e8f0/4a5568?text=Pombo+Labs&font=raleway" alt="Pombo Labs Banner">
</p>

<p align="center">
<strong>Building free, evidence-based tools to empower parents of children with autism.</strong>
<br />
<a href="#about-the-project">About The Project</a> •
<a href="#key-features">Features</a> •
<a href="#tech-stack">Tech Stack</a> •
<a href="#getting-started">Getting Started</a> •
<a href="#contributing">Contributing</a>
</p>

Our Mission
For many parents of children with autism, accessing effective, evidence-based programs like Applied Behavior Analysis (ABA) is prohibitively expensive and logistically challenging. Pombo Labs was created to bridge that gap.

We translate proven clinical strategies into simple, free, and accessible digital tools that parents can use at home. Our goal is to empower parents with the resources they need to teach their children critical life skills, foster independence, and build a more confident and joyful life together.

About the Project: The "Chain Builder"
This repository contains the source code for our first flagship tool: the Chain Builder.

Chaining is a powerful behavioral strategy used to teach complex skills by breaking them down into a sequence of smaller, manageable steps. For example, a skill like "Washing Hands" can be broken down into 10-12 individual actions.

The Chain Builder helps parents create, manage, and track these skill chains for their children. It provides a structured, visual, and data-driven way to teach multi-step tasks, turning what can be an overwhelming process into a clear, step-by-step journey. The tool is designed to support the two primary methods of chaining:

Forward Chaining: Teaching the first step of the chain until it's mastered, then the second, and so on.

Backward Chaining: Teaching the last step of the chain first. This is highly motivating as the child always gets to complete the task and immediately experience the successful outcome.

Key Features
📚 Task Analysis Library: Start with pre-built templates for common daily routines like "Brushing Teeth," "Getting Dressed," and "Setting the Table."

✏️ Fully Customizable Chains: Edit, reorder, or delete steps in any template. Add your own photos or icons to make each step visually clear and personalized for your child. Create entirely new chains from scratch for any skill you want to teach.

🚀 Live Training Module: An "in-the-moment" interface for teaching. As you guide your child through the skill, you can quickly mark each step as Independent (★) or Prompted (🤝). The tool automatically highlights the target step based on the chaining method you've chosen.

📊 Visual Progress Dashboard: See your child's progress at a glance. The tool visualizes which steps are mastered, which are in progress, and which are yet to be taught. Simple charts and encouraging feedback help you stay motivated and celebrate every success.

Tech Stack
This project is built with a modern, scalable, and cost-effective tech stack, chosen specifically to support our non-profit mission.

Frontend

Backend & Database

Hosting & Deployment

Next.js

Firebase

Vercel

React

Firestore



TypeScript

Firebase Auth



Tailwind CSS





Getting Started
Interested in running the project locally or contributing? Follow these steps.

Prerequisites
Node.js (v18 or later)

pnpm (or npm/yarn)

A Firebase project (you can create one for free at firebase.google.com)

Installation
Clone the repository:

git clone https://github.com/your-github-username/pombo-labs.git
cd pombo-labs

Install dependencies:

pnpm install

Set up environment variables:

Create a file named .env.local in the root of the project.

In your Firebase project settings, find your web app's configuration object.

Add your Firebase configuration to the .env.local file. It should look like this:

# Firebase Client SDK Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

Run the development server:

pnpm dev

Open http://localhost:3000 in your browser to see the application.

Contributing
We believe in the power of community and welcome all contributions! Whether you're a developer, a designer, a therapist, or a parent with an idea, we'd love your help.

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

Please make sure your code is formatted and linted before opening a pull request.

License
Distributed under the MIT License. See LICENSE.txt for more information.

Contact
Pombo Labs - your-email@example.com

Project Link: https://github.com/your-github-username/pombo-labs
