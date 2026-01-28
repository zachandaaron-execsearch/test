# Troubleshooting Guide

Common issues and how to resolve them.

---

## Step 1: Discovery Project Issues

### "The agent keeps asking too many questions"

**Cause:** The agent asks 5-10 questions adaptively. If you already have a clear angle, you can accelerate.

**Solution:** Say something like: "I have a clear angle already. The thesis is [X]. Let's move to the brief."

---

### "The brief doesn't capture what I wanted"

**Cause:** Discovery conversation may have missed key context.

**Solutions:**
- Before regenerating, clarify what's missing: "The brief is missing [X]. Can you add that?"
- Provide more specific evidence or data points
- Share the actual angle you want in 2-3 sentences

---

### "I don't have a clear source material"

**Cause:** Starting with just a vague idea.

**Solutions:**
- That's fine! Tell the agent: "I have a concept I want to explore but no specific data yet"
- The agent will help you identify what evidence you need
- Consider if this topic should wait until you have supporting material

---

## Step 2: Newsletter Project Issues

### "The draft is over 800 words"

**Cause:** Too much material or too many themes.

**Solutions:**
- Ask: "Please cut this to under 800 words, prioritizing [X theme]"
- Remove one of the key points from the brief next time
- Request a "punchy" vs. "comprehensive" tone

---

### "The language is too hype-y"

**Cause:** The agent may default to more engaging language.

**Solutions:**
- Point to specific phrases: "Change 'revolutionary approach' to 'notable development'"
- Remind: "Use scientific language - 'showed' not 'proved'"
- Reference the language guide in the prompt

---

### "Clinical facts seem wrong"

**Cause:** Transcripts may have errors, or claims need verification.

**Solutions:**
- Ask: "Please verify [specific claim] via web search"
- Cross-reference FDA databases yourself for critical claims
- Flag uncertain claims with "[verify]" for SME review

---

### "The draft doesn't match the brief angle"

**Cause:** Brief may have been unclear, or too much material pulled the focus.

**Solutions:**
- Restate the angle explicitly: "The core thesis should be [X]. Please refocus."
- Simplify the brief to have fewer competing themes
- Ask: "What's the one takeaway from this piece?" to realign

---

### "Transcript quality is poor"

**Cause:** Auto-transcription errors, unclear audio.

**Solutions:**
- Flag for the agent: "Transcript has quality issues. Please flag uncertain sections."
- Provide speaker identification if not clear
- Consider manual cleanup of key quotes before upload

---

## Handoff Issues

### "Lost the brief between steps"

**Cause:** Didn't copy before closing.

**Solutions:**
- Check browser history - you may be able to recover the conversation
- Re-run Step 1 with the same inputs (usually faster the second time)
- Keep a notes doc open to paste briefs as backup

---

### "Step 2 project doesn't have the transcript"

**Cause:** Files need to be uploaded to each project separately.

**Solution:** Upload files directly in the Step 2 conversation, or add them to the project's knowledge base if you'll reuse them.

---

## Project Access Issues

### "I can't access one of the Claude Projects"

**Cause:** Projects are private by default.

**Solution:** Ask the project owner to invite you via the project sharing settings.

---

### "The prompts seem different from what's documented"

**Cause:** Someone may have updated the project prompt without updating the repo.

**Solutions:**
- Check with team if intentional
- If the repo version is correct, copy it to the project
- Always update both places when making prompt changes

---

## Quality Issues

### "Reviewer flagged clinical inaccuracies"

**Cause:** AI fact-checking isn't perfect; some claims need human verification.

**Solutions:**
- Build in SME review step for complex topics
- Use the pre-publish checklist
- Ask the newsletter agent to cite sources for key claims

---

### "Newsletter feels too generic"

**Cause:** Angle may not be specific enough, or lacking unique evidence.

**Solutions:**
- In Step 1, push harder on: "What's the unique angle? What hasn't been said?"
- Add proprietary data or specific examples
- Include direct quotes from subject matter experts

---

## Still Stuck?

1. Check if the issue is in the prompts themselves - review `prompts/` files
2. Ask in team Slack channel
3. Document new issues and solutions in this file for future reference
