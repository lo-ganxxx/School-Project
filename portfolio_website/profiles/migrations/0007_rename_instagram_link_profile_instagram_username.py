# Generated by Django 4.2 on 2023-08-08 12:56

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0006_alter_profile_instagram_link'),
    ]

    operations = [
        migrations.RenameField(
            model_name='profile',
            old_name='instagram_link',
            new_name='instagram_username',
        ),
    ]
