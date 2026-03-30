# Skills

[Agent Skills](https://agentskills.io) are folders of instructions, scripts, and resources that agents can discover and use to do things more accurately and efficiently.

Agents are increasingly capable, but often don’t have the **context** they need to do real work **reliably**. **Skills** solve this by giving agents access to procedural knowledge and company-, team-, and user-specific context they can load on demand. Agents with access to a set of skills can **extend** their capabilities based on the task they’re working on.

## Skill CLI

The CLI for the open agent skills ecosystem.

[Skills](https://github.com/vercel-labs/skills)

> skills cli does not need to be insstalled globally, you can run it with npx

```bash
# Install the skills for frontend design and skill creation (from anthropics/skills) and the github-copilot agent
npx skills add https://github.com/anthropics/skills --skill frontend-design --skill skill-creator --agent github-copilot

# Find skill to search for specific skills
npx skills add https://github.com/vercel-labs/skills --skill find-skills --agent github-copilot

# Install some custom vercel-labs/agent-skills skills
npx skills add vercel-labs/agent-skills --skill vercel-react-best-practices --skill vercel-react-native-skills --agent github-copilot

# https://github.com/google-labs-code/stitch-skills
npx skills add google-labs-code/stitch-skills --skill "*" --agent github-copilot

# https://github.com/remotion-dev/skills.git
npx skills add remotion-dev/skills --skill "*" --agent github-copilot

```

## Examples

### Remotion

Start by initializing a remotion project:

```bash
# Create a new remotion video project
pnpm create video

# Start the development server
pnpm run dev

# Render the video
pnpm exec remotion render

# Installing Remotion in an existing project
# https://www.remotion.dev/docs/brownfield
pnpm i remotion@4.0.441 @remotion/cli@4.0.441
```
