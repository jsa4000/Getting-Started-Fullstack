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
# Create a new remotion video project (remotion)
pnpm create video

# Start the development server
cd remotion
pnpm run dev

# Render the video
pnpm exec remotion render MyVideo --output my-video.mp4

# Installing Remotion in an existing project
# https://www.remotion.dev/docs/brownfield
pnpm i remotion@4.0.441 @remotion/cli@4.0.441
```

Then you can use the remotion skill to generate your own video compositions, animations, and effects. The skill includes best practices for using Remotion effectively.

> TIP: It's best to start with a clear vision of the video you want to create, and then use the skill to help implement that vision. The more specific and detailed your prompts, the better the results will be. Use the skill iteratively, refining your prompts based on the output you get. Don't be afraid to experiment and try different approaches to achieve the desired outcome.

Here are some prompts examples to get started:

```txt
Create a macOS terminal window, 1280x1000px, light theme. Blinking cursor using Remotion

Remove background. Bigger font

Add margin, keep transparent

Typewriter animation that types 'npx skills add remotion-dev/skills

Cursor blinks while idle

3D rotation. 20 degrees X and Y

10 degrees each axis

Rotate Y axis from 10 to -10 degrees over video length

Slide from bottom. Spring animation. No bounce

Add a dark style with dark background and light text.
```

Another example:

```txt
Create a terminal-style video showing a git workflow: type out git add .,
then git commit -m 'feat: add new feature', then git push origin main.
Each command should appear with a typewriter effect, followed by realistic output.
End with 'Deployed to production 🚀'
```

You can use images as references or websites for inspiration. For example:

```txt
Use attached image (#file:docs/images/2-Web-Application-Layers.webp) to create an animation using Remotion. The anmiation should animate the different shapes in the image using the same colors, forms, icons and other object in the image.

1. The animation should be 10 seconds long, and should loop seamlessly.
2. The animation starts by adding the title using a fade-in effect.
3. Then by animating the shapes in the image, one by one, using a slide-in effect from the top.
4. The animation should end by adding a fade-out effect to the whole composition.

IMPORTANT: Take a look at the shapes, they seems to be isometric and have some icons on top of each. please take care of the shaps and build geometry as same as the reference image
```

Finally, you can render the video with the `remotion render` command and share it with your friends and colleagues!

```bash
pnpm exec remotion render MacOsTerminal --output ../temp/MacOsTerminal.mp4
```
