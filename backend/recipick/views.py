from django.http import HttpResponse, HttpResponseNotAllowed, JsonResponse
from django.contrib.auth.models import User
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.csrf import csrf_exempt
from recipick.models import Ingredient, Comment, Recipe, Reply, ImageModel
from django.contrib import auth
import json
from json import JSONDecodeError
import datetime
import base64
from django.core.files.base import ContentFile
from random import *
import random

def getuser(request, id):
    if(request.method) == 'GET':
        user = [user for user in User.objects.filter(id = id).values()]
        return JsonResponse(user, safe=False, status=200)

def signup(request):
    if request.method == 'POST':
        req_data = json.loads(request.body.decode())
        username = req_data['username']
        password = req_data['password']
        user = User.objects.create_user(username = username, password = password)
        user.save()
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
                    'price': ing['price'], 'igd_type': ing['igd_type'], 'brand': ing['brand']})
        return JsonResponse(ingredientList, safe=False)
    else:
        return HttpResponseNotAllowed(['GET'])
    

def recipe_page(request):
    if request.method == 'GET':
        minCost = int(request.GET.get('minPrice'))
        maxCost = int(request.GET.get('maxPrice'))
        minTime = int(request.GET.get('minDuration'))
        maxTime = int(request.GET.get('maxDuration'))
        pageStart = int(request.GET.get('pageStart'))
        searchMode = request.GET.get('searchMode')
        searchWord = request.GET.get('searchWord')
        categories = []
        if request.GET.get('category1') == 'true':
            categories.append('American')
        if request.GET.get('category2') == 'true':
            categories.append('Korean')
        if request.GET.get('category3') == 'true':
            categories.append('Chinese')
        if request.GET.get('category4') == 'true':
            categories.append('Japanese')
        if request.GET.get('category5') == 'true':
            categories.append('ConvienceStore')
        if request.GET.get('category6') == 'true':
            categories.append('Dessert')

        listOfRecipes = Recipe.objects
        recipelist = listOfRecipes.filter(price__gte = minCost, price__lte = maxCost, duration__gte = minTime, duration__lte = maxTime, category__in = categories)
        if searchMode == 'uploaded-date':
            recipepage = recipelist.order_by('-created_date')[10*pageStart:(10*pageStart+51)]
        elif searchMode == 'likes':
            recipepage = recipelist.order_by('-likes')[10*pageStart:(10*pageStart+51)]
        elif searchMode == 'cost':
            recipepage = recipelist.order_by('price')[10*pageStart:(10*pageStart+51)]
        elif searchMode == 'rating':
            recipepage = recipelist.order_by('-rating')[10*pageStart:(10*pageStart+51)]
        else: # searchMode == 'relevance'
            recipepage = recipelist.order_by('-rating')[10*pageStart:(10*pageStart+51)]
            #vector = SearchVector('title')
            #query = SearchQuery(searchWord)
            #recipepage = recipelist.annotate(rank=SearchRank(vector,query)).order_by('-rank').filter(rank__gt = 0)[10*pageStart:(10*pageStart+51)]
        newrecipepage = []
        for recipe in recipepage:
            tn = recipe.thumbnail
            decoded_string = base64.b64encode(tn.read()).decode('utf-8')
            author = "none"
            if recipe.author:
                author = recipe.author.username
            newrecipe = {'id': recipe.id, 'title': recipe.title, 'author': author, 'price': recipe.price, 'rating': recipe.rating, 'likes': recipe.likes, 'thumbnail': decoded_string}
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
            t_list = body['tagList']
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
        description_list=d_list, tag_list=t_list, created_date=date, summary=summary)
        recipe.save()
        
        # ingredients
        ingList = Ingredient.objects

        for ing in ingredient_list:
            # make sure picture field isn't empty
            target = list(ingList.filter(name=ing['name'], brand=ing['brand'],price=ing['price'],igd_type=ing['igd_type']).values())
            # print(type(target.values()))
            # temp = Ingredient.objects.create(name=ing['name'], quantity=ing['quantity'], price=ing['price'],
            #     igd_type=ing['igd_type'], brand=ing['brand'])
            # print(type(temp))
            value = target[0]['id']
            #print(value)
            recipe.ingredient_list.add(value)
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

def recipe(request, id):
    if request.method == 'GET':
        recipe = Recipe.objects.get(id = id)
        p_list = recipe.photo_list
        thumbnail = base64.b64encode(recipe.thumbnail.read()).decode('utf-8')
        new_list = []
        for photo in p_list.all():
            encoded_string = base64.b64encode(photo.img.read())
            new_list.append(encoded_string.decode('utf-8'))
        igd = recipe.ingredient_list
        newigdlist = []
        for item in igd.all():
            newitem = {'name':item.name, 'quantity': item.quantity, 'price': item.price, 'price_normalized': item.price_normalized, 'igd_type': item.igd_type, 'brand': item.brand,}
            newigdphoto = base64.b64encode(item.picture.read())
            newitem['picture'] = newigdphoto.decode('utf-8')
            newigdlist.append(newitem)
        newrecipe = {
            'title': recipe.title,
            'price': recipe.price,
            'duration': recipe.duration,
            'photo_list': new_list,
            'thumbnail': thumbnail,
            'description_list': recipe.description_list,
            'tag_list': recipe.tag_list,
            'ingredient_list': newigdlist,
            'category': recipe.category,
            'rating': recipe.rating,
            'likes': recipe.likes,
            'created_date': recipe.created_date,
            'edited': recipe.edited,
            'summary': recipe.summary,
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



@ensure_csrf_cookie
def token(request):
    if request.method == 'GET':
        return HttpResponse(status=204)
    else:
        return HttpResponseNotAllowed(['GET'])

from .models import Ingredient, Comment, Recipe, Reply
