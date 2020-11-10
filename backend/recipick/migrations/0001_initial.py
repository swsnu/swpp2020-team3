from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField()),
                ('created_date', models.DateField()),
                ('edited', models.BooleanField()),
                ('author', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='ImageModel',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('img', models.ImageField(upload_to='')),
                ('description_index', models.IntegerField(default=0, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Ingredient',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=64)),
                ('quantity', models.FloatField()),
                ('price', models.IntegerField()),
                ('price_normalized', models.IntegerField(null=True)),
                ('igd_type', models.CharField(max_length=5)),
                ('brand', models.CharField(max_length=64)),
                ('picture', models.ImageField(null=True, upload_to='')),
            ],
        ),
        migrations.CreateModel(
            name='Reply',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField()),
                ('created_date', models.DateField()),
                ('edited', models.BooleanField()),
                ('author', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
                ('comment', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='recipick.comment')),
            ],
        ),
        migrations.CreateModel(
            name='Recipe',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=64)),
                ('summary', models.TextField(null=True)),
                ('description_list', models.JSONField(null=True)),
                ('tag_list', models.JSONField(null=True)),
                ('price', models.IntegerField()),
                ('duration', models.IntegerField(default=0)),
                ('thumbnail', models.ImageField(default='media/already.png', null=True, upload_to='blog/%Y/%m/%d')),
                ('rating', models.FloatField(null=True)),
                ('likes', models.IntegerField(null=True)),
                ('created_date', models.DateField(null=True)),
                ('category', models.TextField(null=True)),
                ('edited', models.BooleanField(null=True)),
                ('author', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
                ('ingredient_list', models.ManyToManyField(to='recipick.Ingredient')),
                ('photo_list', models.ManyToManyField(to='recipick.ImageModel')),
            ],
        ),
        migrations.AddField(
            model_name='comment',
            name='recipe',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='recipick.recipe'),
        ),
    ]
