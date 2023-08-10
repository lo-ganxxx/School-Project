# Generated by Django 4.2 on 2023-08-08 12:54

from django.db import migrations, models
import profiles.validators


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0005_profile_instagram_link_profile_qualification_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='instagram_link',
            field=models.CharField(blank=True, max_length=30, null=True, validators=[profiles.validators.validate_instagram_username]),
        ),
    ]