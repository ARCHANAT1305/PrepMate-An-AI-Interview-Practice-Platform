import { CreateAssistantDTO, CreateWorkflowDTO } from "@vapi-ai/web/dist/api";
import { z } from "zod";

export const mappings = {
  "react.js": "react",
  reactjs: "react",
  react: "react",
  "next.js": "nextjs",
  nextjs: "nextjs",
  next: "nextjs",
  "vue.js": "vuejs",
  vuejs: "vuejs",
  vue: "vuejs",
  "express.js": "express",
  expressjs: "express",
  express: "express",
  "node.js": "nodejs",
  nodejs: "nodejs",
  node: "nodejs",
  mongodb: "mongodb",
  mongo: "mongodb",
  mongoose: "mongoose",
  mysql: "mysql",
  postgresql: "postgresql",
  sqlite: "sqlite",
  firebase: "firebase",
  docker: "docker",
  kubernetes: "kubernetes",
  aws: "aws",
  azure: "azure",
  gcp: "gcp",
  digitalocean: "digitalocean",
  heroku: "heroku",
  photoshop: "photoshop",
  "adobe photoshop": "photoshop",
  html5: "html5",
  html: "html5",
  css3: "css3",
  css: "css3",
  sass: "sass",
  scss: "sass",
  less: "less",
  tailwindcss: "tailwindcss",
  tailwind: "tailwindcss",
  bootstrap: "bootstrap",
  jquery: "jquery",
  typescript: "typescript",
  ts: "typescript",
  javascript: "javascript",
  js: "javascript",
  "angular.js": "angular",
  angularjs: "angular",
  angular: "angular",
  "ember.js": "ember",
  emberjs: "ember",
  ember: "ember",
  "backbone.js": "backbone",
  backbonejs: "backbone",
  backbone: "backbone",
  nestjs: "nestjs",
  graphql: "graphql",
  "graph ql": "graphql",
  apollo: "apollo",
  webpack: "webpack",
  babel: "babel",
  "rollup.js": "rollup",
  rollupjs: "rollup",
  rollup: "rollup",
  "parcel.js": "parcel",
  parceljs: "parcel",
  npm: "npm",
  yarn: "yarn",
  git: "git",
  github: "github",
  gitlab: "gitlab",
  bitbucket: "bitbucket",
  figma: "figma",
  prisma: "prisma",
  redux: "redux",
  flux: "flux",
  redis: "redis",
  selenium: "selenium",
  cypress: "cypress",
  jest: "jest",
  mocha: "mocha",
  chai: "chai",
  karma: "karma",
  vuex: "vuex",
  "nuxt.js": "nuxt",
  nuxtjs: "nuxt",
  nuxt: "nuxt",
  strapi: "strapi",
  wordpress: "wordpress",
  contentful: "contentful",
  netlify: "netlify",
  vercel: "vercel",
  "aws amplify": "amplify",
};

export const interviewer: CreateAssistantDTO = {
  name: "Interviewer",
  firstMessage:
    "Hello! Thank you for taking the time to speak with me today. I'm excited to learn more about you and your experience. Are you ready to begin with the first question?",
  transcriber: {
    provider: "deepgram",
    model: "nova-2",
    language: "en",
  },
  voice: {
    provider: "11labs",
    voiceId: "sarah",
    stability: 0.4,
    similarityBoost: 0.8,
    speed: 0.9,
    style: 0.5,
    useSpeakerBoost: true,
  },
  model: {
    provider: "openai",
    model: "gpt-4-turbo",
    messages: [
      {
        role: "system",
        content: `You are a professional job interviewer conducting a real-time voice interview.
        
Your goal is to ask the following questions one by one:
{{questions}}

Instructions:
1. Start by greeting the candidate and asking if they are ready.
2. Ask one question at a time.
3. Wait for the candidate's response before moving to the next question.
4. Acknowledge their response briefly (e.g., "Great," "I see," "Interesting point") before asking the next question.
5. If they give a very short answer, you can ask a quick follow-up, but keep the interview moving.
6. Once all questions are asked, thank them for their time and end the call.

Keep your responses short and conversational, as this is a voice-based interview.`,
      },
    ],
  },
  clientMessages: ["transcript" as any],
  serverMessages: ["end-of-call-report" as any],
};

export const generator: CreateWorkflowDTO = {
  name: "Generate Interview",
  nodes: [
    {
      name: "start",
      type: "conversation" as any,
      isStart: true,
      metadata: { position: { x: 0, y: 0 } },
      prompt: "Speak first. Greet the user and help them create a new AI Interviewer",
      voice: { model: "aura-2", voiceId: "thalia", provider: "deepgram" },
      variableExtractionPlan: {
        output: [
          { title: "level", description: "The job experience level.", type: "string", enum: ["entry", "mid", "senior"] },
          { title: "amount", description: "How many questions would you like to generate?", type: "number", enum: [] },
          { title: "techstack", description: "Technologies to cover.", type: "string", enum: [] },
          { title: "role", description: "Target role (e.g. Frontend).", type: "string", enum: [] },
          { title: "type", description: "Interview type.", type: "string", enum: ["behavioural", "technical", "mixed"] },
        ],
      },
    } as any,
    {
      name: "apiRequest_1747470739045",
      type: "apiRequest",
      metadata: { position: { x: -16.07, y: 703.62 } },
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/vapi/generate`,
      body: {
        type: "object",
        properties: {
          role: { type: "string", value: "{{ role }}" },
          level: { type: "string", value: "{{ level }}" },
          type: { type: "string", value: "{{ type }}" },
          amount: { type: "number", value: "{{ amount }}" },
          userid: { type: "string", value: "{{ userid }}" },
          techstack: { type: "string", value: "{{ techstack }}" },
        },
      },
      mode: "blocking",
      hooks: [],
    },
    {
      name: "conversation_1747721261435",
      type: "conversation" as any,
      metadata: { position: { x: -17.54, y: 1003.34 } },
      prompt: "Thank the user for the conversation and inform them that the interview was generated successfully.",
      voice: { provider: "deepgram", voiceId: "thalia", model: "aura-2" },
    } as any,
    {
      name: "conversation_1747744490967",
      type: "conversation" as any,
      metadata: { position: { x: -11.16, y: 484.94 } },
      prompt: "Say that the Interview will be generated shortly.",
      voice: { provider: "deepgram", voiceId: "thalia", model: "aura-2" },
    } as any,
    {
      name: "hangup_1747744730181",
      type: "hangup",
      metadata: { position: { x: 76.01, y: 1272.06 } },
    },
  ],
  edges: [
    { from: "apiRequest_1747470739045", to: "conversation_1747721261435", condition: { type: "ai", prompt: "" } },
    { from: "start", to: "conversation_1747744490967", condition: { type: "ai", prompt: "If user provided all the required variables" } },
    { from: "conversation_1747744490967", to: "apiRequest_1747470739045", condition: { type: "ai", prompt: "" } },
    { from: "conversation_1747721261435", to: "hangup_1747744730181", condition: { type: "ai", prompt: "" } },
  ],
};

export const feedbackSchema = z.object({
  totalScore: z.number(),
  categoryScores: z.array(
    z.object({
      name: z.string(),
      score: z.number(),
      comment: z.string(),
    })
  ),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  finalAssessment: z.string(),
});

export const interviewCovers = [
  "/adobe.png",
  "/amazon.png",
  "/facebook.png",
  "/hostinger.png",
  "/pinterest.png",
  "/quora.png",
  "/reddit.png",
  "/skype.png",
  "/spotify.png",
  "/telegram.png",
  "/tiktok.png",
  "/yahoo.png",
];

export const dummyInterviews: Interview[] = [
  {
    id: "1",
    userId: "user1",
    role: "Frontend Developer",
    type: "Technical",
    techstack: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    level: "Junior",
    questions: ["What is React?"],
    finalized: false,
    createdAt: "2024-03-15T10:00:00Z",
  },
  {
    id: "2",
    userId: "user1",
    role: "Full Stack Developer",
    type: "Mixed",
    techstack: ["Node.js", "Express", "MongoDB", "React"],
    level: "Senior",
    questions: ["What is Node.js?"],
    finalized: false,
    createdAt: "2024-03-14T15:30:00Z",
  },
];
