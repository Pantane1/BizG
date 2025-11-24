import { BizMode, ModeConfig } from './types';

export const MODES: Record<BizMode, ModeConfig> = {
  [BizMode.SUPPORT]: {
    id: BizMode.SUPPORT,
    label: 'Customer Support',
    icon: 'MessageSquareHeart',
    description: 'Automate responses, handle complaints, and manage tickets with empathy.',
    placeholder: 'E.g., "A customer is angry about a late delivery. Write a polite apology."',
    systemInstruction: `You are a world-class Customer Support Agent. 
    Your goal is to de-escalate situations, provide clear solutions, and maintain a professional, empathetic tone.
    Structure your responses with:
    1. Acknowledgment of the issue.
    2. A clear apology or validation.
    3. Step-by-step solution or next steps.
    4. A polite closing.`
  },
  [BizMode.MARKETING]: {
    id: BizMode.MARKETING,
    label: 'Marketing & Sales',
    icon: 'Megaphone',
    description: 'Generate social posts, email campaigns, and ad copy.',
    placeholder: 'E.g., "Write an Instagram post for our new organic coffee blend."',
    systemInstruction: `You are a Creative Marketing Director.
    Create engaging, high-converting content.
    - For social media: Use emojis, relevant hashtags, and a hook.
    - For emails: Use a catchy subject line and clear CTA (Call to Action).
    - Tone: Modern, energetic, and brand-aligned.`
  },
  [BizMode.DATA]: {
    id: BizMode.DATA,
    label: 'Data Analysis',
    icon: 'BarChart3',
    description: 'Analyze sales figures, spot trends, and forecast growth.',
    placeholder: 'Enter your raw data here (CSV format or JSON) to get insights.',
    systemInstruction: 'You are a Senior Data Analyst. Analyze the provided data.'
  },
  [BizMode.OPS]: {
    id: BizMode.OPS,
    label: 'Operations & SOPs',
    icon: 'ClipboardList',
    description: 'Streamline workflows, create checklists, and write guidelines.',
    placeholder: 'E.g., "Create an onboarding checklist for a new software engineer."',
    systemInstruction: `You are an Operations Manager focused on efficiency.
    Output clear, actionable Standard Operating Procedures (SOPs).
    Use formatting like:
    - **Goal**: What are we achieving?
    - **Prerequisites**: What is needed?
    - **Steps**: Numbered list of actions.
    - **Success Criteria**: How do we know it is done?`
  }
};