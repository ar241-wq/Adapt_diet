"""
Image processing utilities using Pillow.
Handles resizing and compression for plan images.
"""
import os
from io import BytesIO
from PIL import Image
from django.core.files.base import ContentFile


def process_plan_image(image_field, max_width=800, quality=85):
    """
    Process an uploaded image:
    - Resize to max width while maintaining aspect ratio
    - Convert to RGB if necessary (for PNG with transparency)
    - Compress to JPEG format

    Args:
        image_field: Django ImageField or uploaded file
        max_width: Maximum width in pixels (default 800)
        quality: JPEG quality 1-100 (default 85)

    Returns:
        ContentFile: Processed image as Django ContentFile
    """
    # Open the image
    img = Image.open(image_field)

    # Convert to RGB if necessary (handles PNG with alpha channel)
    if img.mode in ('RGBA', 'P', 'LA'):
        # Create white background for transparent images
        background = Image.new('RGB', img.size, (255, 255, 255))
        if img.mode == 'P':
            img = img.convert('RGBA')
        background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
        img = background
    elif img.mode != 'RGB':
        img = img.convert('RGB')

    # Calculate new dimensions maintaining aspect ratio
    width, height = img.size
    if width > max_width:
        ratio = max_width / width
        new_height = int(height * ratio)
        img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)

    # Save to BytesIO buffer as JPEG
    buffer = BytesIO()
    img.save(buffer, format='JPEG', quality=quality, optimize=True)
    buffer.seek(0)

    # Generate new filename with .jpg extension
    original_name = os.path.splitext(image_field.name)[0]
    new_filename = f"{original_name}.jpg"

    return ContentFile(buffer.read(), name=new_filename)


def validate_image(uploaded_file, max_size_mb=5):
    """
    Validate uploaded image file.

    Args:
        uploaded_file: Django uploaded file
        max_size_mb: Maximum file size in megabytes

    Returns:
        tuple: (is_valid, error_message)
    """
    max_size_bytes = max_size_mb * 1024 * 1024

    # Check file size
    if uploaded_file.size > max_size_bytes:
        return False, f"File size exceeds {max_size_mb}MB limit"

    # Check file type
    allowed_types = ['image/jpeg', 'image/png', 'image/webp']
    if uploaded_file.content_type not in allowed_types:
        return False, f"Invalid file type. Allowed: {', '.join(allowed_types)}"

    # Try to open as image to verify it's valid
    try:
        img = Image.open(uploaded_file)
        img.verify()
        uploaded_file.seek(0)  # Reset file pointer after verify
    except Exception:
        return False, "Invalid image file"

    return True, None
