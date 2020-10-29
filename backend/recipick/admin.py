from django.contrib import admin
from .models import Ingredient, Recipe, Comment, Reply
# Register your models here.

admin.site.register(Ingredient)
admin.site.register(Recipe)
admin.site.register(Reply)
admin.site.register(Comment)