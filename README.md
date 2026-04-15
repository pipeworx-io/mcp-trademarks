# mcp-trademarks

Trademarks MCP — USPTO TSDR trademark lookup

Part of the [Pipeworx](https://pipeworx.io) open MCP gateway.

## Tools

| Tool | Description |
|------|-------------|
| `get_trademark_by_serial` | Look up a US trademark by serial number. Returns status, owner, filing/registration dates, goods/services, and classification. Requires USPTO API key (free at account.uspto.gov). |
| `get_trademark_by_registration` | Look up a US trademark by registration number. Returns status, owner, mark text, goods/services, and classification. Requires USPTO API key. |
| `get_trademark_documents` | Get the prosecution history (office actions, responses, etc.) for a trademark by serial number. Requires USPTO API key. |

## Quick Start

Add to your MCP client config:

```json
{
  "mcpServers": {
    "trademarks": {
      "url": "https://gateway.pipeworx.io/trademarks/mcp"
    }
  }
}
```

Or use the CLI:

```bash
npx pipeworx use trademarks
```

## License

MIT
