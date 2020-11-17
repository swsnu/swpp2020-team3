import django
from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Ingredient(models.Model):
    name = models.CharField(max_length=64)
    quantity = models.FloatField()                    # 구매 단위!! normalized price할 때 주로 사용되고, 유저에게 한 
                                                      # ingredient를 살 때 얼마 지불해야하는지 알리는 가격 (NOT quantity of ingredient the recipe needs)
    price = models.IntegerField()
    price_normalized = models.IntegerField(null=True) # 좀 더 엄밀한 나눗셈 필요
    igd_type = models.CharField(max_length=5) # 단위: 개 / g
    brand = models.CharField(max_length=64)
    picture = models.ImageField(null=True)

class ImageModel(models.Model):
    img = models.ImageField()
    description_index =  models.IntegerField(default=0)

class Recipe(models.Model):
    title = models.CharField(max_length=64)
    author = models.ForeignKey(
        User,
        on_delete = models.SET_NULL,
        null = True,
    )
    price = models.IntegerField()
    duration= models.IntegerField(default='0')
    thumbnail = models.ImageField(upload_to='blog/%Y/%m/%d', null=True, default='media/already.png')
    duration= models.IntegerField()

    photo_list = models.ManyToManyField(
        ImageModel,
    )
    description_list = models.JSONField(null=True)
    tag_list = models.JSONField(null=True)
    ingredient_list = models.ManyToManyField(
        Ingredient,
        through='ConnectRecipeIngredient'
    )
    category = models.TextField(null=True)
    rating = models.FloatField(null=True)
    likes = models.IntegerField(null=True)
    created_date = models.DateField(null=True)
    edited = models.BooleanField(null=True)
    summary = models.TextField(null=True)

class ConnectRecipeIngredient(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    amount = models.IntegerField(default=0)


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
