#!/usr/bin/env python3
from PIL import Image, ImageDraw
import os

# DHGC green color
GREEN = (44, 95, 45)  # #2C5F2D

def create_icon(logo_path, output_path, size):
    """Create a circular app icon with logo on green background"""
    # Create a new solid green square
    icon = Image.new('RGBA', (size, size), GREEN + (255,))
    
    # Draw a solid green circle filling the entire canvas
    draw = ImageDraw.Draw(icon)
    draw.ellipse([0, 0, size-1, size-1], fill=GREEN + (255,), outline=GREEN + (255,))
    
    # Load and resize logo
    logo = Image.open(logo_path)
    
    # Calculate logo size (65% of icon size to ensure green border is visible)
    logo_size = int(size * 0.65)
    logo = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
    
    # Convert logo to RGBA if needed
    if logo.mode != 'RGBA':
        logo = logo.convert('RGBA')
    
    # Calculate position to center logo
    x = (size - logo_size) // 2
    y = (size - logo_size) // 2
    
    # Paste logo on icon with alpha channel
    icon.paste(logo, (x, y), logo)
    
    # Save with maximum quality
    icon.save(output_path, 'PNG', optimize=False)
    print(f"Created: {output_path}")

# Icon sizes for Android
sizes = {
    'mipmap-mdpi': 48,
    'mipmap-hdpi': 72,
    'mipmap-xhdpi': 96,
    'mipmap-xxhdpi': 144,
    'mipmap-xxxhdpi': 192
}

logo_path = '/Users/drob/Documents/DHGC/company_logo.png'
base_path = '/Users/drob/Documents/DHGC/android/app/src/main/res'

for folder, size in sizes.items():
    # Regular icon
    output_path = os.path.join(base_path, folder, 'ic_launcher.png')
    create_icon(logo_path, output_path, size)
    
    # Round icon
    output_path_round = os.path.join(base_path, folder, 'ic_launcher_round.png')
    create_icon(logo_path, output_path_round, size)

print("\nAll app icons created successfully!")
