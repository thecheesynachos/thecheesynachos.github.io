import os
import sys
import shutil 
from PIL import Image, ImageOps
from PIL.ExifTags import TAGS
from PIL import UnidentifiedImageError
# Attempt to import necessary HEIF opener (for .heic files)
from pillow_heif import register_heif_opener
register_heif_opener()

import exifread


# --- Configuration ---
# Set the JPEG compression quality (0-100). 
# 85 is usually a good balance between file size reduction and visual quality.
COMPRESSION_QUALITY = 50 

# --- Core Function to Process a Single Image ---

def rename_compress_and_convert_image(filepath, destination_dir):
    """
    Reads EXIF date, saves the image as a compressed JPEG with a date-based name 
    to the destination directory.
    
    Args:
        filepath (str): The full path to the original image file.
        destination_dir (str): The path to the folder where the renamed and converted copy will be saved.
    """
    
    if not os.path.exists(filepath) or not os.path.isfile(filepath):
        return

    original_filename = os.path.basename(filepath)
    
    try:
        
        # Open image file for reading (must be in binary mode)
        with open(filepath, "rb") as file_handle:
            exif_data = exifread.process_file(file_handle)
            # print(exif_data['EXIF DateTimeOriginal'])
        
        # 1. Open the image and get EXIF data
        img = Image.open(filepath)
        img = ImageOps.exif_transpose(img)
        # try:
        #     exif_data = img._getexif()
        # except AttributeError:
        #     exif_data = img.info["exif"]
        # except Exception:
        #     exif_data = None
            
        
        # --- EXIF Date Extraction (or Fallback) ---
        formatted_date = None
        
        if exif_data:
            # date_taken_tag_id = None
            # for tag_id, tag_name in TAGS.items():
            #     if tag_name == 'DateTimeOriginal':
            #         date_taken_tag_id = tag_id
            #         break
            # print(exif_data.decode('ascii'))
            # if date_taken_tag_id in exif_data:
            #     # Format: YYYY:MM:DD HH:MM:SS -> YYYY-MM-DD
            # date_time_str = exif_data[date_taken_tag_id]
            try:
                date_time_str = str(exif_data['EXIF DateTimeOriginal'])
            except KeyError:
                date_time_str = str(exif_data['EXIF DateTimeDigitized'])
            date_part = date_time_str.split(' ')[0]
            formatted_date = date_part.replace(':', '-')
        
        # Fallback: If no EXIF date is found, use the file modification date
        if not formatted_date:
            mod_time_timestamp = os.path.getmtime(filepath)
            # Use os.path.getmtime which is a timestamp, format it
            formatted_date = os.path.strftime("%Y-%m-%d_mod", os.localtime(mod_time_timestamp))
            print(f"  - Warning: No EXIF date found for {original_filename}. Using modification date: {formatted_date}")


        # 2. Prepare the new filename (ALWAYS .jpg extension)
        new_filename_base = formatted_date
        # --- KEY CHANGE: Use .jpg extension for output ---
        new_filepath = os.path.join(destination_dir, new_filename_base + ".jpg") 
        
        # 3. Handle potential filename collisions (add sequential number)
        counter = 1
        while os.path.exists(new_filepath):
            new_filename_base = f"{formatted_date}_{counter}"
            new_filepath = os.path.join(destination_dir, new_filename_base + ".jpg")
            counter += 1

        # 4. Save (Convert, Compress, and Rename) the file to the new location
        
        # Ensure image is in RGB mode before saving as JPEG (for transparency/color space issues)
        if img.mode in ('RGBA', 'P'):
            img = img.convert('RGB')
            
        # Use img.save() to perform the conversion, compression, and renaming
        img.save(
            new_filepath, 
            format='JPEG', # Explicitly save as JPEG
            quality=COMPRESSION_QUALITY,
            optimize=True # Optimize compression
        )
        
        # Copy original file timestamps to the new file
        shutil.copystat(filepath, new_filepath)

        # print(f"  - Converted/Compressed & Renamed: **{original_filename}** -> **{os.path.basename(new_filepath)}**")

    except UnidentifiedImageError:
        print(f"  - Error: File {original_filename} is not a recognizable image file. Skipping.")
    except Exception as e:
        print(f"  - Error processing {original_filename}: {type(e)} -- {e}")
    finally:
        if 'img' in locals():
            img.close()

# --- Main Logic to Iterate Through Folder ---

def process_folder(source_path, destination_path):
    """
    Iterates through a source folder, processes images, and saves them to the destination.
    """
    if not os.path.isdir(source_path):
        print(f"Error: Source folder not found at '{source_path}'")
        return

    # Create the destination folder if it doesn't exist
    if not os.path.exists(destination_path):
        os.makedirs(destination_path)
        print(f"Created new destination folder: **{destination_path}**")

    print(f"\n--- Starting image processing (Output format: JPEG, Quality={COMPRESSION_QUALITY}): '{source_path}' ---")
    
    # List of common image extensions
    image_extensions = ('.jpg', '.jpeg', '.png', '.tiff', '.heic', '.dng', '.raw', '.webp')
    
    count = 0
    
    for filename in os.listdir(source_path):
        # Skip the destination folder if it's inside the source folder
        if os.path.join(source_path, filename) == destination_path:
            continue
            
        if filename.lower().endswith(image_extensions):
            full_path = os.path.join(source_path, filename)
            rename_compress_and_convert_image(full_path, destination_path)
            count += 1
            
    if count == 0:
        print("--- No image files found or processed. ---")
    else:
        print(f"--- Finished. Processed {count} files. All outputs are compressed JPEGs in **{destination_path}**. ---")

# --- Execution and Argument Handling ---

if __name__ == "__main__":
    
    # # Handle command line arguments
    # if len(sys.argv) < 2:
    #     print("\nUsage: python script_name.py <source_folder_path> [destination_folder_path]")
        
    #     # --- Default/Hardcoded Paths ---
    #     SOURCE_DIR = "./photos_to_rename"
    #     DESTINATION_DIR = "./renamed_converted_output"
        
    #     print(f"\nUsing default paths: \nSource: {SOURCE_DIR}\nDestination: {DESTINATION_DIR}")
    #     target_source = SOURCE_DIR
    #     target_destination = DESTINATION_DIR
        
    # else:
    #     target_source = sys.argv[1]
        
    #     if len(sys.argv) > 2:
    #         target_destination = sys.argv[2]
    #     else:
    #         target_destination = os.path.join(target_source, "renamed_converted_output")
    #         print(f"Destination not specified. Using subfolder: **{target_destination}**")

    # # Final check before running
    # if os.path.abspath(target_source) == os.path.abspath(target_destination):
    #     print("Error: Source and destination folders cannot be the same. Please specify a separate destination folder.")
    #     sys.exit(1)

    target_source = './_gallery_processing'
    target_destination = './gallery'
    process_folder(target_source, target_destination)