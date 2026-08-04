# mcp-trademarks

Trademarks MCP — US trademark search + record lookup

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `search_trademarks` | Search US federal trademarks by mark text — the clearance/knockout-search path. Find registered and pending marks by wordmark without knowing a serial or registration number, then filter by international class and live/dead status to see which marks are actually enforceable. Covers the full USPTO register (the tmsearch.uspto.gov Elasticsearch backend that replaced TESS). Keyless. Use this to check whether a proposed brand name conflicts with existing US trademarks. Returns wordmark, serial and registration numbers, status, live flag, international classes, goods/services, owner, and filing dates. For a name-availability check, set live_only:true and pass the relevant class (e.g. 35 for advertising/business, 42 for software/SaaS, 9 for downloadable software). |
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

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

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

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
