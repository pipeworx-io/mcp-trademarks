# mcp-trademarks

Trademarks MCP — USPTO TSDR trademark lookup

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 250+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `get_trademark_by_serial` | Look up a US trademark by serial number. Returns status, owner, filing/registration dates, goods/services, and classification. Requires USPTO API key (free at account.uspto.gov). |
| `get_trademark_by_registration` | Look up a US trademark by registration number. Returns status, owner, mark text, goods/services, and classification. Requires USPTO API key. |
| `get_trademark_documents` | Get the prosecution history (office actions, responses, etc.) for a trademark by serial number. Requires USPTO API key. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "trademarks": {
      "url": "https://gateway.pipeworx.io/trademarks/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 250+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Trademarks data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
