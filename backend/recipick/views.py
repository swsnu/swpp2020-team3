from django.http import HttpResponse, HttpResponseNotAllowed, JsonResponse
from django.contrib.auth.models import User
from django.views.decorators.csrf import ensure_csrf_cookie
from .models import Ingredient, Comment, Recipe, Reply, ImageModel
from django.contrib import auth
import json
import datetime


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
        
def ingredient(request, id):
    if request.method == 'GET':
        ingredient = [igd for igd in Ingredient.objects.filter(id = id).values()]
        return JsonResponse(ingredient, safe=False, status=200)
    elif request.method == 'POST':
        try:
            body = request.body.decode()
            name = json.loads(body)['name']
            quantity = json.loads(body)['quantity']
            price = json.loads(body)['price']
            igd_type = json.loads(body)['igd_type']
            brand = json.loads(body)['brand']
            picture = request.FILES['file']
        except:
            HttpResponse(status = 400)
        user = request.user
        igd = Ingredient(name = name, author = user, quantity = quantity, price = price, price_normalized = int(price)/int(quantity),
        igd_type = igd_type, brand = brand, picture = picture)
        igd.save()
        response = {'id': igd.id, 'name': igd.name, 'quantity':igd.quantity, 'price':igd.price, 'igd_type':igd.igd_type, 'brand':igd.brand, 'picture':igd.picture}
        return JsonResponse(response, safe=False, status=200)
    elif request.method == 'PUT':
        try:
            body = request.body.decode()
            name = json.loads(body)['name']
            quantity = json.loads(body)['quantity']
            price = json.loads(body)['price']
            igd_type = json.loads(body)['igd_type']
            brand = json.loads(body)['brand']
            picture = request.FILES['file']
        except:
            HttpResponse(status = 400)
        igd = Ingredient.objects.filter(id=id)[0]
        igd.name = name
        igd.quantity = quantity
        igd.price = price
        igd.price_normalized = int(igd.price) / int(igd.quantity)
        igd.igd_type = igd_type
        igd.brand = brand
        igd.picture = picture
        igd.save()
        response = {'id': igd.id, 'name': igd.name, 'quantity':igd.quantity, 'price':igd.price, 'igd_type':igd.igd_type, 'brand':igd.brand, 'picture':igd.picture}
        return JsonResponse(response, safe=False, status=200)
    elif request.method == 'DELETE':
        try:
            igd = Ingredient.objects.get(id = id)
        except:
            return HttpResponse(status = 404)
        igd.delete()
        return HttpResponse(status=200)
    else:
        return HttpResponseNotAllowed(['GET','PUT'])
    
    
def recipe(request, id):
    if request.method == 'GET':
        recipe = [recipe for recipe in Recipe.objects.filter(id = id).values()]
        return JsonResponse(recipe, safe=False, status=200)
    elif request.method == 'PUT':
        try:
            body = request.body.decode()
            title = json.loads(body)['title']
            summary = json.loads(body)['summary']
            d_list = json.loads(body)['description']
            t_list = json.loads(body)['tag']
            rating = json.loads(body)['rating']
            likes = json.loads(body)['likes']
            edited = json.loads(body)['edited']
            recipe = Recipe.objects.create(title = title, summary = summary, description_list = d_list, tag_list = t_list,
            rating = rating, likes = likes, edited = edited)
            for f in request.FILES.getlist('file'):
                i = ImageModel.objects.create(img = f)
                recipe.photo_list.add(i)
            
            for i in json.loads(body)['ingredients']:
                igd = Ingredient.objects.create(name = i.name, quantity = i.quantity, price = i.price, price_normalized = int(i.price)/int(i.quantity),
                igd_type = i.igd_type, brand = i.brand, picture=i.picture)
                recipe.ingredient_list.add(igd)
        except:
            HttpResponse(status = 400)
        return HttpResponse(status = 200)
    elif request.method == 'POST':
        try:
            body = request.body.decode()
            title = json.loads(body)['title']
            summary = json.loads(body)['summary']
            d_list = json.loads(body)['description']
            t_list = json.loads(body)['tag']
            rating = json.loads(body)['rating']
            likes = json.loads(body)['likes']
            edited = json.loads(body)['edited']
            d = json.loads(body)['date']
            user = request.user
            date = datetime.datetime.strptime(d, "%Y-%m-%d").date()
            recipe = Recipe.objects.create(author = user, title = title, summary = summary, description_list = d_list, tag_list = t_list,
            rating = rating, likes = likes, edited = edited, created_date = date)
            for f in request.FILES.getlist('file'):
                i = ImageModel.objects.create(img = f)
                recipe.photo_list.add(i)
            
            for i in json.loads(body)['ingredients']:
                igd = Ingredient.objects.create(name = i.name, quantity = i.quantity, price = i.price, price_normalized = int(i.price)/int(i.quantity),
                igd_type = i.igd_type, brand = i.brand, picture=i.picture)
                recipe.ingredient_list.add(igd)
        except:
            HttpResponse(status = 400)
        return HttpResponse(status = 201)
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
        return HttpResponseNotAllowed(['GET','PUT','DELETE','POST'])

def recipe_comment(request, id):
    if request.method == 'GET':
        recipe = Recipe.objects.get(id= id)
        comment = [comment for comment in Comment.objects.filter(comment = recipe).values()]
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
