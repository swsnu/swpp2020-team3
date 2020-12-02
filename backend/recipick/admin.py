from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserCreationForm
from .models import Ingredient, Recipe, Comment, Reply, ImageModel, User, ConnectRecipeIngredient
# Register your models here.

class UserCreateForm(UserCreationForm):
    class Meta:
        model = User
        fields = ('username', 'first_name' , 'last_name', 'following')


class MyUserAdmin(UserAdmin):
    add_form = UserCreateForm
    prepopulated_fields = {'username': ('first_name' , 'last_name')}

    add_fieldsets = UserAdmin.fieldsets+(
        (None, {
            'classes': ('wide',),
            'fields': ('first_name', 'last_name', 'username', 'password1', 'password2', 'following'),
        }),
    )

#admin.site.register(User, MyUserAdmin)
admin.site.register(User)
admin.site.register(Ingredient)
admin.site.register(Recipe)
admin.site.register(Reply)
admin.site.register(Comment)
admin.site.register(ImageModel)
admin.site.register(ConnectRecipeIngredient)