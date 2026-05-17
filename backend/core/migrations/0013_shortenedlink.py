from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0012_remove_newslettersubscription_whatsapp_number_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='ShortenedLink',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('short_code', models.SlugField(blank=True, db_index=True, max_length=24, unique=True)),
                ('destination_url', models.URLField(max_length=2000)),
                ('title', models.CharField(blank=True, max_length=255)),
                ('brand_name', models.CharField(blank=True, max_length=120)),
                ('store_name', models.CharField(blank=True, max_length=120)),
                ('coupon_code', models.CharField(blank=True, max_length=80)),
                ('link_type', models.CharField(choices=[('retailer', 'Retailer'), ('deal', 'Deal'), ('coupon', 'Coupon')], default='retailer', max_length=20)),
                ('click_count', models.PositiveIntegerField(default=0)),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
    ]
