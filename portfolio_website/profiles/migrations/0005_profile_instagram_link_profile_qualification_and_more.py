# Generated by Django 4.2 on 2023-08-08 12:29

from django.db import migrations, models
import profiles.validators


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0004_profile_picture'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='instagram_link',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='profile',
            name='qualification',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='profile',
            name='picture',
            field=models.ImageField(blank=True, null=True, upload_to='profile_pics/', validators=[profiles.validators.validate_file_size]),
        ),
    ]
