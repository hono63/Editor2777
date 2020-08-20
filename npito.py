"""
Dialog utility
"""

import tkinter as tk
from tkinter import filedialog

def open_folder():
    path = filedialog.askdirectory()
    return path

folder = open_folder()
print(folder)
