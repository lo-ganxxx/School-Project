from django.core.exceptions import ValidationError

def validate_file_size(value):
    filesize = value.size

    if filesize > (2 * 1024 * 1024): #2mb
        raise ValidationError("You cannot upload files larger than 2mb")
    else:
        return value
    
def validate_instagram_username(value):
    allowed_characters = set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_.")
    if not all(char in allowed_characters for char in value): #if not all of the characters in the value are characters in the allowed_characters string
        raise ValidationError("Invalid characters in Instagram username")