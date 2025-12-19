import os

def print_tree(start_path='.', prefix=''):
    try:
        items = sorted(os.listdir(start_path))
    except PermissionError:
        return  # skip folders without access

    # Remove node_modules from listing if present
    if "node_modules" in items:
        items.remove("node_modules")
    if ".git" in items:
        items.remove(".git")
    total = len(items)

    for index, name in enumerate(items):
        path = os.path.join(start_path, name)
        connector = "├── " if index < total - 1 else "└── "

        print(prefix + connector + name)

        if os.path.isdir(path):
            extension = "│   " if index < total - 1 else "    "
            print_tree(path, prefix + extension)

if __name__ == "__main__":
    print(".")
    print_tree(".")
