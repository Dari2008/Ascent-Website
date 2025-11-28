import os

dir = "."
fileEx = [
    ".txt",
    ".py",
    ".java",
    "ts",
    ".js",
    ".html",
    ".scss",
    ".json",
    ".xml",
    ".bat"
]

excludeDir = [
    ".git",
    ".idea",
    ".vscode",
    ".github",
    "node_modules",
    "dist",
    "measureing-api",
    "notifications",
    "vendor",
    "composer.json",
    "composer.lock",
    "package.json",
    "package-lock.json",
    "yarn.lock"
]

def count_lines_in_files(root_dir, file_extensions, exclude_list):
    total_lines = 0
    for dirpath, dirnames, filenames in os.walk(root_dir):
        # Remove excluded directories from traversal
        dirnames[:] = [d for d in dirnames if d not in exclude_list]
        for filename in filenames:
            # Skip excluded files
            if filename in exclude_list:
                continue
            # Check file extension
            if any(filename.endswith(ext) for ext in file_extensions):
                file_path = os.path.join(dirpath, filename)
                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        lines = sum(1 for _ in f)
                        total_lines += lines
                except Exception:
                    pass
    print(f"Gesamtanzahl der Zeilen: {total_lines}")

count_lines_in_files(dir, fileEx, excludeDir)