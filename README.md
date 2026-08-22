# eSahay

### AI-Assisted Civic and Legal Action Platform

> **From understanding a problem to taking the right action.**

eSahay is an AI-assisted civic technology platform that helps citizens understand legal and administrative issues and convert them into structured, actionable workflows.

A citizen should not need to understand legal terminology, identify the correct authority, search through multiple government resources, or draft formal documents just to take the first step toward resolving a problem.

eSahay brings these steps together into a single guided workflow.

---

## 1. Overview

Civic and administrative processes are often fragmented across departments, portals, legal documents, and procedural guidelines.

For a citizen, the difficulty is rarely limited to finding information. The harder questions are:

- What exactly is my issue?
- What rights or protections may apply?
- Which authority is responsible?
- What should I do first?
- What documents do I need?
- What is the expected timeline?
- What should I do if there is no response?

eSahay addresses this gap by transforming an unstructured citizen complaint into a structured case.

The platform combines:

- Natural-language case intake
- AI-assisted case analysis
- Rights and legal-reference mapping
- Authority identification
- Action planning
- Document generation
- Case tracking
- Multilingual accessibility

The objective is not to replace legal professionals or government systems.

The objective is to make the path from **problem → understanding → action** significantly clearer.

---

# 2. Problem

Citizens encounter a wide range of administrative and legal problems, including:

- Electricity and utility disputes
- Consumer complaints
- RTI-related matters
- Tenant and housing disputes
- Government notices
- Administrative grievances
- Procedural and documentation issues

Existing information is often available but difficult to use because it is:

- Distributed across multiple sources
- Written in technical or legal language
- Difficult to interpret without domain knowledge
- Unclear about the correct authority or next step
- Focused on information rather than execution

This creates a gap between **knowing that a problem exists** and **knowing how to act on it**.

---

# 3. Solution

eSahay converts a citizen's problem into a structured case workflow.

```text
Citizen describes the problem
            |
            v
       Smart Intake
            |
            v
       AI Analysis
            |
            v
     Case Understanding
            |
     +------+------+
     |      |      |
     v      v      v
   Rights  Authority  Case Details
     |      |      |
     +------+------+
            |
            v
       Action Plan
            |
            v
     Document Generation
            |
            v
       Case Tracking


The system is designed around one principle:
Information is useful only when it helps a citizen take the next correct action.


4. Core Capabilities


4.1 Smart Intake

Users can describe their problem in natural language instead of starting with a complex form.

The system uses the provided information to identify the relevant details required to build a case.



4.2 AI-Assisted Case Understanding

The platform analyzes the citizen's input and extracts structured information such as:

Case title
Category
Citizen name
Case number
Notice date
Key issue

The extracted information can be reviewed before being used further in the workflow.



4.3 Rights and Legal References

The system identifies potentially applicable rights and associated legal references.

Each result can contain:

Field	Description
Right	Relevant citizen right or protection
Law Source	Associated law or section
Citation Summary	Short explanation of the reference

The objective is to make legal information easier to understand without removing its underlying reference.



4.4 Authority Identification

A major challenge after understanding a problem is determining where to take it.

eSahay maps the case to a potentially relevant authority and provides:

Department
Office address
Submission mode
Expected timeline



4.5 Action Planning and Tracking

Instead of stopping at recommendations, eSahay converts the analysis into actionable steps.

Example:

1. Prepare representation
        |
2. Submit complaint
        |
3. Wait for response
        |
4. Escalate / appeal if required

The case can then be tracked through its lifecycle.



4.6 AI-Assisted Document Generation

Based on the structured case information, eSahay can generate editable drafts for relevant administrative documents.

Potential use cases include:

Complaints
Applications
Representations
RTI-related drafts
Authority submissions

The generated output is intended as a starting point and remains reviewable by the citizen.



4.7 Language and Accessibility

The platform is designed with multilingual and voice-based interaction in mind.

The long-term objective is to reduce the language and usability barriers that prevent citizens from accessing administrative information.



5. End-to-End Workflow

+----------------------+
|      Citizen         |
+----------+-----------+
           |
           v
+----------------------+
|    Smart Intake      |
+----------+-----------+
           |
           v
+----------------------+
|    AI Case Analysis  |
+----------+-----------+
           |
           v
+----------------------+
| Structured Case      |
| Information          |
+----------+-----------+
           |
     +-----+-----+
     |     |     |
     v     v     v
  Rights Authority Details
     |     |     |
     +-----+-----+
           |
           v
+----------------------+
|    Action Plan       |
+----------+-----------+
           |
           v
+----------------------+
| Document Generation  |
+----------+-----------+
           |
           v
+----------------------+
|    Case Tracking     |
+----------------------+




6. System Architecture


                         CLIENT
              +-------------------------+
              | React + Vite             |
              | React Router             |
              | Axios                    |
              | Lucide React             |
              | GSAP / ScrollTrigger     |
              +------------+-------------+
                           |
                           | REST API
                           |
                           v
              +-------------------------+
              |       EXPRESS API       |
              |                         |
              | Authentication          |
              | Case Management          |
              | AI Processing            |
              | Protected Routes         |
              +------------+-------------+
                           |
                 +---------+---------+
                 |                   |
                 v                   v
        +----------------+   +----------------+
        |    MongoDB     |   |  Gemini API    |
        |    Mongoose    |   |      AI        |
        +----------------+   +----------------+


7. Technology Stack

## Frontend

Technology	Purpose
React	Component-based UI
Vite	Frontend development and build tooling
React Router	Client-side routing
Axios	API communication
Lucide React	Interface icons
GSAP	Advanced UI animation
ScrollTrigger	Scroll-based interactions
CSS	Styling and responsive layouts

## Backend

Technology	Purpose
Node.js	Server-side runtime
Express.js	REST API framework
MongoDB	Database
Mongoose	MongoDB ODM
JWT	Authentication
bcryptjs	Password hashing
CORS	Cross-origin requests
dotenv	Environment configuration
AI Layer
Technology	Purpose
Google Gemini API	AI-assisted case analysis
@google/generative-ai	Gemini API integration


8. Project Structure

eSahay/
|
├── client/
|   |
|   ├── public/
|   |
|   ├── src/
|   |   ├── assets/
|   |   |
|   |   ├── components/
|   |   |   ├── common/
|   |   |   ├── layout/
|   |   |   ├── case/
|   |   |   └── dashboard/
|   |   |
|   |   ├── context/
|   |   ├── hooks/
|   |   ├── layouts/
|   |   |
|   |   ├── pages/
|   |   |   ├── auth/
|   |   |   ├── case/
|   |   |   └── dashboard/
|   |   |
|   |   ├── services/
|   |   ├── utils/
|   |   |
|   |   ├── App.jsx
|   |   ├── index.css
|   |   └── main.jsx
|   |
|   ├── package.json
|   └── vite.config.js
|
├── server/
|   |
|   ├── config/
|   |   └── db.js
|   |
|   ├── controllers/
|   |   ├── aiController.js
|   |   ├── authController.js
|   |   └── caseController.js
|   |
|   ├── middleware/
|   |   └── authMiddleware.js
|   |
|   ├── models/
|   |   ├── User.js
|   |   └── Case.js
|   |
|   ├── routes/
|   |   ├── aiRoutes.js
|   |   ├── authRoutes.js
|   |   └── caseRoutes.js
|   |
|   ├── server.js
|   └── package.json
|
└── README.md


9. Getting Started

Prerequisites::
Make sure the following are installed:

Node.js
npm
MongoDB or MongoDB Atlas
Git
Clone the Repository
git clone <REPOSITORY_URL>
cd eSahay
Backend Setup
cd server
npm install

Create a .env file inside the server directory:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key

Start the backend:

npm run dev

The backend runs on:

http://localhost:5000

Health endpoint:

GET /api/health
Frontend Setup

Open another terminal:

cd client
npm install
npm run dev

The Vite development server will normally run on:

http://localhost:5173


10. Environment Configuration

Sensitive credentials must never be committed to the repository.

Required backend environment variables:

PORT=5000
MONGO_URI=
JWT_SECRET=
GEMINI_API_KEY=

The repository's .gitignore excludes environment files and other sensitive configuration.


11. API Overview
Authentication
Method	Endpoint	Description
POST	/api/auth/register	Register a citizen
POST	/api/auth/login	Authenticate a citizen
GET	/api/auth/profile	Retrieve authenticated profile

Protected requests require:

Authorization: Bearer <JWT_TOKEN>
AI Analysis
Method	Endpoint	Description
POST	/api/ai/analyze	Analyze a citizen's issue

The analysis is structured around:

{
  "title": "",
  "category": "",
  "extractedDetails": {},
  "applicableRights": [],
  "designatedAuthority": {},
  "actionSteps": [],
  "draftDocument": ""
}
Cases
Method	Endpoint	Description
POST	/api/cases	Create a case
GET	/api/cases	Retrieve user cases
GET	/api/cases/:id	Retrieve a specific case
PATCH	/api/cases/:id/status	Update case status



12. Data Model
User
User
├── name
├── email
├── password
├── preferredLanguage
└── createdAt

Passwords are hashed using bcrypt before storage.

Case
Case
├── user
├── title
├── category
├── extractedDetails
│   ├── name
│   ├── caseNumber
│   ├── noticeDate
│   └── keyIssue
│
├── applicableRights[]
│   ├── right
│   ├── lawSource
│   └── citationSummary
│
├── designatedAuthority
│   ├── department
│   ├── officeAddress
│   ├── submissionMode
│   └── timelineDays
│
├── actionSteps[]
├── draftDocument
├── isResolved
└── createdAt



13. Authentication Architecture

eSahay uses JWT-based authentication.

Register / Login
       |
       v
Validate Credentials
       |
       v
Generate JWT
       |
       v
Client Receives Token
       |
       v
Protected API Request
       |
       v
Authentication Middleware
       |
       v
Verify Token
       |
       v
Access Protected Resource

Passwords are never stored in plain text.



14. Frontend Architecture

The React application is organized around reusable components, page-level views, shared layouts, API services, and application state.

src/
|
├── components/
|   ├── common/
|   ├── layout/
|   ├── case/
|   └── dashboard/
|
├── pages/
|   ├── auth/
|   ├── case/
|   └── dashboard/
|
├── layouts/
├── services/
├── context/
├── hooks/
└── utils/
Design principle

UI components should remain independent from API implementation wherever possible.

API communication is handled through the services layer, while reusable application state can be managed through context and custom hooks.



15. User Journey

Landing Page
      |
      v
Register / Login
      |
      v
Dashboard
      |
      v
Create New Case
      |
      v
Describe Problem
      |
      v
AI Analysis
      |
      v
Review Case
      |
      v
Rights & Legal References
      |
      v
Authority Identification
      |
      v
Action Plan
      |
      v
Document Generation
      |
      v
Case Tracking
      |
      v
Resolution


16. UI Direction

eSahay is being developed as a modern civic-tech product rather than a conventional government portal.

The interface focuses on:

Strong information hierarchy
Clear and accessible language
Responsive design
Meaningful interaction
Data-driven UI states
Progressive disclosure
Purposeful motion
Consistent component design

Animations are used to communicate transitions and system states rather than being added purely for visual effects.

The intended interaction model follows:

Problem
   |
   v
Understand
   |
   v
Know Your Rights
   |
   v
Find Authority
   |
   v
Take Action
   |
   v
Track Resolution



17. Development Roadmap

Phase 1 — Foundation
 Repository setup
 Backend architecture
 MongoDB integration
 Authentication APIs
 AI analysis API
 Case APIs
 React + Vite setup
 Frontend folder architecture

Phase 2 — Frontend
 Initial landing page prototype
 Final landing page
 Design system
 Authentication interface
 Dashboard
 Smart Intake
 AI Case Summary
 Rights & Law interface
 Authority Router
 Action Tracker
 Document Generator
 Case Tracking

Phase 3 — Integration
 Authentication integration
 AI analysis integration
 Case creation
 Case retrieval
 Case status updates
 Loading states
 Error handling
 Empty states

Phase 4 — Product Polish
 Multilingual interface
 Voice input
 Responsive optimization
 Accessibility improvements
 Advanced interaction design
 Performance optimization
 Production deployment



18. Git Workflow

The project follows a feature-branch workflow.

main
 |
 +-- vedant
 |     |
 |     +-- Backend development
 |
 +-- vanshika
       |
       +-- Frontend development

Before starting work:

git fetch origin
git merge origin/main

After completing a feature:

git add .
git commit -m "feat: describe your change"
git push origin <your-branch>

Feature branches are reviewed and merged into main through Pull Requests.



19. Development Principles
Build Against Real APIs

Frontend functionality should integrate with the existing backend contracts wherever possible.

Keep the Architecture Modular

Components, services, state, and page-level logic should remain separated to keep the codebase maintainable.

Avoid Hardcoded Secrets

Never commit:

.env
API keys
JWT secrets
Database credentials
Keep AI Output Reviewable

AI-generated information should be presented as assisted information. Users should be able to review generated content before taking consequential action.

Design for Real Users

The product should remain understandable even for users with limited technical or legal knowledge.



20. Future Scope

The platform can be extended with:

Support for additional Indian languages
Advanced voice interaction
Document OCR and extraction
Government portal integrations
Real-time case status updates
Location-aware authority discovery
Notifications and deadline reminders
Legal document comparison
Personalized case history
Verified legal knowledge sources
Human expert escalation
Mobile applications
Offline and low-connectivity support



21. Disclaimer

eSahay is a civic assistance and information platform.

AI-generated information should not be considered a substitute for professional legal advice.

For consequential legal or administrative decisions, users should verify applicable laws, deadlines, procedures, and official information through authoritative sources or qualified professionals.



22. Team
eSahay — OOSC Project

A collaborative project focused on making civic and administrative processes easier to understand, navigate, and act upon.



23. Vision

A citizen should not need to be a lawyer, bureaucrat, or technology expert to understand what they can do next.

eSahay aims to reduce the gap between having a problem and knowing how to act on it.

Technology

React · Vite · Node.js · Express · MongoDB · Mongoose · Gemini AI · JWT · GSAP
