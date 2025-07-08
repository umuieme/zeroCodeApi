import { generateOpenAPISpec } from "@/lib/docs/generateOpenApi";
import { NextResponse } from "next/server";

export async function GET() {
  const spec = generateOpenAPISpec();
  return NextResponse.json(spec);
}
