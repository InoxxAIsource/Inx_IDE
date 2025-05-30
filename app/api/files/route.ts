import { type NextRequest, NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const BASE_DIR = path.join(process.cwd(), "sandbox")

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const mode = searchParams.get("mode")
  const filePath = searchParams.get("path")

  if (mode === "tree") {
    const tree = await buildFileTree(BASE_DIR)
    return NextResponse.json({ tree })
  }

  if (filePath) {
    const fullPath = path.join(BASE_DIR, filePath)
    try {
      const content = await fs.readFile(fullPath, "utf-8")
      return NextResponse.json({ content })
    } catch (error) {
      return NextResponse.json({ error: "Failed to read file" }, { status: 500 })
    }
  }

  return NextResponse.json({ error: "Invalid request" }, { status: 400 })
}

export async function POST(req: NextRequest) {
  const { filename, content } = await req.json()
  if (!filename) return NextResponse.json({ error: "Missing filename" }, { status: 400 })

  const fullPath = path.join(BASE_DIR, filename)
  try {
    await fs.mkdir(path.dirname(fullPath), { recursive: true })
    if (content !== undefined) await fs.writeFile(fullPath, content)
    return NextResponse.json({ success: true, path: fullPath })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const filePath = searchParams.get("path")
  if (!filePath) return NextResponse.json({ error: "Missing file path" }, { status: 400 })

  const fullPath = path.join(BASE_DIR, filePath)
  try {
    await fs.rm(fullPath, { recursive: true, force: true })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 })
  }
}

async function buildFileTree(dir: string, relativePath = ""): Promise<any[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const tree = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name)
      const entryPath = path.join(relativePath, entry.name)
      if (entry.isDirectory()) {
        return {
          name: entry.name,
          type: "folder",
          path: entryPath,
          children: await buildFileTree(fullPath, entryPath),
        }
      } else {
        return {
          name: entry.name,
          type: "file",
          path: entryPath,
        }
      }
    }),
  )
  return tree
}
