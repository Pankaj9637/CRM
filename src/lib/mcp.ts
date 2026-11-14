const MCP_ENDPOINT = process.env.MCP_ENDPOINT || 'https://questathon.aihackerscollective.com/api/public/mcp';
const MCP_TOKEN = process.env.MCP_TOKEN || process.env.MCP_CONNECTOR || '';

let lastCallTime = 0;

export async function callMCP(toolName: string, args: Record<string, any> = {}) {
  // Rate limit: 1 call per minute
  const now = Date.now();
  const elapsed = now - lastCallTime;
  if (elapsed < 60000 && lastCallTime > 0) {
    const wait = 60000 - elapsed;
    await new Promise(r => setTimeout(r, wait));
  }
  lastCallTime = Date.now();

  try {
    const res = await fetch(MCP_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MCP_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'tools/call',
        params: { name: toolName, arguments: args },
        id: Date.now(),
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`MCP call error (${res.status}):`, errText);
      return { isError: true, error: errText };
    }

    const data = await res.json();
    if (data.result?.content?.[0]?.text) {
      try {
        return JSON.parse(data.result.content[0].text);
      } catch {
        return data.result.content[0].text;
      }
    }
    return data.result || data;
  } catch (error: any) {
    console.error('Failed to call MCP:', error);
    return { isError: true, error: error.message };
  }
}
