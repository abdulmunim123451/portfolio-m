// ============================================================
// portfolioData.js — Centralized configuration for Abdul Munim's Portfolio
// All external links, personal info, and content in one place.
// Update this file to change any content across the entire site.
// ============================================================

export const personalInfo = {
  name: "Abdul Munim",
  firstName: "Abdul Munim",
  brandName: "Abdul Munim",
  title: "Full Stack & Java Developer",
  location: "Bhopal, India",
  phone: "+91 99396-08743",
  emails: {
    primary: "abdulmunim1234512345@gmail.com",
    secondary: "abdulmunim1234512345@gmail.com",
  },
  summary:
    "Aspiring software engineer and motivated Computer Science student with solid skills in C, C++, Java, Spring Boot, React, and Python. Passionate about building scalable full-stack applications with clean architecture and modern tech stacks.",
  resumeUrl: "/Md_Yusuf_Resume_2026.pdf",
};

export const socialLinks = {
  instagram: "https://instagram.com/its_abdulmunim_",
};

export const heroContent = {
  greeting: "Hi, I'm Abdul Munim",
  titleHighlight: "Full Stack & Java Developer",
  subtitle:
    "I build fast, scalable applications using Java, Spring Boot, MERN Stack, and Python.",
  ctaPrimary: { text: "View My Work", href: "#projects" },
  ctaSecondary: {
    text: "Contact Me",
    href: "mailto:abdulmunim1234512345@gmail.com?subject=Hiring Inquiry – Portfolio&body=Hello Abdul Munim,%0D%0A%0D%0AI came across your portfolio and would like to discuss an opportunity with you.%0D%0A%0D%0ALooking forward to hearing from you.%0D%0ABest Regards,",
  },
  ctaResume: { text: "Download Resume", href: "/Md_Yusuf_Resume_2026.pdf" },
};

export const aboutContent = {
  heading: "Hello!",
  bio: `Hi, my name is <span class="text-black text-xl font-black mx-1 tracking-wide uppercase">Abdul Munim</span>, an aspiring software engineer based in Bhopal, India, dedicated to crafting clean, functional, and highly scalable full-stack applications.`,
  techStack: ["Java", "Spring Boot", "React", "TypeScript", "MySQL", "MongoDB"],
};

export const skillsContent = {
  badge: "My Process",
  heading: "Here's how I turn ideas into real-world applications",
  description:
    "I follow a structured, creative, and highly technical approach to turn ideas into robust full-stack applications.",
  cards: [
    {
      number: "01",
      title: "Research",
      text: "I start by understanding goals, user requirements, and technical constraints to lay a rock-solid foundation for the project.",
    },
    {
      number: "02",
      title: "Design",
      text: "Crafting clean architecture, intuitive interfaces, and pixel-perfect wireframes that guarantee an engaging and accessible user experience.",
    },
    {
      number: "03",
      title: "Develop",
      text: "Building scalable backends and responsive frontends using modern tech stacks and best practices.",
    },
    {
      number: "04",
      title: "Deploy",
      text: "Rigorous testing, performance optimization, and seamless deployment to cloud infrastructure, followed by ongoing support.",
    },
  ],
  endText: "Ready to ship!",
};

// Brand New Technical Skills Data
export const technicalSkills = {
  categories: [
    {
      title: "Programming Languages",
      skills: [
        { name: "Java", level: 90 },
        { name: "C++", level: 85 },
        { name: "Python", level: 75 }
      ]
    },
    {
      title: "Full Stack",
      skills: [
        { name: "MERN Stack", level: 90 },
        { name: "HTML", level: 95 },
        { name: "CSS", level: 90 },
        { name: "JavaScript", level: 92 }
      ]
    },
    {
      title: "Backend",
      skills: [
        { name: "Spring Boot", level: 88 },
        { name: "FastAPI", level: 75 },
        { name: "REST APIs", level: 90 }
      ]
    },
    {
      title: "Databases",
      skills: [
        { name: "MongoDB", level: 88 },
        { name: "MySQL", level: 85 },
        { name: "Firebase", level: 80 }
      ]
    },
    {
      title: "Tools & Automation",
      skills: [
        { name: "Git", level: 90 },
        { name: "VS Code", level: 95 },
        { name: "Postman", level: 88 },
        { name: "n8n", level: 82 },
        { name: "MongoDB Compass", level: 85 },
        { name: "Antigravity", level: 80 },
        { name: "Codex", level: 75 }
      ]
    },
    {
      title: "Computer Science Concepts",
      skills: [
        { name: "Data Structures", level: 88 },
        { name: "Algorithms", level: 85 },
        { name: "DBMS", level: 86 },
        { name: "OOP", level: 90 },
        { name: "Software Engineering", level: 84 }
      ]
    }
  ]
};

// Brand New Content Creation Data
export const contentCreation = {
  badge: "Cinematic Content",
  heading: "Creative Direction & Cinematic Edits",
  description: "Beyond coding, I craft visual stories with premium editing, color grading, and creative pacing.",
  categories: [
    {
      title: "Cinematic Reels",
      description: "Visual stories crafted with cinematic lighting, premium color grading, and high-impact sound design.",
      stats: "50+ Reels Created",
      icon: "🎥"
    },
    {
      title: "Travel Videos",
      description: "Immersive travel vlogs and aesthetic edits capturing cultures, landscapes, and visual rhythms.",
      stats: "15+ Countries/Cities",
      icon: "✈️"
    },
    {
      title: "Educational Reels",
      description: "Fast-paced tech tutorials and educational content designed to simplify coding and software engineering.",
      stats: "100k+ Views",
      icon: "🧠"
    },
    {
      title: "My Own Creative Edits",
      description: "Experimental transitions, 3D overlays, and trendsetting visual effects that push creative bounds.",
      stats: "Personal Projects",
      icon: "⚡"
    }
  ]
};

// Brand New Leadership Data
export const leadershipList = [
  {
    title: "IEEE Madhya Pradesh Section (Social Media Team)",
    description: "Managed and coordinated digital content, driving audience engagement and designing interactive visual campaigns for tech events.",
    role: "Social Media Coordinator",
    badge: "Volunteer"
  },
  {
    title: "Team Coordinator – Go-Kart International Racing 2K25",
    description: "Led multi-disciplinary teams in project management, budget control, and logistics coordination for a high-profile international racing event.",
    role: "Team Coordinator",
    badge: "Leadership"
  },
  {
    title: "5-Day MOE IDE Bootcamp, Roorkee",
    description: "Participated in an intensive Innovation, Design, and Entrepreneurship Bootcamp organized by the Ministry of Education at IIT Roorkee.",
    role: "Bootcamp Graduate",
    badge: "Innovation"
  },
  {
    title: "Hosted INFORIA Tech Summit Hackathon",
    description: "Organized and hosted the flagship hackathon, managing registrations, mentoring participant teams, and coordinating judge evaluations.",
    role: "Hackathon Organizer",
    badge: "Co-Curricular"
  },
  {
    title: "Event Coordinator & Anchoring – INFORIA 2K25",
    description: "Coordinated technical events and served as the main stage anchor, speaking in front of large crowds and managing the summit flow.",
    role: "Stage Anchor & Coordinator",
    badge: "Public Speaking"
  },
  {
    title: "Pool Handball Tournament",
    description: "Demonstrated athletic leadership, team coordination, and strategic agility, winning 1st place in the university championship.",
    role: "Tournament Winner",
    badge: "Winner"
  }
];

// Brand New Internships Data
export const internshipsList = [
  {
    organization: "Netlink, Bhopal",
    role: "Data Analytics & BI Tools Intern",
    duration: "June 2025 - August 2025",
    skills: ["Data Analytics", "Business Intelligence", "Dashboard Design", "Data Modeling"],
    tech: ["Lumenore", "MySQL", "Excel", "BI Tools"]
  },
  {
    organization: "Canva",
    role: "Visual Content Creator & Designer",
    duration: "May 2024 - June 2024",
    skills: ["Visual Designing", "Poster Design", "Team Branding", "Asset Creation"],
    tech: ["Canva Pro", "Figma", "Canva Design Suite"]
  },
  {
    organization: "CollegeTips.in",
    role: "Web Development Intern",
    duration: "1 Month (Offline)",
    skills: ["Frontend Development", "Responsive Layouts", "API Testing", "Web Performance"],
    tech: ["HTML5", "CSS3", "JavaScript", "Bootstrap"]
  }
];

// Brand New Soft Skills Data
export const softSkillsList = [
  { name: "Leadership", icon: "👑", desc: "Guiding teams, managing tasks, and driving project completion with shared vision." },
  { name: "Public Speaking", icon: "🎤", desc: "Confident stage presence, anchoring summits, and delivering articulate technical ideas." },
  { name: "Team Collaboration", icon: "🤝", desc: "Collaborating across fields, building racing carts, and engineering code in sync." },
  { name: "Communication", icon: "💬", desc: "Clear, concise, and structured interactions in both business and technical contexts." },
  { name: "Problem Solving", icon: "🧩", desc: "Breaking down complex engineering tasks into clean, logical, and modular pieces." },
  { name: "Adaptability", icon: "🌟", desc: "Quick to pick up new frameworks like FastAPI, Spring Boot, or automation tools like n8n." },
  { name: "Creativity", icon: "🎨", desc: "Blending cinematic aesthetics with software structure to build premium experiences." },
  { name: "Time Management", icon: "⏰", desc: "Balancing studies, event hosting, and developing robust software platforms." }
];

export const projects = [
  {
    id: "digital-journaling",
    number: "01",
    badge: "🚀 Flagship Project",
    title: "Full-Stack Digital Journaling Platform",
    description:
      "A full-stack, responsive digital journaling application built with React and TypeScript, powered by a robust Java Spring Boot REST API and relational database. Features secure authentication, clean architecture, responsive layout, and seamless entry management.",
    techTags: [
      "Java",
      "Spring Boot",
      "React",
      "TypeScript",
      "REST API",
      "MySQL",
      "Tailwind CSS",
    ],
    links: {
      demo: null,
    },
    isFlagship: true,
  },
  {
    id: "karigar",
    number: "02",
    badge: null,
    title: "Karigar",
    description:
      "A platform connecting local skilled workers with customers, featuring real-time search, worker profiles, and booking management with full database integration.",
    techTags: ["React", "Node.js", "MongoDB", "Express", "REST API"],
    links: {
      frontendDemo: "https://karigar-frontend.onrender.com",
      backendApi: "https://karigar-zny2.onrender.com",
    },
    isFlagship: false,
  },
  {
    id: "sentiment-analysis",
    number: "03",
    badge: null,
    title: "AI-Powered Sentiment Analysis",
    description:
      "A full-stack web application that analyzes citizen feedback using Artificial Intelligence to classify sentiments as positive, negative, or neutral. Features a responsive React frontend, a Node.js backend, MongoDB for data storage, and n8n automation for workflow orchestration — enabling real-time insights and efficient feedback management.",
    techTags: ["React", "Node.js", "MongoDB", "n8n", "AI/ML", "REST API"],
    links: {},
    isFlagship: false,
  },
];

export const certificates = {
  featured: [
    {
      name: "Oracle Cloud Infrastructure 2025",
      issuer: "Oracle",
      icon: "☁️",
    },
    {
      name: "Programming in Java (94%)",
      issuer: "NPTEL",
      icon: "☕",
    },
    {
      name: "C Programming & Assembly Language",
      issuer: "NPTEL",
      icon: "⚙️",
    },
    {
      name: "Technology Job Simulation",
      issuer: "Deloitte",
      icon: "💼",
    },
    {
      name: "Career Edge – IT Primer",
      issuer: "TCS iON",
      icon: "🎓",
    },
    {
      name: "Fundamentals of BI & Analytics",
      issuer: "Lumenore",
      icon: "📊",
    },
  ],
  viewAllUrl:
    "https://drive.google.com/file/d/1ObdGWtVSx8SsfR4AcbCySSd9LFXcAs9f/view?usp=sharing",
};

export const education = {
  degree: "Student of Computer Science",
  institution: "SIDDEQ PUBLIC SCHOOL",
  cgpa: "86% (9th)",
  graduation: "",
  twelfth: "9th – 86%",
  tenth: "Currently in 10th",
};

export const footerContent = {
  taglines: [
    "Software Engineering & Web Dev",
    "Java · Spring Boot · React",
    "Full Stack Applications",
  ],
  credential: "Student of Computer Science · 9th 86%",
  copyright: `© ${new Date().getFullYear()} Abdul Munim | Built with React`,
};

// EmailJS Configuration
// Will read directly from environment variables in Vite (starting with VITE_)
export const emailjsConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || "YOUR_EMAILJS_SERVICE_ID",
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "YOUR_EMAILJS_TEMPLATE_ID",
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "YOUR_EMAILJS_PUBLIC_KEY",
};
