// app/api/zabbix-retificadoras/route.ts
import { NextRequest, NextResponse } from "next/server";

// Cache em memória
let cachedData: any = null;
let cachedAt = 0;
const CACHE_DURATION = 10 * 1000; // 10 segundos

export async function GET(req: NextRequest) {
  const now = Date.now();

  if (cachedData && now - cachedAt < CACHE_DURATION) {
    return NextResponse.json(cachedData);
  }

  try {
    const response = await fetch("http://10.46.0.206/zabbix/api_jsonrpc.php", {
      method: "POST",
      headers: { "Content-Type": "application/json-rpc" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "host.get",
        params: {
          output: "extend",
          selectItems: ["itemid", "name", "key_", "lastvalue", "lastclock"],
        },
        auth: "a1142ab5d282b830fc4e719f6ec651a53d8d8d098a338457fa173d3ca4d4fa4a",
        id: 1,
      }),
    });

    const data = await response.json();

    cachedData = { result: data?.result || [] };
    cachedAt = now;

    return NextResponse.json(cachedData);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ result: [] }, { status: 500 });
  }
}

//"a1142ab5d282b830fc4e719f6ec651a53d8d8d098a338457fa173d3ca4d4fa4a"
