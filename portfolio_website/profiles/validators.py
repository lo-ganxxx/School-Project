from django.core.exceptions import ValidationError

def validate_file_size(value):
    filesize = value.size

    if filesize > (2 * 1024 * 1024): #2mb
        raise ValidationError("You cannot upload files larger than 2mb")
    else:
        return value