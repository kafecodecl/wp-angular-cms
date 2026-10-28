import { appendFile, mkdir } from "node:fs/promises"
import { join } from "node:path"

const REDACTIONS = [
  [/(--password[=\s]+)\S+/gi, "$1[REDACTED]"],
  [/(\b[A-Z0-9_]*(?:PASSWORD|SECRET|TOKEN|KEY)[A-Z0-9_]*\s*=\s*)[^\n]+/gi, "$1[REDACTED]"],
  [/((?:password|passwd|token|secret|api[_-]?key)["']?\s*[:=]\s*["']?)[^"'\s,}]+/gi, "$1[REDACTED]"],
  [/((?:authorization)\s*[:=]\s*)(?:(?:Bearer|Basic)\s+)?\S+/gi, "$1[REDACTED]"],
  [/(-u\s+\S+:\S+)/gi, "-u [REDACTED]"],
  [/(--user\s+\S+:\S+)/gi, "--user [REDACTED]"],
  [/(Bearer\s+)\S+/gi, "$1[REDACTED]"],
  [/(Basic\s+)[A-Za-z0-9+/=]+/gi, "$1[REDACTED]"],
]

function redact(value) {
  return REDACTIONS.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), value)
}

function truncate(value, max = 500) {
  return value.length > max ? `${value.slice(0, max)}...` : value
}

export default async function devJournal({ directory, worktree }) {
  const root = worktree || directory
  const stateDir = join(root, ".opencode", "state")
  const journal = join(stateDir, "activity.jsonl")

  async function write(entry) {
    try {
      await mkdir(stateDir, { recursive: true })
      await appendFile(journal, `${JSON.stringify({ at: new Date().toISOString(), ...entry })}\n`, "utf8")
    } catch {
      // El journal es auxiliar: nunca debe romper una sesion.
    }
  }

  return {
    event: async ({ event }) => {
      if (!event || !["session.created", "session.idle", "session.error"].includes(event.type)) return
      await write({
        kind: "event",
        event: event.type,
        sessionID: event.properties?.sessionID ?? event.properties?.info?.id,
      })
    },

    "tool.execute.before": async (input, output) => {
      const args = output?.args ?? {}
      if (input.tool === "edit" || input.tool === "write") {
        await write({
          kind: "file",
          tool: input.tool,
          path: String(args.filePath ?? args.path ?? ""),
        })
        return
      }
      if (input.tool === "bash") {
        await write({
          kind: "bash",
          command: truncate(redact(String(args.command ?? ""))),
        })
      }
    },
  }
}
