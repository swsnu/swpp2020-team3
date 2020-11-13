from django.test import TestCase, Client
from django.core.files.base import ContentFile
from django.utils.encoding import force_bytes
from django.contrib.auth.models import User
from django.conf import settings
from django.contrib.auth import get_user_model
import json
from recipick.models import Ingredient, Comment, Recipe, Reply, ImageModel

from django.core.files.uploadedfile import SimpleUploadedFile
from io import BytesIO
from PIL import Image
import urllib
import os
import base64
from django.core.files import File
from django.core.files.storage import Storage
from django.core.files.images import ImageFile

def get_file(self, url):
    # pdb.set_trace()
    result = urllib.urlopen(url)
    fi = open(result[0])
    fi_name = os.path.basename(url)
    suf = SimpleUploadedFile(fi_name, result.read())
    return suf

def create_image(storage, filename, size=(100, 100), image_mode='RGB', image_format='PNG'):
    """
    Generate a test image, returning the filename that it was saved as.

    If ``storage`` is ``None``, the BytesIO containing the image data
    will be passed instead.
    """
    data = BytesIO()
    Image.new(image_mode, size).save(data, image_format)
    data.seek(0)
    if not storage:
        return data
    image_file = ContentFile(data.read())
    return storage.save(filename, image_file)


# Create your tests here.
class RecipickTestCase(TestCase):
    def setUp(self):
        self.client = Client(enforce_csrf_checks=True)
        response = self.client.post('/api/signup/', json.dumps({'username': 'chris', 'password': 'chris'}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 403)  # Request without csrf token returns 403 response
        
        response = self.client.get('/api/token')
        self.csrftoken = response.cookies['csrftoken'].value  # Get csrf token from cookie
        # Create dummy user
        User = get_user_model()
        self.user1 = User.objects.create_user(username='swpp', password='iluvswpp')


    def test_csrf(self):
        # By default, csrf checks are disabled in test client
        # To test csrf protection we enforce csrf checks here
        client = Client(enforce_csrf_checks=True)
        response = client.post('/api/signup', json.dumps({'username': 'chris', 'password': 'chris'}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 403)  # Request without csrf token returns 403 response

        response = client.get('/api/token')
        csrftoken = response.cookies['csrftoken'].value  # Get csrf token from cookie
        response = client.delete('/api/token', content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 405)

        response = client.post('/api/signup', json.dumps({'username': 'chris', 'password': 'chris'}),
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 201)  # Pass csrf protection
        response = client.delete('/api/signup', content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken) 

    def test_signin_out(self):
        client = Client(enforce_csrf_checks=True)
        response = client.get('/api/token')
        csrftoken = response.cookies['csrftoken'].value  # Get csrf token from cookie


        response = client.post('/api/signup', json.dumps({'username': 'chris', 'password': 'chris'}),
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 201)
        response = client.post('/api/signin', json.dumps({'username': 'chis', 'password': 'chris'}),
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 401)

        response = client.get('/api/token')
        csrftoken = response.cookies['csrftoken'].value  # Get csrf token from cookie
        response = client.post('/api/signin', json.dumps({'username': 'chris', 'password': 'chris'}),
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 204)

        response = client.get('/api/token')
        csrftoken = response.cookies['csrftoken'].value  # Get csrf token from cookie
        response = client.delete('/api/signin', content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 405)

        response = client.get('/api/signout',content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 204)
        response = client.delete('/api/signout', content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)

    def test_ingredient_post(self):
        client = Client(enforce_csrf_checks=True)
        response = client.get('/api/token')
        csrftoken = response.cookies['csrftoken'].value
        response = client.post('/api/signup', json.dumps({'username': 'chris', 'password': 'chris'}),
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        response = client.post('/api/signin', json.dumps({'username': 'chris', 'password': 'chris'}),
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)

        response = client.get('/api/token')
        csrftoken = response.cookies['csrftoken'].value
        igd_json = json.dumps({'name': 'first', 'quantity':1, 'price': 1000, 'igd_type': 'g', 'brand': 'CU'})
        response = client.post('/api/ingredient', data = { "json": igd_json, "file": ContentFile("new")}, 
                                HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 200)

        response = client.delete('/api/ingredient', HTTP_X_CSRFTOKEN=csrftoken)

        igd_json = json.dumps({'name': 'first', 'quantity':1, 'igd_type': 'g', 'brand': 'CU'})
        response = client.post('/api/ingredient', data = { "json": igd_json, "file": ContentFile("new")}, 
                                HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 400)
        response = client.put('/api/ingredient', data = { "json": igd_json, "file": ContentFile("new")}, 
                                HTTP_X_CSRFTOKEN=csrftoken)

    def test_recipe_post(self):
        client = self.client
        csrftoken = self.csrftoken
        # test unauthenticated user:
        rcp_json = json.dumps({'title': 'test_title', 'totalPrice': 100, 'duration': 100, 'thumbnail': 'img_thumbnail',
                                'descriptionList': '[step1, step2]', 'tagList': '[tag1, tag2]', 
                                'ingredientList': [{'name': 'first','price':1000, 'quantity':1, 'igd_type': 'g', 'brand': 'CU'}],
                                'prevList': ['img1_URL'], 'summary': 'test_summary', 'date': '2020-01-01'})
        response = client.post('/api/recipe/', rcp_json, content_type='application/json', 
                                HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 401)
        
        # authenticated
        client.login(username='swpp', password='iluvswpp')
        # test decode error
        rcp_json_false = json.dumps({'ti': 'test_title', 'totalPrice': 100, 'duration': 100, 'thumbnail': 'img_thumbnail',
                                'descriptionList': '[step1, step2]', 'tagList': '[tag1, tag2]'})
        response = client.post('/api/recipe/', rcp_json_false, content_type='application/json', 
                                HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 400)

        # test normal execution
        rcp_json = json.dumps({'title': 'test_title', 'totalPrice': 100, 'duration': 100, 'thumbnail': 'data:image/png;base64,nothingblablabla',
                                'descriptionList': '[step1, step2]', 'tagList': '[tag1, tag2]', 
                                'ingredientList': [{'name': 'first','price':1000, 'quantity':1, 'igd_type': 'g', 'brand': 'CU'}],
                                'prevList': ['data:image/png;base64,nothingblablabla', 'data:image/png;base64,nothingblablabla'], 'summary': 'test_summary', 'date': '2020-01-01'}, )
        Ingredient.objects.create(name= 'first', price =1000, quantity =1, igd_type = 'g', brand= 'CU')
        response = client.post('/api/recipe/', rcp_json, content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 201)

        # test other unallowed methods
        response = client.get('/api/recipe/')
        self.assertEqual(response.status_code, 405)

    def test_ingredient(self):
        client = Client(enforce_csrf_checks=True)
        response = client.get('/api/token')
        csrftoken = response.cookies['csrftoken'].value
        response = client.post('/api/signup', json.dumps({'username': 'chris', 'password': 'chris'}),
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        response = client.post('/api/signin', json.dumps({'username': 'chris', 'password': 'chris'}),
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)

        response = client.get('/api/token')
        csrftoken = response.cookies['csrftoken'].value
        igd_json = json.dumps({'name': 'first', 'quantity':1, 'price': 1000, 'igd_type': 'g', 'brand': 'CU'})
        response = client.post('/api/ingredient', data = { "json": igd_json, "file": ContentFile("new")}, 
                                HTTP_X_CSRFTOKEN=csrftoken)
        
        response = client.get('/api/ingredient/1', content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 200)
        response = client.delete('/api/ingredient/1',content_type='application/json',HTTP_X_CSRFTOKEN=csrftoken)
        response = client.delete('/api/ingredient/10', content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        response = client.post('/api/ingredient/10', content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)

    
    def test_recipe(self):
        client = Client(enforce_csrf_checks=True)
        response = client.get('/api/token')
        csrftoken = response.cookies['csrftoken'].value
        response = client.post('/api/signup', json.dumps({'username': 'chris', 'password': 'chris'}),
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        response = client.post('/api/signin', json.dumps({'username': 'chris', 'password': 'chris'}),
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        
        response = client.get('/api/token')
        csrftoken = response.cookies['csrftoken'].value
        rcp_json = json.dumps({'title': 'first', 'summary':'sum', 'description': '[qwr,qwt]', 'tag': '[rrt,qqq]', 'price': 1000, 'rating':4.3, 'edited': True, 'likes':5, 'date':'2020-10-08',
                                'ingredients': [{'name': 'first','price':1000, 'quantity':1, 'igd_type': 'g', 'brand': 'CU'}], 'img_idx_list': [0] })
        response = client.post('/api/recipe', data = { "json": rcp_json, "file": [ContentFile("new")], "igd_file": [ContentFile("igd")]}, 
                                HTTP_X_CSRFTOKEN=csrftoken)

        response = client.get('/api/recipe/1', content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 200)
        response = client.get('/api/token')
        csrftoken = response.cookies['csrftoken'].value
        response = client.delete('/api/recipe/1', content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 200)

        response = client.get('/api/token')
        csrftoken = response.cookies['csrftoken'].value
        rcp_json = json.dumps({'title': 'first', 'summay':'sum', 'description': '[qwr,qwt]', 'tag': '[rrt,qqq]', 'price': 1000, 'rating':4.3, 'edited': True, 'likes':5, 'date':'2020-10-08',
                                'ingredients': [{'name': 'first','price':1000, 'quantity':1, 'igd_type': 'g', 'brand': 'CU'}], 'img_idx_list': [0] })
        response = client.post('/api/recipe', data = { "json": rcp_json, "file": [ContentFile("new")], "igd_file": [ContentFile("igd")]}, 
                                HTTP_X_CSRFTOKEN=csrftoken)
        response = client.put('/api/recipe/1', content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        response = client.delete('/api/recipe/11', content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)

    
    def test_comment(self):
        client = Client(enforce_csrf_checks=True)
        response = client.get('/api/token')
        csrftoken = response.cookies['csrftoken'].value
        response = client.post('/api/signup', json.dumps({'username': 'chris', 'password': 'chris'}),
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        response = client.post('/api/signin', json.dumps({'username': 'chris', 'password': 'chris'}),
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        
        response = client.get('/api/token')
        csrftoken = response.cookies['csrftoken'].value
        rcp_json = json.dumps({'title': 'first', 'summary':'sum', 'description': '[qwr,qwt]', 'tag': '[rrt,qqq]', 'price': 1000, 'rating':4.3, 'edited': True, 'likes':5, 'date':'2020-10-08',
                                'ingredients': [{'name': 'first','price':1000, 'quantity':1, 'igd_type': 'g', 'brand': 'CU'}], 'img_idx_list': [0] })
        response = client.post('/api/recipe', data = { "json": rcp_json, "file": [ContentFile("new")], "igd_file": [ContentFile("igd")]}, 
                                HTTP_X_CSRFTOKEN=csrftoken)

        response = client.get('/api/token')
        csrftoken = response.cookies['csrftoken'].value
        response = client.post('/api/recipe/1/comment',json.dumps({'content': 'chris12452', 'edited': True, 'date':'2020-10-08'}),
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 201)
        response = client.put('/api/recipe/1/comment',json.dumps({'content': 'c12452', 'edited': True, 'date':'2020-10-08'}),
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        response = client.get('/api/recipe/1/comment')
        self.assertEqual(response.status_code, 200)
        response = client.get('/api/comment/1')
        self.assertEqual(response.status_code, 200)
        response = client.get('/api/token')
        csrftoken = response.cookies['csrftoken'].value
        response = client.put('/api/comment/1',json.dumps({'content': 'c12452', 'edited': True, 'date':'2020-10-08'}),
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 200)
        response = client.put('/api/comment/11',json.dumps({'content': 'c12452', 'edited': True, 'date':'2020-10-08'}),
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        response = client.delete('/api/comment/1',
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 200)
        response = client.delete('/api/comment/11',
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        response = client.post('/api/comment/1',json.dumps({'content': 'c12452', 'edited': True, 'date':'2020-10-08'}),
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        

    def test_reply(self):
        client = Client(enforce_csrf_checks=True)
        response = client.get('/api/token')
        csrftoken = response.cookies['csrftoken'].value
        response = client.post('/api/signup', json.dumps({'username': 'chris', 'password': 'chris'}),
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        response = client.post('/api/signin', json.dumps({'username': 'chris', 'password': 'chris'}),
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        
        response = client.get('/api/token')
        csrftoken = response.cookies['csrftoken'].value
        rcp_json = json.dumps({'title': 'first', 'summary':'sum', 'description': '[qwr,qwt]', 'tag': '[rrt,qqq]', 'price': 1000, 'rating':4.3, 'edited': True, 'likes':5, 'date':'2020-10-08',
                                'ingredients': [{'name': 'first','price':1000, 'quantity':1, 'igd_type': 'g', 'brand': 'CU'}], 'img_idx_list': [0] })
        response = client.post('/api/recipe', data = { "json": rcp_json, "file": [ContentFile("new")], "igd_file": [ContentFile("igd")]}, 
                                HTTP_X_CSRFTOKEN=csrftoken)

        response = client.get('/api/token')
        csrftoken = response.cookies['csrftoken'].value
        response = client.post('/api/recipe/1/comment',json.dumps({'content': 'chris12452', 'edited': True, 'date':'2020-10-08'}),
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 201)

        response = client.get('/api/token')
        csrftoken = response.cookies['csrftoken'].value
        response = client.post('/api/comment/1/reply',json.dumps({'content': 'chris12452', 'edited': True, 'date':'2020-10-08'}),
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 201)

        response = client.put('/api/comment/1/reply',json.dumps({'content': 'c12452', 'edited': True, 'date':'2020-10-08'}),
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        response = client.get('/api/comment/1/reply')
        self.assertEqual(response.status_code, 200)
        response = client.get('/api/reply/1')
        self.assertEqual(response.status_code, 200)
        response = client.get('/api/token')
        csrftoken = response.cookies['csrftoken'].value
        response = client.put('/api/reply/1',json.dumps({'content': 'c12452', 'edited': True, 'date':'2020-10-08'}),
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 200)
        response = client.put('/api/reply/11',json.dumps({'content': 'c12452', 'edited': True, 'date':'2020-10-08'}),
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        response = client.delete('/api/reply/1',
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 200)
        response = client.delete('/api/reply/11',
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        response = client.post('/api/reply/1',json.dumps({'content': 'c12452', 'edited': True, 'date':'2020-10-08'}),
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)


        