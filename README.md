# Linear MCP Plus

> Enhanced fork of [@tacticlaunch/mcp-linear](https://github.com/tacticlaunch/mcp-linear) with bug fixes and additional tools.

A Model Context Protocol (MCP) server for the Linear GraphQL API that enables AI assistants to interact with Linear project management systems.

---

## Quick Start

### 1. Get Your Linear API Token

1. Log in to [linear.app](https://linear.app)
2. Click organization avatar (top-left) → **Settings**
3. Navigate to **Security & access** → **Personal API Keys**
4. Click **New API Key**, name it, and copy the token

### 2. Add to Your MCP Config

Edit `~/.mcp.json` (create if it doesn't exist):

```json
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "@daht-mad/linear-mcp-plus"],
      "env": {
        "LINEAR_API_TOKEN": "lin_api_xxxxxxxxxx"
      }
    }
  }
}
```

### 3. Restart Your AI Client

Restart Claude Code, Cursor, or your MCP-compatible client. Done!

```text
"Show me my Linear issues"
"Create an issue titled 'Fix bug' in the Frontend team"
```

> **Where to store the token?**
> Always store your token in the `env` section of `.mcp.json`, not in `.zshrc` or `.bashrc`.
> This keeps tokens scoped to MCP servers and avoids exposing them to all terminal sessions.

---

## Why This Fork Exists

### The Problem

While using the original `@tacticlaunch/mcp-linear` with Claude Code for daily project management, I encountered two significant limitations:

**1. The State Bug**

When fetching issues via `linear_getIssueById` or `linear_getIssues`, the `state` field always returned an empty object `{}` instead of the actual workflow state data. This meant my AI assistant couldn't tell me whether an issue was "Todo", "In Progress", or "Done" — a pretty fundamental piece of information for project management.

```typescript
// What I got:
{ id: "ABC-123", title: "Fix bug", state: {} }

// What I needed:
{ id: "ABC-123", title: "Fix bug", state: { id: "...", name: "In Progress", type: "started" } }
```

The root cause was that the Linear SDK uses promise-based relationships for related objects. The `state` field needs to be awaited before accessing its properties, but two methods in the original codebase missed this pattern (while `searchIssues` handled it correctly).

**2. Missing Tools for My Workflow**

I had custom Python and JavaScript scripts for:
- Creating **project updates** (weekly/sprint status reports with health indicators)
- Creating **initiative updates** (similar to project updates, but at a higher level)
- Creating **documents** directly in Linear projects
- Batch-updating **project leads** across multiple projects

These scripts worked, but I wanted everything unified in the MCP so my AI assistant could handle it all without switching contexts.

### The Solution

Instead of maintaining separate scripts, I forked the original MCP and:

1. **Fixed the state bug** by applying the correct async/await pattern to `getIssues()` and `getIssueById()` methods
2. **Added 4 new tools** that cover the missing functionality
3. **Published as a separate package** so others facing similar issues can benefit

---

## What's New in This Fork

### Bug Fixes

| Issue | Fix |
|-------|-----|
| `state` field returns `{}` | Now properly awaits the promise and returns `{ id, name, color, type }` |

### New Tools

| Tool | Description |
|------|-------------|
| `linear_projectUpdateCreate` | Create project updates with health status (onTrack, atRisk, offTrack) |
| `linear_initiativeUpdateCreate` | Create initiative updates with health status |
| `linear_documentCreate` | Create documents in Linear (optionally linked to a project) |
| `linear_updateProjectLead` | Assign or remove a project lead |

---

## Installation Options

### Prerequisites

- Node.js >= 20.0.0
- Linear API Token (see [Quick Start](#quick-start) above)

### Project-Specific Installation

If you need different Linear workspaces per project, create `.mcp.json` in your project root:

```json
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "@daht-mad/linear-mcp-plus"],
      "env": {
        "LINEAR_API_TOKEN": "<YOUR_PROJECT_SPECIFIC_TOKEN>"
      }
    }
  }
}
```

### Local Development Build

```bash
git clone https://github.com/daht-mad/linear-mcp-plus.git
cd linear-mcp-plus
npm install
npm run build
```

Then add to your `~/.mcp.json`:

```json
{
  "mcpServers": {
    "linear": {
      "command": "node",
      "args": ["/absolute/path/to/linear-mcp-plus/dist/index.js"],
      "env": {
        "LINEAR_API_TOKEN": "<YOUR_TOKEN>"
      }
    }
  }
}
```

### Client-Specific Config Locations

| Client | Global Config Path |
|--------|---------------------------------------------------------------------|
| **Claude Code** | `~/.mcp.json` |
| **Cursor** | `~/.cursor/mcp.json` |
| **Claude Desktop** | `~/Library/Application Support/Claude/claude_desktop_config.json` |

---

## Available Tools

### Issues

| Tool | Description |
|------|-------------|
| `linear_getIssues` | Get recent issues |
| `linear_getIssueById` | Get issue by ID or identifier (e.g., `ABC-123`) |
| `linear_searchIssues` | Search issues with filters |
| `linear_createIssue` | Create a new issue |
| `linear_updateIssue` | Update an existing issue |
| `linear_archiveIssue` | Archive an issue |
| `linear_assignIssue` | Assign issue to a user |
| `linear_setIssuePriority` | Set issue priority |
| `linear_addIssueLabel` | Add label to issue |
| `linear_removeIssueLabel` | Remove label from issue |
| `linear_createComment` | Add comment to issue |
| `linear_getComments` | Get issue comments |
| `linear_getIssueHistory` | Get issue change history |
| `linear_createIssueRelation` | Create relation between issues |
| `linear_convertIssueToSubtask` | Convert issue to subtask |
| `linear_subscribeToIssue` | Subscribe to issue updates |
| `linear_transferIssue` | Transfer issue to another team |
| `linear_duplicateIssue` | Duplicate an issue |
| `linear_addIssueToCycle` | Add issue to a cycle |

### Projects

| Tool | Description |
|------|-------------|
| `linear_getProjects` | Get all projects |
| `linear_getProjectIssues` | Get issues in a project |
| `linear_createProject` | Create a new project |
| `linear_updateProject` | Update project details |
| `linear_addIssueToProject` | Add issue to project |
| `linear_projectUpdateCreate` | **NEW** - Create project update with health status |
| `linear_updateProjectLead` | **NEW** - Assign/remove project lead |

### Initiatives

| Tool | Description |
|------|-------------|
| `linear_getInitiatives` | Get all initiatives |
| `linear_getInitiativeById` | Get initiative by ID |
| `linear_createInitiative` | Create a new initiative |
| `linear_updateInitiative` | Update initiative details |
| `linear_archiveInitiative` | Archive an initiative |
| `linear_deleteInitiative` | Delete an initiative |
| `linear_getInitiativeProjects` | Get projects in an initiative |
| `linear_addProjectToInitiative` | Add project to initiative |
| `linear_removeProjectFromInitiative` | Remove project from initiative |
| `linear_initiativeUpdateCreate` | **NEW** - Create initiative update with health status |

### Documents

| Tool | Description |
|------|-------------|
| `linear_documentCreate` | **NEW** - Create a document (optionally linked to project) |

### Organization

| Tool | Description |
|------|-------------|
| `linear_getViewer` | Get current authenticated user |
| `linear_getOrganization` | Get organization info |
| `linear_getUsers` | Get all users |
| `linear_getTeams` | Get all teams |
| `linear_getLabels` | Get all labels |
| `linear_getWorkflowStates` | Get workflow states for a team |
| `linear_getCycles` | Get all cycles |
| `linear_getActiveCycle` | Get active cycle for a team |

---

## Example Prompts

```
"Show me all my Linear issues"
"What's the status of issue FE-123?"
"Create a new issue titled 'Fix login bug' in the Frontend team"
"Add a project update: 'Sprint 5 completed, all features shipped' with health onTrack"
"Create a document titled 'API Design' in the Backend project"
"Assign Alice as the lead for the Mobile App project"
"Create an initiative update for Q1 Goals: 'On track to hit 80% completion'"
```

---

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run locally
node dist/index.js
```

---

## Technical Notes

### The State Bug Fix

The Linear SDK uses lazy-loaded promise-based relationships. When you access `issue.state`, you get a Promise, not the actual state object. The fix:

```typescript
// Before (buggy):
return { state: issue.state }  // Returns {}

// After (fixed):
const stateData = issue.state ? await issue.state : null;
return {
  state: stateData ? {
    id: stateData.id,
    name: stateData.name,
    color: stateData.color,
    type: stateData.type,
  } : null
}
```

### New Tools Implementation

The 4 new tools follow the existing codebase patterns:
- Tool definitions in `src/tools/definitions/`
- Type guards in `src/tools/type-guards.ts`
- Handlers in `src/tools/handlers/`
- Service methods in `src/services/linear-service.ts`

For `initiativeUpdateCreate` and `documentCreate`, I used GraphQL `rawRequest` since the Linear SDK doesn't expose these mutations directly.

---

## Credits

This project is a fork of [@tacticlaunch/mcp-linear](https://github.com/tacticlaunch/mcp-linear).

Thanks to the original authors for the excellent foundation.

---

## License

MIT License - see [LICENSE](LICENSE) for details.
