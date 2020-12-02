from django.http import HttpResponse, HttpResponseNotAllowed, JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.csrf import csrf_exempt
from recipick.models import Ingredient, Comment, Recipe, Reply, ImageModel, User, ConnectRecipeIngredient
from django.core.mail import EmailMessage
from django.contrib.sites.shortcuts import get_current_site
from django.core.exceptions import ValidationError
from django.shortcuts import redirect
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.encoding import force_bytes, force_text, DjangoUnicodeDecodeError
from django.contrib import auth
from django.views import View
from django.views.generic import TemplateView
from django.urls import reverse
from .utils import token_generator
from .forms import SignupForm
import logging
import jwt
import json
from json import JSONDecodeError
import datetime
import base64
from django.core.files.base import ContentFile
from random import *
from django.forms.models import model_to_dict
from django.db.models import Q
import random
from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank

def getuser(request, id):
    if(request.method) == 'GET':
        user_1 = User.objects.get(id = id)
        user_info = [user for user in User.objects.filter(id = id).values()]
        liked_recipes = [recipe for recipe in user_1.like.all()]
        recipe_basket = [recipe for recipe in user_1.scrap.all()]
        written_recipes = [recipe for recipe in Recipe.objects.filter(author = user_1)]

        newrecipes = []
        for recipe in liked_recipes:
            encoded_thumbnail = base64.b64encode(recipe.thumbnail.read())
            newrecipe = {'id': recipe.id, 'title': recipe.title, 'author': recipe.author.username, 'price': recipe.price, 'rating': recipe.rating, 'likes': recipe.likes, 'thumbnail': encoded_thumbnail.decode('utf-8')}
            newrecipes.append(newrecipe)
        liked_recipes = newrecipes

        newrecipes = []
        for recipe in recipe_basket:
            encoded_thumbnail = base64.b64encode(recipe.thumbnail.read())
            newrecipe = {'id': recipe.id, 'title': recipe.title, 'author': recipe.author.username, 'price': recipe.price, 'rating': recipe.rating, 'likes': recipe.likes, 'thumbnail': encoded_thumbnail.decode('utf-8')}
            newrecipes.append(newrecipe)
        recipe_basket = newrecipes

        newrecipes = []
        for recipe in written_recipes:
            encoded_thumbnail = base64.b64encode(recipe.thumbnail.read())
            newrecipe = {'id': recipe.id, 'title': recipe.title, 'author': recipe.author.username, 'price': recipe.price, 'rating': recipe.rating, 'likes': recipe.likes, 'thumbnail': encoded_thumbnail.decode('utf-8')}
            newrecipes.append(newrecipe)
        written_recipes = newrecipes

        follower = [user for user in user_1.follower.all().values()]
        following = [user for user in user_1.following.all().values()]
        user = {'user_info': user_info, 'liked_recipes': liked_recipes, 'recipe_basket': recipe_basket,
            'written_recipes': written_recipes, 'follower': follower, 'following': following}
        return JsonResponse(user, safe=False, status=200)
    elif(request.method) == 'PUT':
        body = json.loads(request.body.decode())
        print('whatif')
        print(body)
        user_1 = User.objects.get(id = id)
        user_1.set_password(body['password'])
        user_1.save()
        user_info = [user for user in User.objects.filter(id = id).values()]
        liked_recipes = [recipe for recipe in user_1.like.all().values()]
        recipe_basket = [recipe for recipe in user_1.scrap.all().values()]
        written_recipes = [recipe for recipe in Recipe.objects.filter(author = user_1)]
        newrecipes = []
        for recipe in written_recipes:
            encoded_thumbnail = base64.b64encode(recipe.thumbnail.read())
            newrecipe = {'id': recipe.id, 'title': recipe.title, 'author': recipe.author_id, 'price': recipe.price, 'rating': recipe.rating, 'likes': recipe.likes, 'thumbnail': encoded_thumbnail.decode('utf-8')}
            newrecipes.append(newrecipe)
        follower = [user for user in user_1.follower.all().values()]
        following = [user for user in user_1.following.all().values()]
        user = {'user_info': user_info, 'liked_recipes': liked_recipes, 'recipe_basket': recipe_basket,
            'written_recipes': newrecipes, 'follower': follower, 'following': following}
        print(user)
        return JsonResponse(user, safe=False, status=200)

def curuser(request):
    if(request.method) == 'GET':
        login_id = request.user.id
        if(not login_id):
            login_id=0
        return JsonResponse(login_id, safe=False, status=200)

def signup(request):
    if request.method == 'POST':
        req_data = json.loads(request.body.decode())
        username = req_data['username']
        password = req_data['password']
        email = req_data['email']
        user = User.objects.create_user(username = username, password = password)
        user.is_active = False
        user.save()
        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
        token = token_generator.make_token(user)
        domain = get_current_site(request).domain
        link = reverse('activate', kwargs={'uidb64': uidb64, 'token': token})
        activate_url = 'http://'+domain+link
        mail_subject = 'Activate your account'
        mail_body = 'Hi ' + user.username + \
            'Please use this link to verify your account\n' + activate_url
        mail = EmailMessage(
            mail_subject,
            mail_body,
            'swppsend@gmail.com',
            [email],
        )
        mail.send(fail_silently=False)
        return HttpResponse(status=201)
    else:
        return HttpResponseNotAllowed(['POST'])

def signin(request):
    if request.method == 'POST':
        req_data = json.loads(request.body.decode())
        username = req_data['username']
        password = req_data['password']
        user = auth.authenticate(request, username = username, password = password)
        if user is not None:
            auth.login(request, user)
            return HttpResponse(status=204)
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(['POST'])

def signout(request):
    if request.method == 'GET':
        auth.logout(request)
        return HttpResponse(status=204)
    else:
        return HttpResponseNotAllowed(['GET'])

def ingredient_post(request):
    if request.method == 'POST':
        try:
            body = json.loads(request.POST['json'])
            name = body["name"]
            quantity = body['quantity']
            price = body['price']
            igd_type = body['igd_type']
            brand = body['brand']
            picture = request.FILES['file']
        except Exception as e:
            return HttpResponse(status = 400)
        igd = Ingredient(name = name, quantity = quantity, price = price, price_normalized = int(price)/int(quantity),
        igd_type = igd_type, brand = brand, picture = picture)
        igd.save()
        response = {'id': igd.id, 'name': igd.name, 'quantity':igd.quantity, 'price':igd.price, 'igd_type':igd.igd_type, 'brand':igd.brand}
        return JsonResponse(response, safe=False, status=200)
    else:
        return HttpResponseNotAllowed(['POST'])
        
def ingredient(request, id):
    if request.method == 'GET':
        ingredient = [igd for igd in Ingredient.objects.filter(id = id).values()]
        return JsonResponse(ingredient, safe=False, status=200)
    elif request.method == 'DELETE':
        try:
            igd = Ingredient.objects.get(id = id)
        except:
            return HttpResponse(status = 404)
        igd.delete()
        return HttpResponse(status=200)
    else:
        return HttpResponseNotAllowed(['GET','DELETE'])

def ingredient_list(request):
    if request.method == 'GET':
        ingredient_list = Ingredient.objects.all().values()
        ingredientList = []
        for ing in ingredient_list:
            ingredientList.append({'name': ing['name'], 'quantity': ing['quantity'], 
                    'price': ing['price'], 'igd_type': ing['igd_type'], 'brand': ing['brand'], 'price_normalized': ing['price_normalized']})
        return JsonResponse(ingredientList, safe=False)
    else:
        return HttpResponseNotAllowed(['GET'])
    

def recipe_page(request):
    if request.method == 'GET':
        min_cost = int(request.GET.get('minPrice'))
        max_cost = int(request.GET.get('maxPrice'))
        min_time = int(request.GET.get('minDuration'))
        max_time = int(request.GET.get('maxDuration'))
        page_start = int(request.GET.get('pageStart'))
        search_mode = request.GET.get('searchMode')
        search_word = request.GET.get('searchWord')
        category_query = Q(category__contains = "dummy category")
        if request.GET.get('American') == 'true':
            category_query = category_query | Q(category__contains = "American")
        if request.GET.get('Korean') == 'true':
            category_query = category_query | Q(category__contains = "Korean")
        if request.GET.get('Chinese') == 'true':
            category_query = category_query | Q(category__contains = "Chinese")
        if request.GET.get('Japanese') == 'true':
            category_query = category_query | Q(category__contains = "Japanese")
        if request.GET.get('ConvenienceStore') == 'true':
            category_query = category_query | Q(category__contains = "ConvenienceStore")
        if request.GET.get('Dessert') == 'true':
            category_query = category_query | Q(category__contains = "Dessert")
        

        list_of_recipes = Recipe.objects
        vector = SearchVector('title')
        query = SearchQuery(search_word)
        if search_word:
            recipelist = list_of_recipes.annotate(rank=SearchRank(vector,query)).filter(
                category_query,
                price__gte = min_cost, price__lte = max_cost,
                duration__gte = min_time, duration__lte = max_time,
                rank__gt = 0
            )
            if search_mode == 'likes':
                recipepage = recipelist.order_by('-rank','-likes','price','-rating')[10*page_start:(10*page_start+51)]
            elif search_mode == 'cost':
                recipepage = recipelist.order_by('-rank','price','-likes','-rating')[10*page_start:(10*page_start+51)]
            elif search_mode == 'rating':
                recipepage = recipelist.order_by('-rank','-rating','price','-likes')[10*page_start:(10*page_start+51)]
            else: # search_mode == 'recommended'
                recipepage = recipelist.order_by('-rank','price','-likes','-rating')[10*page_start:(10*page_start+51)]
        else:
            recipelist = list_of_recipes.filter(
                category_query,
                price__gte = min_cost, price__lte = max_cost,
                duration__gte = min_time, duration__lte = max_time,
            )
            if search_mode == 'likes':
                recipepage = recipelist.order_by('-likes','price','-rating')[10*page_start:(10*page_start+51)]
            elif search_mode == 'cost':
                recipepage = recipelist.order_by('price','-likes','-rating')[10*page_start:(10*page_start+51)]
            elif search_mode == 'rating':
                recipepage = recipelist.order_by('-rating','price','-likes')[10*page_start:(10*page_start+51)]
            else: # search_mode == 'recommended'
                recipepage = recipelist.order_by('price','-likes','-rating')[10*page_start:(10*page_start+51)]
        newrecipepage = []
        for recipe in recipepage:
            tn = recipe.thumbnail
            decoded_string = base64.b64encode(tn.read()).decode('utf-8')
            author = "none"
            if recipe.author:
                author = recipe.author.username
            newrecipe = {
                'id': recipe.id, 'title': recipe.title,
                'author': author, 'price': recipe.price,
                'rating': recipe.rating, 'likes': recipe.likes,
                'thumbnail': decoded_string
            }
            newrecipepage.append(newrecipe)
        return JsonResponse(newrecipepage, safe=False, status=200)
    else:
        return HttpResponseNotAllowed(['GET'])
    
def image(request):
    if request.method == 'GET':
        try: # if bad request --> 400
            imgList = ImageModel.objects.all().values()
        except:
            return HttpResponse(status = 400)
        return HttpResponse(status = 200)
    else:
        return HttpResponseNotAllowed(['GET'])



def recipe_post(request):
    if request.method == 'POST': # only allowed method, else --> 405
        user = request.user
        if not user.is_authenticated: # not authenticated --> 401
            return HttpResponse(status=401)
        try: # bad request (decode error) --> 400
            body = json.loads(request.body.decode())
            title = body['title']
            price = body['totalPrice']   # normally should convert to int
            duration = body['duration']  # normally should convert to float
            thumbnail = body['thumbnail']
            d_list = body['descriptionList']
            t_list = body['category']
            #i_list = body['imageList']  
            ingredient_list = body['ingredientList']  
            p_list = body['prevList']   # right now works with prev. Maybe there is a better method?
            summary = body['summary']
            date = body['date']
        except (KeyError, JSONDecodeError) as e:
            return HttpResponse(status = 400)
        # thumbnail
        format, imgstr = thumbnail.split(';base64,')
        ext = format.split('/')[-1]
        data = ContentFile(base64.b64decode(imgstr), name='temp.' + ext)
        recipe = Recipe(author=user, title=title, price=price, duration=duration, thumbnail=data,
        description_list=d_list, category=t_list, created_date=date, summary=summary, rating=0, likes=0)
        recipe.save()
        
        # ingredients
        ingList = Ingredient.objects.all()

        for ing in ingredient_list:
            # make sure picture field isn't empty
            # normally should try except for decoding each ingredient
            target = Ingredient.objects.filter(name=ing['name'], brand=ing['brand'],price=ing['price'],igd_type=ing['igd_type'])
            # If custom made ingredient, create ingredient
            if len(target) == 0:
                temp = 0
                target[0] = Ingredient.objects.create(name=ing['name'], brand=ing['brand'], price=ing['price'], igd_type=ing['igd_type'], 
                picture=data, quantity=ing['quantity'], price_normalized=ing['price']/ing['quantity']) # made an ingredient with picture of thumbnail, should change this to an agreed upon image file
                print(target[0])
            connection = ConnectRecipeIngredient(recipe=recipe, ingredient=target[0], amount=ing['amount'])
            connection.save()
        recipe.save()

        # photo_list
        cnt = 0;
        for img_64 in p_list:
            format, imgstr = img_64.split(';base64,')
            ext = format.split('/')[-1]
            data = ContentFile(base64.b64decode(imgstr), name='temp.' + ext)
            new_img = ImageModel.objects.create(img=data, description_index=cnt)
            recipe.photo_list.add(new_img)
            cnt = cnt + 1
        recipe.save()
        return_id = {'id': recipe.id}
        return JsonResponse(return_id, status = 201)
    else:
        return HttpResponseNotAllowed(['POST'])

def hotrecipe(request):
    if request.method == 'GET':
        cnt = Recipe.objects.all().count()
        if cnt <= 4:
            recipes = [recipes for recipes in Recipe.objects.all()]
            newrecipes = []
            for recipe in recipes:
                encoded_thumbnail = base64.b64encode(recipe.thumbnail.read())
                newrecipe = {'id': recipe.id, 'title': recipe.title, 'thumbnail': encoded_thumbnail.decode('utf-8')}
                newrecipes.append(newrecipe)
            return JsonResponse(newrecipes, safe=False)
        else :
            recipes = [recipes for recipes in Recipe.objects.all()]
            s = sorted(recipes, key = lambda recipe: recipe.likes)
            newrecipes = []
            for n in range(1,5):
                recipe = s[n-1]
                encoded_thumbnail = base64.b64encode(recipe.thumbnail.read())
                newrecipe = {'id': recipe.id, 'title': recipe.title, 'thumbnail': encoded_thumbnail.decode('utf-8')}
                newrecipes.append(newrecipe)
            return JsonResponse(newrecipes, safe=False)

def randomrecipe(request):
     if request.method == 'GET':
        cnt = Recipe.objects.all().count()
        if cnt <= 4:
            recipes = [recipes for recipes in Recipe.objects.all()]
            newrecipes = []
            for recipe in recipes:
                encoded_thumbnail = base64.b64encode(recipe.thumbnail.read())
                newrecipe = {'id': recipe.id, 'title': recipe.title, 'thumbnail': encoded_thumbnail.decode('utf-8')}
                newrecipes.append(newrecipe)
            return JsonResponse(newrecipes, safe=False)
        else :
            recipes = [recipes for recipes in Recipe.objects.all()]
            s = random.sample(range(1,cnt), 4)
            newrecipes = []
            for n in s:
                recipe = recipes[n]
                encoded_thumbnail = base64.b64encode(recipe.thumbnail.read())
                newrecipe = {'id': recipe.id, 'title': recipe.title, 'thumbnail': encoded_thumbnail.decode('utf-8')}
                newrecipes.append(newrecipe)
            return JsonResponse(newrecipes, safe=False)

def recipe_like(request, id):
    if request.method == 'POST':
        user = request.user
        if not user.is_authenticated:
            return HttpResponse(status=401)
        recipe = Recipe.objects.get(id=id)
        recipe.liked_user.add(user)
        recipe.likes = recipe.likes+1
        recipe.save()
        return JsonResponse(user.id, safe=False, status=200)
    else:
        return HttpResponseNotAllowed(['POST'])

def recipe_removelike(request, id):
    if request.method == 'POST':
        user = request.user
        if not user.is_authenticated:
            return HttpResponse(status=401)
        recipe = Recipe.objects.get(id=id)
        recipe.liked_user.remove(user)
        recipe.likes = recipe.likes-1
        recipe.save()
        return JsonResponse(user.id, safe=False, status=200)
    else:
        return HttpResponseNotAllowed(['POST'])

def recipe_scrap(request, id):
    if request.method == 'POST':
        user = request.user
        if not user.is_authenticated:
            return HttpResponse(status=401)
        recipe = Recipe.objects.get(id=id)
        recipe.scrapped_user.add(user)
        recipe.save()
        return JsonResponse(user.id, safe=False, status=200)
    else:
        return HttpResponseNotAllowed(['POST'])

def recipe_removescrap(request, id):
    if request.method == 'POST':
        user = request.user
        if not user.is_authenticated:
            return HttpResponse(status=401)
        recipe = Recipe.objects.get(id=id)
        recipe.scrapped_user.remove(user)
        recipe.save()
        return JsonResponse(user.id, safe=False, status=200)
    else:
        return HttpResponseNotAllowed(['POST'])

def recipe(request, id):
    if request.method == 'GET':
        recipe = Recipe.objects.get(id = id)
        p_list = recipe.photo_list
        thumbnail = base64.b64encode(recipe.thumbnail.read()).decode('utf-8')
        liked_user = recipe.liked_user
        scrapped_user = recipe.scrapped_user
        new_list = []
        for photo in p_list.all():
            encoded_string = base64.b64encode(photo.img.read())
            new_list.append(encoded_string.decode('utf-8'))
        igd = recipe.ingredient_list
        newigdlist = []
        for item in igd.all():
            membership = ConnectRecipeIngredient.objects.get(recipe=recipe, ingredient=item)
            newitem = {'name':item.name, 'quantity': item.quantity, 'price': item.price, 'price_normalized': item.price_normalized, 
                        'igd_type': item.igd_type, 'brand': item.brand, 'amount': membership.amount}
            try:
                newigdphoto = base64.b64encode(item.picture.read())
            except:
                return HttpResponse(status = 400)
            newitem['picture'] = newigdphoto.decode('utf-8')
            newigdlist.append(newitem)
        newlikeduser = []
        for user in liked_user.all():
            newlikeduser.append(user.id)
        newscrappeduser = []
        for user in scrapped_user.all():
            newscrappeduser.append(user.id)
        newrecipe = {
            'id': recipe.id, 'title': recipe.title, 'price': recipe.price,
            'duration': recipe.duration, 'photo_list': new_list, 'thumbnail': thumbnail,
            'description_list': recipe.description_list, 'ingredient_list': newigdlist,
            'category': recipe.category, 'rating': recipe.rating, 'likes': recipe.likes,
            'created_date': recipe.created_date, 'edited': recipe.edited, 'summary': recipe.summary,
            'author': recipe.author.id, 'liked_user': newlikeduser, 'scrapped_user': newscrappeduser,
        }
        return JsonResponse(newrecipe, safe=False)
    elif request.method == 'DELETE':
        try:
            recipe = Recipe.objects.get(id = id)
        except:
            return HttpResponse(status = 404)
        comments = Comment.objects.all()
        replies = Reply.objects.all()
        for comment in comments:
            if comment.recipe == recipe:
                for reply in replies:
                    if reply.comment == comment:
                        reply.delete()
                comment.delete()
        recipe.delete()
        return HttpResponse(status = 200)
    elif request.method == 'PUT':
        user = request.user
        if not user.is_authenticated: # not authenticated --> 401
            return HttpResponse(status=401)
        try: 
            recipe = Recipe.objects.get(id = id)
        except:
            return HttpResponse(status = 404)
        if user.id != recipe.author_id: # non author --> 403
            return HttpResponse(status=403)
        try:
            body = json.loads(request.body.decode())
            title = body['title']
            price = body['price']   # normally should convert to int
            # duration = body['duration']  # normally should convert to float
            thumbnail = body['thumbnail']
            d_list = body['description_list']
            t_list = body['category']
            #i_list = body['imageList']  
            ingredient_list = body['ingredient_list']  
            p_list = body['photo_list']   # right now works with prev. Maybe there is a better method?
            summary = body['summary']
            # date = body['date'] ==> implement edited time   
        except Exception as e:
            print(e)
            print(1)
            return HttpResponse(status = 400)
        recipe.title = title
        recipe.price = price
        format, imgstr = thumbnail.split(';base64,')
        ext = format.split('/')[-1]
        data = ContentFile(base64.b64decode(imgstr), name='temp.' + ext)
        recipe.thumbnail.delete()
        recipe.thumbnail = data
        recipe.description_list = d_list
        recipe.category = t_list
        recipe.summary = summary
        # created_date = ? 
        # duration = ? 
        recipe.save()
        # ingredients: 
        ingList = Ingredient.objects.all()
        origin_ingredient_list = recipe.ingredient_list
        for ing in ingredient_list:
            # make sure picture field isn't empty
            # normally should try except for decoding each ingredient
            target = Ingredient.objects.filter(name=ing['name'], brand=ing['brand'],price=ing['price'],igd_type=ing['igd_type'])
            exist = 0
            for ingredient in origin_ingredient_list.iterator():
                if ingredient.id == target[0].id:
                    exist = 1
            if exist == 0:
                connection = ConnectRecipeIngredient(recipe=recipe, ingredient=target[0], amount=ing['amount'])
            else:
                connection = ConnectRecipeIngredient.objects.get(recipe=recipe,ingredient=target[0])
                connection.amount = ing['amount']
            connection.save()
        recipe.save()
        # photos for steps:
        cnt = 0
        new_photo_list = []
        for img_64 in p_list:
            format, imgstr = img_64.split(';base64,')
            ext = format.split('/')[-1]
            data = ContentFile(base64.b64decode(imgstr), name='temp.' + ext)
            new_img = ImageModel.objects.create(img=data, description_index=cnt)
            new_photo_list.append(new_img)
            cnt = cnt + 1
        recipe.photo_list.all().delete()
        recipe.photo_list.set(new_photo_list)
        liked_user = recipe.liked_user
        scrapped_user = recipe.scrapped_user
        newlikeduser = []
        for user in liked_user.all():
            newlikeduser.append(user.id)
        newscrappeduser = []
        for user in scrapped_user.all():
            newscrappeduser.append(user.id)
        newrecipe = {
            'id': recipe.id,
            'title': recipe.title,
            'price': recipe.price,
            'duration': recipe.duration,
            'photo_list': p_list,
            'thumbnail': thumbnail,
            'description_list': recipe.description_list,
            'ingredient_list': ingredient_list,
            'category': recipe.category,
            'rating': recipe.rating,
            'likes': recipe.likes,
            'created_date': recipe.created_date,
            'edited': recipe.edited,
            'summary': recipe.summary,
            'author': recipe.author.id,
            'liked_user': newlikeduser,
            'scrapped_user': newscrappeduser,
        }
        return JsonResponse(newrecipe, status = 200)
    else:
        return HttpResponseNotAllowed(['GET','PUT','DELETE'])

def recipe_comment(request, id):
    if request.method == 'GET':
        recipe = Recipe.objects.get(id= id)
        comment = [comment for comment in Comment.objects.filter(recipe = recipe).values()]
        return JsonResponse(comment, safe=False, status=200)
    elif request.method == 'POST':
        req_data = json.loads(request.body.decode())
        content = req_data['content']
        edited = req_data['edited']
        d = req_data['date']
        date = datetime.datetime.strptime(d, "%Y-%m-%d").date()
        author = request.user
        recipe = Recipe.objects.get(id= id)
        comment = Comment(recipe = recipe, content = content, author = author, edited = edited, created_date = date)
        comment.save()
        response_dict = {'id': comment.id, 'content': comment.content, 'author_id': comment.author_id, 'recipe_id': comment.recipe_id, 'edited': comment.edited, 'created_date': comment.created_date}
        return JsonResponse(response_dict, status=201, safe = False)
    else: 
        return HttpResponseNotAllowed(['GET', 'POST'])

def comment(request, id):
    if request.method == 'GET':
        comment = [comment for comment in Comment.objects.filter(id= id).values()]
        return JsonResponse(comment, safe=False, status=200)
    elif request.method == 'PUT':
        body = request.body.decode()
        content = json.loads(body)['content']
        edited = json.loads(body)['edited']
        comment = Comment.objects.filter(id= id)
        if not comment:
            return HttpResponse(status = 404)
        comment = comment[0]
        comment.content = content
        comment.edited = edited
        comment.save()
        response_dict = {'id': comment.id, 'content': comment.content, 'author_id': comment.author_id, 'recipe_id': comment.recipe_id, 'edited': comment.edited}
        return JsonResponse(response_dict, status=200, safe = False) 
    elif request.method == 'DELETE':
        try:
            comment = Comment.objects.get(id = id)
        except:
            return HttpResponse(status = 404)
        replies = Reply.objects.all()
        for reply in replies:
            if reply.comment == comment:
                reply.delete()
        comment.delete()
        return HttpResponse(status=200)
    else:
        return HttpResponseNotAllowed(['GET', 'PUT', 'DELETE'])

def comment_reply(request, id):
    if request.method == 'GET':
        comment = Comment.objects.get(id= id)
        reply = [reply for reply in Reply.objects.filter(comment = comment).values()]
        return JsonResponse(reply, safe=False, status=200)
    elif request.method == 'POST':
        req_data = json.loads(request.body.decode())
        content = req_data['content']
        edited = req_data['edited']
        d = req_data['date']
        date = datetime.datetime.strptime(d, "%Y-%m-%d").date()
        author = request.user
        comment = Comment.objects.get(id= id)
        reply = Reply(comment = comment, content = content, author = author, edited = edited, created_date = date)
        reply.save()
        response_dict = {'id': reply.id, 'content': reply.content, 'author_id': reply.author_id, 'comment_id': reply.comment_id, 'edited': reply.edited, 'created_date': reply.created_date}
        return JsonResponse(response_dict, status=201, safe = False)
    else: 
        return HttpResponseNotAllowed(['GET', 'POST'])

def reply(request, id):
    if request.method == 'GET':
        reply = [reply for reply in Reply.objects.filter(id= id).values()]
        return JsonResponse(reply, safe=False, status=200)
    elif request.method == 'PUT':
        body = request.body.decode()
        content = json.loads(body)['content']
        edited = json.loads(body)['edited']
        reply = Reply.objects.filter(id= id)
        if not reply:
            return HttpResponse(status = 404)
        reply = reply[0]
        reply.content = content
        reply.edited = edited
        reply.save()
        response_dict = {'id': reply.id, 'content': reply.content, 'author_id': reply.author_id, 'comment_id': reply.comment_id, 'edited': reply.edited}
        return JsonResponse(response_dict, status=200, safe = False) 
    elif request.method == 'DELETE':
        try:
            reply = Reply.objects.get(id = id)
        except:
            return HttpResponse(status = 404)
        reply.delete()
        return HttpResponse(status=200)
    else:
        return HttpResponseNotAllowed(['GET', 'PUT', 'DELETE'])

def activate(request, uidb64, token):
    try:
        uid = force_text(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except(TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None
    if user is not None and token_generator.check_token(user, token):
        user.is_active = True
        user.save()
        signin(request)
        # return redirect('home')
        return HttpResponse('Thank you for your email confirmation. Now you can login your account.')
    else:
        return HttpResponse('Activation link is invalid!')


@ensure_csrf_cookie
def token(request):
    if request.method == 'GET':
        return HttpResponse(status=204)
    else:
        return HttpResponseNotAllowed(['GET'])

from .models import Ingredient, Comment, Recipe, Reply
