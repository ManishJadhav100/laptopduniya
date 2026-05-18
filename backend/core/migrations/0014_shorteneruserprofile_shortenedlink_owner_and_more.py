from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('core', '0013_shortenedlink'),
    ]

    operations = [
        migrations.CreateModel(
            name='ShortenerUserProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('api_key', models.CharField(blank=True, db_index=True, max_length=64, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='shortener_profile', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['user__username'],
            },
        ),
        migrations.AddField(
            model_name='shortenedlink',
            name='last_visited_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='shortenedlink',
            name='owner',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='shortened_links', to=settings.AUTH_USER_MODEL),
        ),
    ]
