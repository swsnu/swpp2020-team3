from django.urls import path
from recipick import views

urlpatterns = [
    path('recipepage/', views.recipe_page, name='recipe_page'),
    path('recipe/<int:id>/comment', views.recipe_comment, name='recipe_comment'),
    path('comment/<int:id>/reply', views.comment_reply, name='comment_reply'),
    path('recipe/<int:id>', views.recipe, name='recipe'),
    path('comment/<int:id>', views.comment, name='comment'),
    path('reply/<int:id>', views.reply, name='reply'),
    path('signup/', views.signup, name='signup'),
    path('ingredient/<int:id>', views.ingredient, name='ingredient'),
    path('recipe/', views.recipe_post, name='recipe_post'),
    path('image/', views.image, name='image'),
    path('ingredient', views.ingredient_post, name='ingredient_post'),
    path('signin/', views.signin, name='signin'),
    path('signout', views.signout, name='signout'),
    path('token', views.token, name='token'),
]