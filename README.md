# Linear MCP Plus

> Enhanced fork of [@tacticlaunch/mcp-linear](https://github.com/tacticlaunch/mcp-linear) with bug fixes and additional tools.

A Model Context Protocol (MCP) server for the Linear GraphQL API that enables AI assistants to interact with Linear project management systems.

## What's New in This Fork

### Bug Fixes

- **State Field Fix**: `linear_getIssueById` and `linear_getIssues` now properly return the `state` field with `{ id, name, color, type }` instead of an empty object `{}`

### New Tools

| Tool | Description |
|------|-------------|
| `linear_projectUpdateCreate` | Create project updates with health status (onTrack, atRisk, offTrack) |
| `linear_initiativeUpdateCreate` | Create initiative updates with health status |
| `linear_documentCreate` | Create documents in Linear (optionally linked to a project) |
| `linear_updateProjectLead` | Assign or remove a project lead |

---

## Installation

### Prerequisites

- Node.js >= 20.0.0
- Linear API Token ([How to get one](#getting-your-linear-api-token))

### Option 1: npm (Recommended)

```bash
npm install -g @daht-mad/linear-mcp-plus
```

### Option 2: Local Build

```bash
git clone https://github.com/daht-mad/linear-mcp-plus.git
cd linear-mcp-plus
npm install
npm run build
```

---

## Configuration

Add to your MCP configuration file (`~/.mcp.json` or client-specific location):

### Using npm package

```json
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "@daht-mad/linear-mcp-plus"],
      "env": {
        "LINEAR_API_TOKEN": "<YOUR_TOKEN>"
      }
    }
  }
}
```

### Using local build

```json
{
  "mcpServers": {
    "linear": {
      "command": "node",
      "args": ["/path/to/linear-mcp-plus/dist/index.js"],
      "env": {
        "LINEAR_API_TOKEN": "<YOUR_TOKEN>"
      }
    }
  }
}
```

### Client-Specific Config Locations

| Client | Config Path |
|--------|-------------|
| Claude Code | `~/.mcp.json` |
| Cursor | `~/.cursor/mcp.json` |
| Claude Desktop | `~/Library/Application Support/Claude/claude_desktop_config.json` |

---

## Getting Your Linear API Token

1. Log in to [linear.app](https://linear.app)
2. Click organization avatar (top-left) → **Settings**
3. Navigate to **Security & access** → **Personal API Keys**
4. Click **New API Key**, name it, and copy the token

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
"Create a new issue titled 'Fix login bug' in the Frontend team"
"Change the status of issue FE-123 to 'In Progress'"
"Add a project update for project X: 'Sprint completed successfully' with health onTrack"
"Create a document titled 'Architecture Overview' with the markdown content"
"Assign John as the lead for the Mobile App project"
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

## Credits

This project is a fork of [@tacticlaunch/mcp-linear](https://github.com/tacticlaunch/mcp-linear).

Thanks to the original authors for the excellent foundation.

---

## License

MIT License - see [LICENSE](LICENSE) for details.
