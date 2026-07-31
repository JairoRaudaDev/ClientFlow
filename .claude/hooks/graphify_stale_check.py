"""Stop hook: block ending the turn if source files changed since the last
graphify build, so the knowledge graph doesn't silently go stale.
"""
import json
import os
import subprocess
import sys

CODE_EXTS = (
    ".py", ".js", ".jsx", ".ts", ".tsx", ".go", ".rs", ".java", ".rb",
    ".c", ".h", ".cpp", ".hpp", ".cc", ".cs", ".kt", ".swift", ".php",
    ".scala", ".lua", ".prisma",
)
GRAPH_PATH = os.path.join("graphify-out", "graph.json")


def main():
    try:
        data = json.load(sys.stdin)
    except Exception:
        data = {}

    # Avoid infinite loop: don't block again if this Stop hook already fired
    # once for this turn (Claude Code sets stop_hook_active on the retry).
    if data.get("stop_hook_active"):
        return

    if not os.path.exists(GRAPH_PATH):
        return

    try:
        result = subprocess.run(
            ["git", "ls-files"], capture_output=True, text=True, check=True
        )
    except Exception:
        return

    src_files = [
        f for f in result.stdout.splitlines()
        if f.lower().endswith(CODE_EXTS)
        and not f.startswith("graphify-out" + os.sep)
        and not f.startswith("graphify-out/")
        and "node_modules/" not in f
    ]
    if not src_files:
        return

    graph_mtime = os.path.getmtime(GRAPH_PATH)
    newest_file, newest_mtime = None, 0.0
    for f in src_files:
        if os.path.exists(f):
            m = os.path.getmtime(f)
            if m > newest_mtime:
                newest_mtime, newest_file = m, f

    if newest_mtime > graph_mtime:
        print(json.dumps({
            "decision": "block",
            "reason": (
                f"graphify-out/graph.json is stale ({newest_file} changed "
                "since the last build). Run `/graphify update .` before "
                "finishing this turn, then stop again."
            ),
        }))


if __name__ == "__main__":
    main()
