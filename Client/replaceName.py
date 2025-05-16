import os

def rename_files_in_directory(directory):
    for root, dirs, files in os.walk(directory, topdown=False):
        # Rename files
        for filename in files:
            if " " in filename:
                new_filename = filename.replace(" ", "_")
                src = os.path.join(root, filename)
                dst = os.path.join(root, new_filename)
                print(f"Renaming file: {src} -> {dst}")
                try:
                    os.rename(src, dst)
                except Exception as e:
                    print(f"Failed to rename file '{src}': {e}")

        # Rename directories (processed after files)
        for dirname in dirs:
            if " " in dirname:
                new_dirname = dirname.replace(" ", "_")
                src_dir = os.path.join(root, dirname)
                dst_dir = os.path.join(root, new_dirname)
                print(f"Renaming directory: {src_dir} -> {dst_dir}")
                try:
                    os.rename(src_dir, dst_dir)
                except Exception as e:
                    print(f"Failed to rename directory '{src_dir}': {e}")

if __name__ == "__main__":
    # Set your dataset folder path here
    dataset_path = "./dataset"

    if not os.path.exists(dataset_path):
        print(f"Dataset path '{dataset_path}' does not exist!")
    else:
        rename_files_in_directory(dataset_path)
