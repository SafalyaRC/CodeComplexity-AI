<p align="center"> <img src="app/favicon.ico" width="150" height="150" alt="CodeComplexity AI logo" /> </p> 
<h1 align="center" style="color: #ffffff">CodeComplexity AI</h1>

<p align="center"> <b>Understand Time & Space Complexity</b><br/> <i>From code to Big-O — clearly, correctly, and interview-ready.</i> </p> 

<p align="center"> 
  <a href="https://code-complexity-ai-five.vercel.app/"> 
    <img alt="Live Site" src="https://img.shields.io/badge/Live-Demo-000000?style=flat-square&logo=vercel&logoColor=white"> 
  </a> 
  <a href="https://github.com/SafalyaRC/CodeComplexity-AI/stargazers"> 
    <img alt="Stars" src="https://img.shields.io/github/stars/SafalyaRC/CodeComplexity-AI?color=blue&style=flat-square"> 
  </a> 
  <img alt="Maintained" src="https://img.shields.io/badge/Maintained-Yes-44cc11?style=flat-square"> 
  <img alt="License" src="https://img.shields.io/github/license/SafalyaRC/CodeComplexity-AI?style=flat-square&color=orange"> 
</p>

---

# 🧠 Overview

CodeComplexity AI is an AI-powered web application designed to help developers and students understand and explain time and space complexity of code snippets in a clear, interview-ready manner. Unlike traditional tools that rely on heuristics or hardcoded rules, CodeComplexity AI uses LLM-based reasoning with strict validation. If complexity cannot be inferred reliably, the system refuses to answer instead of hallucinating. This makes it especially useful for- DSA & coding interview preparation, reviewing LeetCode / GFG solutions and learning how to explain Big-O confidently.

---

# 🔮 Core Features (Technical Breakdown)

### 🤖 AI-Driven Code Complexity Analysis

- Server-side complexity analysis powered by Google Gemini
- Accepts user-submitted code snippets with explicit language selection
- Produces deterministic, interview-ready output including:
- Time Complexity (Big-O)
- Space Complexity (Big-O)
- Structured natural-language explanation
- Optimization insights and trade-off discussion
- Enforces a strict JSON response contract to prevent malformed or hallucinated outputs
- If required information (input size, constraints, or structure) is missing, the system refuses to analyze instead of guessing
- Design choice: correctness and trustworthiness are prioritized over always returning an answer


### 🧠 Explanation Engine (Interview-Oriented)

- Explanations are generated as single plain-text strings (no nested objects)
- Optimized for:
    * Whiteboard interviews
    * Verbal explanation clarity
    * Concise yet complete reasoning
- Complex algorithms (e.g., divide-and-conquer, recursion, amortized analysis) are explained using:
    * High-level intuition
    * Cost per operation
    * Aggregated Big-O derivation
- Optimizations are clearly marked as:
    * Already optimal (with justification)
    * Actionable improvements (time vs space trade-offs)


### 🧑‍💻 Code Editor & Analysis Workflow

- Integrated Monaco Editor (VS Code–like experience)
- Language-aware editor with:
- Syntax highlighting
- Line numbers
- Adjustable font size
- Workflow: _User pastes code → Selects programming language → Submits for analysis → Receives validated AI response_
- Utilities include:
   * Copy code
   * Clear editor
   * Toggle line numbers
   * Analysis requests are authenticated and tracked per user


### 🔐 Authentication & Access Control

- Authentication is mandatory to access analysis features
- Implemented using Supabase Auth
- Email/password login
- Google OAuth
- Secure server-side session handling
- Prevents anonymous usage to:
    * Protect AI quota
    * Enable user-specific history
    * Maintain accountability and rate control


### 📊 Analysis History & Dashboard

- Each authenticated user has a personal dashboard which stores:
    * Submitted code
    * Language
    * Time & space complexity results
- Explanations enables users to:
    * Revisit previous analyses
    * Track learning progress over time
- Backed by Supabase (PostgreSQL)


### 🎯 Interview Prep Section

- Dedicated Interview Prep page
- Uses a curated Blind 75–style problem set
- Data sourced from a static JSON file (no external APIs, no scraping)
- Each problem includes: Title, Difficulty, Topic classification & Direct redirect to LeetCode
- Progress tracking:
    * Solved
    * Not Solved
- Stored locally via localStorage
- Intentionally excludes:
    * Hosted solutions
    * Code editors
- AI answers → encourages solving on the original platform

---

# 🌍 Real-World Use Cases

📌 Coding Interview Preparation
- Analyze your LeetCode / GFG solutions
- Practice explaining complexity clearly and confidently
- Identify unnecessary overhead or suboptimal approaches

📌 Learning Data Structures & Algorithms
- Understand why a solution is O(n log n) instead of memorizing it
- Compare recursive vs iterative trade-offs
- Build intuition for space complexity beyond auxiliary arrays

📌 Self-Review & Skill Tracking
- Maintain a history of analyzed problems
- Track improvement in reasoning and optimization
- Use past analyses as a personal study reference

📌 Teaching & Peer Review
- Explain algorithmic complexity to peers
- Validate reasoning during mock interviews
- Use explanations as discussion starters

---

# 🛠️ Tech Stack

| Layer          | Technology                          | Purpose                                                     |
|----------------|--------------------------------------|-------------------------------------------------------------|
| Frontend       | Next.js (App Router)                 | Routing, server-side rendering, and API integration         |
| Frontend       | React + TypeScript                   | Component-based UI with static type safety                  |
| Styling        | Tailwind CSS                         | Utility-first styling with dark theme support               |
| Code Editor    | Monaco Editor                        | VS Code–like in-browser code editor                         |
| Backend        | Next.js API Routes                   | Serverless APIs for analysis and authentication             |
| AI Engine      | Google Gemini API                    | Reasoning-based time and space complexity analysis          |
| AI Safety      | Prompt Engineering + JSON Validation | Enforces deterministic, structured AI output                |
| Authentication | Supabase Auth                        | Email/password authentication and Google OAuth              |
| Database       | Supabase PostgreSQL                  | Persistent storage for user analysis history                |
| State          | LocalStorage                         | Tracks interview problem progress                           |
| Deployment     | Vercel                               | CI/CD and serverless production hosting                     |


---

# 📂 Project Structure

```
CodeComplexity-AI/
├── app/
│   ├── analyze/
│   │   └── page.tsx                 
│   │
│   ├── api/
│   │   ├── analyze/route.ts         
│   │   └── auth/
│   │       ├── callback/route.ts
│   │       ├── signin/route.ts
│   │       └── signout/route.ts
│   │
│   ├── auth/
│   │   ├── signin/page.tsx
│   │   └── signup/page.tsx
│   │
│   ├── components/
│   │   ├── AnalysisResult.tsx
│   │   ├── AnalyzeCTA.tsx
│   │   ├── CodeEditor.tsx
│   │   ├── Header.tsx
│   │   ├── HistoryCard.tsx
│   │   └── Providers.tsx
│   │
│   ├── dashboard/
│   │   └── page.tsx                 
│   │
│   ├── interview/
│   │   └── page.tsx                 
│   │
│   ├── lib/
│   │   ├── supabase.ts
│   │   └── types.ts
│   │
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── icon-192.png
│   └── favicon.ico
│
├── public/
│   ├── blind75.json
│   ├── blind75_txt_file.txt
│   └── static assets (svg/icons)
│
├── .env.local
├── package.json
└── README.md
```

---

# 🚀 Quick Start (Local Development)

```
# Clone the repository
git clone https://github.com/SafalyaRC/CodeComplexity-AI.git
cd CodeComplexity-AI

# Install dependencies
npm install

# Run the dev server
npm run dev
```
---

# 🔐 Environment Setup

> Create a .env.local file:
```
# AI Configuration
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

# 🔮 Future Enhancements

- Line-by-line complexity annotations
- Visual complexity growth graphs
- Side-by-side solution comparison
- Export analysis (PDF / Markdown)
- Practice problems with AI feedback

---

# ✨ Author

Safalya Roy Choudhury
  * 🧑‍💻 Full-Stack Developer | Final-Year CSE Undergraduate
  * 📫 [GitHub](https://github.com/SafalyaRC)
  * 🔗 [LinkedIn](https://www.linkedin.com/in/safalyarc)

---

# 💖 Support & Contribute

If you found this helpful:
```bash
⭐ Star the repo
🍴 Fork it
📢 Share it with devs & creators
```
---
