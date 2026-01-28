# Newsletter Workflow Onboarding Guide

Welcome! This guide will get you up to speed on our newsletter creation process.

---

## What We're Building

We produce a weekly clinical operations newsletter for neuropsychiatry professionals. Our readers are senior clinical ops directors, medical affairs leads, and trial managers who expect:

- **Clinical rigor** - Accurate, fact-checked content
- **Operational insights** - Actionable takeaways they can use
- **Industry intelligence** - What's happening in trials, FDA, competitors
- **Peer-level writing** - No marketing fluff, no oversimplification

---

## The Two-Step Process

We use two Claude Projects that work together:

### Step 1: Discovery & Structuring
**Purpose:** Develop the topic, angle, and evidence
**Output:** A Narrative Brief that guides the writer
**Link:** [Discovery Project](https://claude.ai/project/019bfc23-8d94-7506-8f9a-b56269573c49)

### Step 2: Newsletter Creation
**Purpose:** Write the actual newsletter content
**Output:** Final newsletter draft (800 words max)
**Link:** [Newsletter Project](https://claude.ai/project/01993dc0-7bf0-724a-9437-815a61c7ac69)

---

## Your First Newsletter: Step-by-Step

### Before You Start

1. **Get access** to both Claude Projects (ask team lead for invite)
2. **Review past newsletters** in the project files to understand tone/style
3. **Identify your source material:**
   - Podcast transcript?
   - Internal data analysis?
   - Customer conversation notes?
   - Industry news or observation?

### Running Step 1

1. Open the Discovery Project
2. The agent will ask what you're working with - describe your source
3. Answer 5-10 discovery questions (one or two at a time)
4. When asked if you're ready, confirm
5. **Copy the entire Narrative Brief** it generates

**Tips:**
- Be specific about your data and evidence
- If you're unsure about the angle, say so - the agent will help
- Don't skip the "limitations" discussion - it builds credibility

### Running Step 2

1. Open the Newsletter Project
2. Paste the Narrative Brief from Step 1
3. Upload any supporting files (transcripts, data exports)
4. Wait for the draft
5. Review carefully for:
   - Clinical accuracy (the agent fact-checks, but verify key claims)
   - Language (no absolutist terms like "always," "never," "revolutionary")
   - Length (should be under 800 words)
6. Request revisions as needed

**Tips:**
- Upload the full transcript, not summaries
- Ask for specific quote citations if attribution matters
- Request bracketed links to past newsletters for cross-promotion

---

## Common Source Types

### Podcast Transcript
- Upload the full transcript file
- The agent will extract key quotes and insights
- Cross-reference guest credentials

### Internal Data Analysis
- Describe the finding and what surprised you
- Note if it's proprietary (Power data) vs. public
- Identify the "so what" for readers

### Customer Conversation
- Share notes or key observations
- Clarify if examples can be anonymized
- Focus on operational pain points revealed

### Brainstorm/Concept
- Describe the core insight or framework
- Provide a real example that illustrates it
- Note what triggered the thinking

---

## Language to Avoid vs. Use

| Avoid | Use Instead |
|-------|-------------|
| proved | showed, demonstrated |
| always | often, typically |
| never | rarely, seldom |
| revolutionary | notable, significant |
| all patients | most patients, many patients |
| guarantees | suggests, indicates |

**Rule of thumb:** Would a CMO say this in a peer-reviewed journal? If not, soften it.

---

## Quality Checklist

Before considering a newsletter done:

- [ ] Under 800 words
- [ ] Clinical claims fact-checked
- [ ] No absolutist language
- [ ] Limitations acknowledged
- [ ] Related past newsletters bracketed for linking
- [ ] Strong opening hook
- [ ] Would a clinical ops director forward this?

---

## Getting Help

- **Process questions:** Check `troubleshooting.md` or ask team lead
- **Claude Project access:** Contact [team lead]
- **Clinical accuracy questions:** Flag for SME review
- **Prompt updates:** Edit files in `prompts/` and sync to projects

---

## Resources

- [Main Workflow README](../README.md)
- [Step 1 Prompt](../prompts/step1-discovery.md)
- [Step 2 Prompt](../prompts/step2-newsletter.md)
- [Brief Template](../templates/narrative-brief.md)
- [Pre-Publish Checklist](../templates/newsletter-checklist.md)
