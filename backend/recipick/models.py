from django.db import models
from django.db.models import Model
from django.contrib.auth.models import User
# Create your models here.

class Ingredient(models.Model):
    name = models.CharField(max_length=64)
    quantity = models.FloatField()
    price = models.IntegerField()
    price_normalized = models.IntegerField() # 좀 더 엄밀한 나눗셈 필요
    igd_type = models.CharField(max_length=5) # 단위: 개 / g
    brand = models.CharField(max_length=64)
    picture = models.ImageField()

class ImageModel(models.Model):
    img = models.ImageField()
    desc_index = models.IntegerField()

class Recipe(models.Model):
    title = models.CharField(max_length=64)
    summary = models.TextField()
    author = models.ForeignKey(
        User,
        on_delete = models.SET_NULL,
        null = True,
    )

    # This should be foreign key for the one to many field. However, when we use foreign key, we can't implement list. How to handle this?
    photo_list = models.ManyToManyField(
        ImageModel,
    )
    
    description_list = models.TextField(null=True)
    tag_list = models.TextField(null=True)
    category = models.IntegerField(default=0)
    price = models.IntegerField()
    time = models.IntegerField(default=0)
    ingredient_list = models.ManyToManyField(
        Ingredient,
    )
    rating = models.FloatField()
    likes = models.IntegerField()
    created_date = models.DateField()
    edited = models.BooleanField()
    

class Comment(models.Model):
    recipe = models.ForeignKey(
        Recipe,
        on_delete = models.SET_NULL,
        null = True,
    )
    content = models.TextField()
    author = models.ForeignKey(
        User,
        on_delete = models.SET_NULL,
        null = True,
    )
    created_date = models.DateField()
    edited = models.BooleanField()

class Reply(models.Model):
    comment = models.ForeignKey(
        Comment,
        on_delete = models.SET_NULL,
        null = True,
    )
    content = models.TextField()
    author = models.ForeignKey(
        User,
        on_delete = models.SET_NULL,
        null = True,
    )
    created_date = models.DateField()
    edited = models.BooleanField()


