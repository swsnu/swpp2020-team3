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
    path('getuser/<int:id>', views.getuser, name='getuser'),

    path('recipe/', views.recipe_post, name='recipe_post'),                         # for /create
    path('recipepage/', views.recipe_page, name='recipe_page'),                     # for /search (get all recipes)
    path('recipe/<int:id>/', views.recipe, name='recipe'),
    path('recipe/<int:id>/comment/', views.recipe_comment, name='recipe_comment'),  # for posting a comment

    path('ingredient', views.ingredient_post, name='ingredient_post'),              # for posting an ingredient
    path('ingredient/<int:id>', views.ingredient, name='ingredient'),               # for getting, modifying, deleting an ingredient
    path('ingredient/', views.ingredient_list, name='ingredient_list'),             # for getting ingredient list

    path('comment/<int:id>/', views.comment, name='comment'),                       # for getting, modifying and deleting a comment
    path('comment/<int:id>/reply/', views.comment_reply, name='comment_reply'),     # for getting and posting a comment

    path('reply/<int:id>/', views.reply, name='reply'),                             # for getting, modifying and deleting a reply

    path('random/', views.randomrecipe, name='randomrecipe'),                       # for getting a radomrecipe (mainpage)
    path('image/', views.image, name='image'),                                      # for getting an image

    path('token', views.token, name='token'),
]