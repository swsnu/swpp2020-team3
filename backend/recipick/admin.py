from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Ingredient, Recipe, Comment, Reply, ImageModel, User, ConnectRecipeIngredient
# Register your models here.

admin.site.register(User)
admin.site.register(Ingredient)
admin.site.register(Recipe)
admin.site.register(Reply)
admin.site.register(Comment)
admin.site.register(ImageModel)
admin.site.register(ConnectRecipeIngredient)