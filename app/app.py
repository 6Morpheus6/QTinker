"""
Main entry point for the application (Pinokio compatible).
"""
import os
import glob
import sys

# Add TensorRT to PATH dynamically
# Search for TensorRT* directory in multiple possible locations
current_dir = os.getcwd()
parent_dir = os.path.dirname(current_dir)  # Check parent directory too

# Search in current directory and parent directory
tensorrt_paths = (
    glob.glob(os.path.join(current_dir, "TensorRT*")) + 
    glob.glob(os.path.join(parent_dir, "TensorRT*")) +
    glob.glob(os.path.join(current_dir, "app", "TensorRT*"))  # Check app subdirectory
)

if tensorrt_paths:
    tensorrt_lib_path = os.path.join(tensorrt_paths[0], "lib")
    if os.path.isdir(tensorrt_lib_path):
        print(f"Found TensorRT lib path: {tensorrt_lib_path}")
        os.environ["PATH"] = tensorrt_lib_path + os.pathsep + os.environ["PATH"]
        # Also add to DLL search path for Python 3.8+ on Windows
        if hasattr(os, "add_dll_directory"):
            try:
                os.add_dll_directory(tensorrt_lib_path)
            except Exception as e:
                print(f"Failed to add DLL directory: {e}")
    else:
        print(f"Warning: TensorRT lib directory not found in {tensorrt_paths[0]}")
        # Try checking for other common lib directory names
        for path in tensorrt_paths:
            for lib_dir in ["lib", "bin", "windows"]:
                alt_lib_path = os.path.join(path, lib_dir)
                if os.path.isdir(alt_lib_path):
                    print(f"Found alternative TensorRT lib path: {alt_lib_path}")
                    os.environ["PATH"] = alt_lib_path + os.pathsep + os.environ["PATH"]
                    if hasattr(os, "add_dll_directory"):
                        try:
                            os.add_dll_directory(alt_lib_path)
                        except Exception as e:
                            print(f"Failed to add DLL directory: {e}")
                    break
else:
    print("Warning: TensorRT directory not found in current path.")
    print("Searched locations:")
    print(f"  - {current_dir}/TensorRT*")
    print(f"  - {parent_dir}/TensorRT*")
    print(f"  - {current_dir}/app/TensorRT*")

from gradio_ui import create_ui, custom_theme, css

if __name__ == "__main__":
    demo = create_ui()
    demo.launch(server_name="127.0.0.1", server_port=7860, share=False, theme=custom_theme, css=css)
