# Generated by Django 4.2 on 2023-08-08 12:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0008_alter_post_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='postcomment',
            name='content',
            field=models.TextField(default='previously null'),
            preserve_default=False,
        ),
    ]
