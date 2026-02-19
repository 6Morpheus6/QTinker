"""
Main entry point for the application (Pinokio compatible).
"""
import os
import glob
import sys
import logging

# Suppress the specific warning from torch_tensorrt
# This is a cleaner way to handle noisy library warnings without disabling all logging
logging.getLogger("torch_tensorrt").setLevel(logging.ERROR)

from gradio_ui import create_ui, custom_theme, css

if __name__ == "__main__":
    demo = create_ui()
    demo.launch(server_name="127.0.0.1", server_port=7860, share=False, theme=custom_theme, css=css)
