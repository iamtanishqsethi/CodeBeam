import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { searchSkills, getAllSkills } from '@/lib/skills';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Try to load find-skills instruction dynamically
  const allSkills = getAllSkills();
  const findSkillsInstruction = allSkills.find(s => s.name === 'find-skills' || s.fileName.includes('find-skills'))?.content || 
    "You have access to a skills registry. Use the `find_skill` tool to search for available skills that might help you complete your tasks.";

  const systemPrompt = `
    You are an advanced AI developer agent for the Axon application.
    
    ## SKILLS SYSTEM INSTRUCTIONS
    ${findSkillsInstruction}
  `;

  const result = streamText({
    model: openai('gpt-4o'), // Use gpt-4o or your preferred model
    system: systemPrompt,
    messages,
    tools: {
      find_skill: tool({
        description: 'Search for available skills in the local `.agents/skills` registry. Returns the skill instructions.',
        parameters: z.object({
          query: z.string().describe('The search query to find relevant skills (e.g., "shadcn", "framer-motion")'),
        }),
        execute: async ({ query }: { query: string }) => {
          const results = searchSkills(query);
          if (results.length === 0) {
            return `No skills found matching "${query}".`;
          }
          return `Found skills:\n${results.map((r) => `## Skill: ${r.name}\n**Description**: ${r.description}\n\n**Instructions**:\n${r.content}\n---`).join('\n')}`;
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any),
    },
  });

  return result.toTextStreamResponse();
}
