# mcp-trademarks

Trademarks MCP — US trademark search + record lookup

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1476+ live data sources.

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

### What this endpoint actually serves

`tools/list` at `https://gateway.pipeworx.io/trademarks/mcp` returns the tools in the table
above **plus the shared Pipeworx meta-tools** — `ask_pipeworx`,
`discover_tools`, `search_within`, `remember`/`recall` and the rest of the
gateway-wide set. So the tool count you see is larger than this table: a
single-pack endpoint currently lists roughly 30 shared tools alongside the
pack's own. The connection's `initialize` response states its exact scope, and
is the authoritative answer for a given day.

This is deliberate, not multiplexing by accident. The meta-tools are what let a
scoped connection answer a question this pack does not cover — via
`ask_pipeworx`, which routes across the whole catalog — without you adding a
second MCP server. There is currently no way to mount a pack endpoint without
them; if the extra schemas cost you more context than the routing is worth,
connect to the full gateway once rather than to several pack endpoints.

Or connect to the full Pipeworx gateway to get every pack's tools listed
directly, instead of just this one's:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

Both URLs reach the same gateway and the same 1476+ data sources. The
only difference is which pack's tools are listed **directly**; `ask_pipeworx`
reaches all of them from either one.

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English —
this works on the pack endpoint above as well as on the full gateway:

```
ask_pipeworx({ question: "your question about Trademarks data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
