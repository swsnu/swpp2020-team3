from django.urls import path
from recipick import views

# TODO: change url of ingredient_post and ingredient_list
urlpatterns = [
    path('signup/', views.signup, name='signup'),               # for /signup
    path('signin/', views.signin, name='signin'),               # for /signin
    path('recipepage/', views.recipe_page, name='recipe_page'), # for /search
    path('recipe/', views.recipe_post, name='recipe_post'),     # for /create

    path('random/', views.randomrecipe, name='randomrecipe'),
    path('recipe/<int:id>/comment/', views.recipe_comment, name='recipe_comment'),
    path('comment/<int:id>/reply/', views.comment_reply, name='comment_reply'),
    path('recipe/<int:id>/', views.recipe, name='recipe'),
    path('comment/<int:id>/', views.comment, name='comment'),
    path('reply/<int:id>/', views.reply, name='reply'),
    path('getuser/<int:id>', views.getuser, name='getuser'),
    path('ingredient/<int:id>', views.ingredient, name='ingredient'),
    path('image/', views.image, name='image'),
    path('ingredient', views.ingredient_post, name='ingredient_post'),
    path('ingredient/', views.ingredient_list, name='ingredient_list'),
    path('signout', views.signout, name='signout'),
    path('token', views.token, name='token'),
]