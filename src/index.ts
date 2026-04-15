interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

/**
 * Trademarks MCP — USPTO TSDR trademark lookup
 *
 * Searches and retrieves US trademark data from the USPTO TSDR API.
 * Requires a USPTO API key (free, register at account.uspto.gov/api-manager).
 * Pass via X-USPTO-Key header or _context.uspto.apiKey.
 */


const TSDR_BASE = 'https://tsdrapi.uspto.gov/ts/cd';

function getApiKey(args: Record<string, unknown>): string {
  // Check _context (injected by gateway for connected accounts)
  const ctx = args._context as Record<string, Record<string, string>> | undefined;
  if (ctx?.uspto?.apiKey) return ctx.uspto.apiKey;
  // Check direct arg (for standalone use)
  if (typeof args.api_key === 'string') return args.api_key;
  throw new Error(
    'USPTO API key required. Register for free at https://account.uspto.gov/api-manager/ and pass as api_key parameter.'
  );
}

async function fetchTsdr(path: string, apiKey: string): Promise<unknown> {
  const res = await fetch(`${TSDR_BASE}${path}`, {
    headers: {
      'USPTO-API-KEY': apiKey,
      Accept: 'application/json',
      'User-Agent': 'pipeworx-mcp/1.0',
    },
  });
  if (res.status === 401 || res.status === 403) {
    throw new Error('Invalid or expired USPTO API key. Register at https://account.uspto.gov/api-manager/');
  }
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`USPTO API error ${res.status}: ${body.slice(0, 200)}`);
  }

  const contentType = res.headers.get('content-type') ?? '';
  if (contentType.includes('json')) {
    return res.json();
  }
  // TSDR returns XML by default — parse key fields
  const xml = await res.text();
  return parseXmlResponse(xml);
}

function parseXmlResponse(xml: string): Record<string, unknown> {
  const extract = (tag: string): string | null => {
    const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
    return match ? match[1].trim() : null;
  };

  return {
    serial_number: extract('serialNumber') ?? extract('ApplicationNumberText'),
    registration_number: extract('registrationNumber') ?? extract('RegistrationNumber'),
    mark_text: extract('markElement') ?? extract('MarkVerbalElementText') ?? extract('wordMark'),
    status: extract('markCurrentStatusExternalDescriptionText') ?? extract('MarkCurrentStatusExternalDescriptionText'),
    status_date: extract('markCurrentStatusDate') ?? extract('MarkCurrentStatusDate'),
    filing_date: extract('applicationDate') ?? extract('ApplicationDate'),
    registration_date: extract('registrationDate') ?? extract('RegistrationDate'),
    owner_name: extract('partyName') ?? extract('EntityName'),
    attorney: extract('attorneyName'),
    goods_services: extract('classifiedGoodsServicesText') ?? extract('GoodsServicesDescription'),
    international_class: extract('classNumber') ?? extract('ClassNumber'),
    raw_available: xml.length > 0,
  };
}

const tools: McpToolExport['tools'] = [
  {
    name: 'get_trademark_by_serial',
    description: 'Look up a US trademark by serial number. Returns status, owner, filing/registration dates, goods/services, and classification. Requires USPTO API key (free at account.uspto.gov).',
    inputSchema: {
      type: 'object' as const,
      properties: {
        serial_number: { type: 'string', description: 'USPTO serial number (e.g., "97123456")' },
        api_key: { type: 'string', description: 'USPTO API key (register free at account.uspto.gov/api-manager)' },
      },
      required: ['serial_number'],
    },
  },
  {
    name: 'get_trademark_by_registration',
    description: 'Look up a US trademark by registration number. Returns status, owner, mark text, goods/services, and classification. Requires USPTO API key.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        registration_number: { type: 'string', description: 'USPTO registration number (e.g., "1234567")' },
        api_key: { type: 'string', description: 'USPTO API key' },
      },
      required: ['registration_number'],
    },
  },
  {
    name: 'get_trademark_documents',
    description: 'Get the prosecution history (office actions, responses, etc.) for a trademark by serial number. Requires USPTO API key.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        serial_number: { type: 'string', description: 'USPTO serial number' },
        api_key: { type: 'string', description: 'USPTO API key' },
      },
      required: ['serial_number'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const apiKey = getApiKey(args);

  switch (name) {
    case 'get_trademark_by_serial': {
      const sn = args.serial_number as string;
      return fetchTsdr(`/casestatus/sn${sn}/info`, apiKey);
    }
    case 'get_trademark_by_registration': {
      const rn = args.registration_number as string;
      return fetchTsdr(`/casestatus/rn${rn}/info`, apiKey);
    }
    case 'get_trademark_documents': {
      const sn = args.serial_number as string;
      return fetchTsdr(`/casedocs/sn${sn}/docs`, apiKey);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies McpToolExport;
