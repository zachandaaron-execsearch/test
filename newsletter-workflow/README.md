# Power Newsletter Workflow

A two-step process for creating clinical operations newsletters using Claude Projects.

## Overview

```
Step 1: Discovery & Structuring    -->    Step 2: Newsletter Creation
(Topic ideation & brief creation)         (Final content writing)
```

**Step 1** helps you develop the topic, angle, and evidence through conversation.
**Step 2** takes the brief and writes the actual newsletter with clinical rigor.

---

## Quick Start (For Team Members)

### Step 1: Topic Discovery

1. Open the [Discovery Project](https://claude.ai/project/019bfc23-8d94-7506-8f9a-b56269573c49)
2. Start with your source material:
   - Internal data/analytics
   - Brainstorm notes or conversation transcripts
   - Customer insights
   - Podcast transcript
   - Industry news or concept
3. Answer the discovery questions (5-10 questions)
4. Confirm readiness for the Narrative Brief
5. **Copy the entire brief output**

### Step 2: Newsletter Creation

1. Open the [Newsletter Project](https://claude.ai/project/01993dc0-7bf0-724a-9437-815a61c7ac69)
2. Paste the Narrative Brief from Step 1
3. Upload any supporting files (transcripts, data exports)
4. Review the draft for clinical accuracy
5. Request revisions if needed

---

## Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        NEWSLETTER WORKFLOW                          │
└─────────────────────────────────────────────────────────────────────┘

    ┌──────────────────┐
    │  SOURCE MATERIAL │
    │  ─────────────── │
    │  - Internal data │
    │  - Brainstorm    │
    │  - Podcast       │
    │  - Customer      │
    │    insights      │
    └────────┬─────────┘
             │
             ▼
┌─────────────────────────────────┐
│  STEP 1: DISCOVERY PROJECT      │
│  ───────────────────────────    │
│  • Clarify source type          │
│  • 5-10 probing questions       │
│  • Identify angle & evidence    │
│  • Generate Narrative Brief     │
│                                 │
│  OUTPUT: Narrative Brief        │
└────────────────┬────────────────┘
                 │
                 │  Copy/Paste Brief
                 ▼
┌─────────────────────────────────┐
│  STEP 2: NEWSLETTER PROJECT     │
│  ───────────────────────────    │
│  • Upload transcripts/files     │
│  • Paste Narrative Brief        │
│  • Clinical fact-checking       │
│  • 800 word max                 │
│  • Scientific language          │
│                                 │
│  OUTPUT: Final Newsletter       │
└────────────────┬────────────────┘
                 │
                 ▼
    ┌──────────────────┐
    │  REVIEW & SEND   │
    │  ─────────────── │
    │  Final QA check  │
    │  Add links       │
    │  Publish         │
    └──────────────────┘
```

---

## Roles & Responsibilities

| Role | Step 1 | Step 2 | Notes |
|------|--------|--------|-------|
| **Subject Expert** (Brandon, etc.) | Lead | Review | Provides domain knowledge, approves angle |
| **Content Creator** | Support | Lead | Runs the projects, manages handoff |
| **Reviewer** | - | Final QA | Clinical accuracy check before publish |

---

## File Structure

```
newsletter-workflow/
├── README.md                    # This file
├── prompts/
│   ├── step1-discovery.md       # Full prompt for Discovery project
│   └── step2-newsletter.md      # Full prompt for Newsletter project
├── templates/
│   ├── narrative-brief.md       # Template for the handoff brief
│   └── newsletter-checklist.md  # Pre-publish quality checklist
├── guides/
│   ├── onboarding.md            # New team member guide
│   └── troubleshooting.md       # Common issues & solutions
└── examples/
    └── sample-brief.md          # Example completed brief
```

---

## Key Quality Gates

### Before Step 1
- [ ] Source material identified and accessible
- [ ] Subject matter expert available for questions

### After Step 1 (Before Step 2)
- [ ] Narrative Brief has clear angle/thesis
- [ ] Evidence and data points documented
- [ ] Target audience defined
- [ ] Limitations acknowledged

### After Step 2 (Before Publish)
- [ ] Clinical terminology verified
- [ ] No absolutist language (never, always, revolutionary)
- [ ] All claims fact-checked via web search
- [ ] Under 800 words
- [ ] Links to related past newsletters added
- [ ] Would a CMO forward this to their team?

---

## Updating the Projects

If you need to modify the Claude Project prompts:

1. Edit the source files in `prompts/`
2. Copy the updated prompt to the respective Claude Project
3. Commit changes to this repo for version control

This ensures we have a single source of truth and can track prompt iterations.

---

## Links

- [Step 1: Discovery Project](https://claude.ai/project/019bfc23-8d94-7506-8f9a-b56269573c49)
- [Step 2: Newsletter Project](https://claude.ai/project/01993dc0-7bf0-724a-9437-815a61c7ac69)
