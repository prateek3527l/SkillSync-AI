/**
 * SkillSync AI - Database Seeder
 *
 * This script populates the database with demo data for showcasing the app.
 * WARNING: Running with --destroy flag will DELETE all existing data first.
 *
 * Usage:
 *   npm run seed           # Import demo data
 *   npm run seed:destroy   # Destroy all data
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

dotenv.config();

// Models
const User = require('./models/User');
const Project = require('./models/Project');
const InterviewSession = require('./models/InterviewSession');
const JobApplication = require('./models/JobApplication');
const Portfolio = require('./models/Portfolio');
const Settings = require('./models/Settings');

// ─── Demo Data ────────────────────────────────────────────────────────────────

const demoUser = {
  name: 'Alex Johnson',
  email: 'demo@skillsync.ai',
  password: 'demo@1234',
  bio: 'Passionate full-stack developer with expertise in React and Node.js. I love building products that help people grow in their careers.',
  profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
};

const demoProjects = [
  {
    title: 'SkillSync AI',
    description: 'An AI-powered career assistant that helps developers track projects, practice mock interviews, and analyze resumes. Built with React, Node.js, and Google Gemini.',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Gemini AI', 'Tailwind CSS'],
    githubUrl: 'https://github.com/alexjohnson/skillsync-ai',
    liveDemoUrl: 'https://skillsync-ai.vercel.app',
    status: 'In Progress',
    category: 'Full Stack',
    featured: true,
    startDate: new Date('2024-01-01'),
  },
  {
    title: 'DevHub – Coder Community',
    description: 'A social platform for developers to share projects, ask questions, and collaborate on open source. Features real-time notifications and AI code review.',
    technologies: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Socket.io'],
    githubUrl: 'https://github.com/alexjohnson/devhub',
    status: 'Completed',
    category: 'Web Development',
    featured: true,
    startDate: new Date('2023-06-01'),
    endDate: new Date('2023-12-01'),
  },
  {
    title: 'TrackIt – Expense Manager',
    description: 'A mobile-first personal finance tracker with budget alerts, spending categories, and monthly insights visualized through beautiful charts.',
    technologies: ['React Native', 'Expo', 'Firebase', 'Victory Charts'],
    githubUrl: 'https://github.com/alexjohnson/trackit',
    status: 'Completed',
    category: 'Mobile App',
    featured: false,
    startDate: new Date('2023-01-01'),
    endDate: new Date('2023-04-01'),
  },
  {
    title: 'OpenSource CLI Tools',
    description: 'A collection of productivity CLI tools for developers including a project scaffolder, git workflow helper, and automated changelog generator.',
    technologies: ['Node.js', 'Commander.js', 'Inquirer', 'Chalk'],
    githubUrl: 'https://github.com/alexjohnson/cli-tools',
    status: 'In Progress',
    category: 'Open Source',
    featured: false,
    startDate: new Date('2024-03-01'),
  },
];

const demoInterviews = [
  {
    type: 'Technical Interview',
    difficulty: 'Intermediate',
    targetRole: 'Full Stack Developer',
    status: 'completed',
    questions: [
      {
        question: 'Explain the difference between REST and GraphQL APIs.',
        userAnswer: 'REST uses multiple endpoints while GraphQL uses a single endpoint and allows clients to specify exactly what data they need.',
        evaluation: { score: 85, feedback: 'Good explanation. Could mention REST\'s statelessness and GraphQL\'s schema-first approach.', technicalAccuracy: 80, communicationClarity: 90 }
      }
    ],
    overallScore: 85,
    technicalScore: 82,
    communicationScore: 88,
    overallFeedback: 'Strong performance! Clear communication and solid technical knowledge. Focus on system design patterns to get to the next level.'
  },
  {
    type: 'Behavioral Interview',
    difficulty: 'Beginner',
    targetRole: 'Software Engineer Intern',
    status: 'completed',
    questions: [
      {
        question: 'Tell me about a time you handled a challenging project deadline.',
        userAnswer: 'In my capstone project, we had 2 weeks to build a full-stack app. I broke the work into daily sprints and prioritized the core features first.',
        evaluation: { score: 90, feedback: 'Excellent use of STAR method. Very clear and concise.', technicalAccuracy: 85, communicationClarity: 95 }
      }
    ],
    overallScore: 90,
    technicalScore: 85,
    communicationScore: 95,
    overallFeedback: 'Excellent behavioral answers. Natural storytelling and good use of examples. Keep it up!'
  }
];

const demoJobs = [
  {
    companyName: 'Google',
    jobTitle: 'Software Engineer Intern',
    jobType: 'Internship',
    employmentType: 'Full Time',
    location: 'Mountain View, CA',
    workMode: 'Hybrid',
    applicationStatus: 'Interview',
    currentStage: 'Technical Round',
    priority: 'High',
    applicationDate: new Date('2024-01-15'),
    source: 'LinkedIn',
  },
  {
    companyName: 'Vercel',
    jobTitle: 'Frontend Engineer',
    jobType: 'Full Time',
    employmentType: 'Full Time',
    location: 'Remote',
    workMode: 'Remote',
    applicationStatus: 'Applied',
    currentStage: 'Applied',
    priority: 'High',
    applicationDate: new Date('2024-02-01'),
    source: 'Company Website',
    jobUrl: 'https://vercel.com/careers',
  },
  {
    companyName: 'Stripe',
    jobTitle: 'Backend Engineer',
    jobType: 'Full Time',
    employmentType: 'Full Time',
    location: 'San Francisco, CA',
    workMode: 'On-site',
    applicationStatus: 'Rejected',
    currentStage: 'Rejected',
    priority: 'Medium',
    applicationDate: new Date('2024-01-20'),
    source: 'Referral',
  },
  {
    companyName: 'Linear',
    jobTitle: 'Full Stack Developer',
    jobType: 'Full Time',
    employmentType: 'Full Time',
    location: 'Remote',
    workMode: 'Remote',
    applicationStatus: 'Offer',
    currentStage: 'Offer Received',
    priority: 'High',
    applicationDate: new Date('2024-01-10'),
    source: 'LinkedIn',
  },
];

const demoPorfolio = {
  username: 'alexjohnson',
  headline: 'Full Stack Developer | React · Node.js · AI',
  location: 'Bangalore, India',
  experienceYears: 2,
  availabilityStatus: 'Open to Opportunities',
  about: {
    education: 'B.Tech in Computer Science, IIT Bombay, 2022',
    experience: '2 years building full-stack web apps, contributed to open source, and leading a dev team of 4.',
    careerGoals: 'Aiming to join a product-driven company where I can build scalable systems and grow as an engineer.',
  },
  skills: {
    frontend: ['React', 'Next.js', 'Tailwind CSS', 'TypeScript'],
    backend: ['Node.js', 'Express', 'REST APIs', 'GraphQL'],
    database: ['MongoDB', 'PostgreSQL', 'Redis'],
    tools: ['Git', 'Docker', 'Figma', 'Linux'],
    softSkills: ['Communication', 'Team Leadership', 'Problem Solving'],
  },
  codingProfiles: {
    github: 'https://github.com/alexjohnson',
    leetcode: 'alexjohnson',
  },
  contact: {
    emailEnabled: true,
    linkedin: 'https://linkedin.com/in/alexjohnson',
    website: 'https://alexjohnson.dev',
  },
  preferences: {
    isPublic: true,
    theme: 'system',
    accentColor: 'indigo',
    layoutStyle: 'modern',
    visibleSections: {
      about: true, skills: true, projects: true, achievements: true, codingProfiles: true, resume: false
    }
  }
};

// ─── Import & Destroy Functions ───────────────────────────────────────────────

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('📦 MongoDB connected for seeding...');

    // Create demo user (password hashed by mongoose pre-save hook)
    const user = await User.create(demoUser);
    console.log('👤 Demo user created: demo@skillsync.ai / demo@1234');

    // Create projects
    const projectsWithUser = demoProjects.map(p => ({ ...p, createdBy: user._id }));
    await Project.insertMany(projectsWithUser);
    console.log(`🚀 ${demoProjects.length} sample projects created`);

    // Create interviews
    const interviewsWithUser = demoInterviews.map(i => ({ ...i, userId: user._id }));
    await InterviewSession.insertMany(interviewsWithUser);
    console.log(`🎤 ${demoInterviews.length} sample mock interviews created`);

    // Create job applications
    const jobsWithUser = demoJobs.map(j => ({ ...j, createdBy: user._id }));
    await JobApplication.insertMany(jobsWithUser);
    console.log(`💼 ${demoJobs.length} sample job applications created`);

    // Create portfolio
    await Portfolio.create({ ...demoPorfolio, userId: user._id });
    console.log('🌐 Demo portfolio created (username: alexjohnson)');

    // Create settings
    await Settings.create({ userId: user._id });
    console.log('⚙️  Default settings created');

    console.log('\n✅ Demo data seeded successfully!');
    console.log('─────────────────────────────────────');
    console.log('🔑 Demo Login:');
    console.log('   Email:    demo@skillsync.ai');
    console.log('   Password: demo@1234');
    console.log('─────────────────────────────────────');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('⚠️  Destroying all data...');

    await Promise.all([
      User.deleteMany({}),
      Project.deleteMany({}),
      InterviewSession.deleteMany({}),
      JobApplication.deleteMany({}),
      Portfolio.deleteMany({}),
      Settings.deleteMany({}),
    ]);

    console.log('🗑️  All data destroyed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Destroy failed:', error.message);
    process.exit(1);
  }
};

// ─── CLI Entry ────────────────────────────────────────────────────────────────
if (process.argv[2] === '--destroy') {
  destroyData();
} else {
  importData();
}
