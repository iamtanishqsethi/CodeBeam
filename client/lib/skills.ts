import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface Skill {
  name: string;
  description: string;
  content: string;
  fileName: string;
}

export function getAllSkills(): Skill[] {
  const skillsDirectory = path.join(process.cwd(), "..", ".agents", "skills");

  if (!fs.existsSync(skillsDirectory)) {
    return [];
  }

  const skillFolders = fs.readdirSync(skillsDirectory);
  const skills: Skill[] = [];

  for (const folder of skillFolders) {
    const skillPath = path.join(skillsDirectory, folder, "SKILL.md");
    
    if (fs.existsSync(skillPath)) {
      const fileContents = fs.readFileSync(skillPath, "utf8");
      // Use gray-matter to parse the skill metadata section
      const { data, content } = matter(fileContents);
      
      skills.push({
        name: data.name || folder,
        description: data.description || "",
        content: content,
        fileName: skillPath,
      });
    }
  }

  return skills;
}

export function searchSkills(query: string): Skill[] {
  const allSkills = getAllSkills();
  const lowerQuery = query.toLowerCase();
  
  return allSkills.filter(skill => 
    skill.name.toLowerCase().includes(lowerQuery) || 
    skill.description.toLowerCase().includes(lowerQuery) ||
    skill.content.toLowerCase().includes(lowerQuery)
  );
}
