from django.test import TestCase, Client
from django.core.files.base import ContentFile
from django.utils.encoding import force_bytes
from django.conf import settings
from django.contrib.auth import get_user_model
import json
from recipick.models import Ingredient, Comment, Recipe, Reply, ImageModel, User

from django.core.files.uploadedfile import SimpleUploadedFile
from io import BytesIO
from PIL import Image
import urllib.request
import os
import base64
from django.core.files import File
from django.core.files.storage import Storage
from django.core.files.images import ImageFile

def get_file(self, url):
    # pdb.set_trace()
    result = urllib.request.urlopen(url)
    fi = open(result[0])
    fi_name = os.path.basename(url)
    suf = SimpleUploadedFile(fi_name, result.read())
    return suf

def create_image(storage, filename, size=(100, 100), image_mode='RGB', image_format='PNG'):
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
        response = self.client.post('/api/signup/', json.dumps({'username': 'chris' , 
            'password': 'chris'}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 403)  # Request without csrf token returns 403 response
        response = self.client.get('/api/token')
        self.csrftoken = response.cookies['csrftoken'].value  # Get csrf token from cookie
        # Create dummy user
        User = get_user_model()
        self.user1 = User.objects.create_user(username='swpp', password='iluvswpp')
        self.user1.is_active = True
        self.user1.save()

    def test_csrf(self):
        # By default, csrf checks are disabled in test client
        # To test csrf protection we enforce csrf checks here
        client = Client(enforce_csrf_checks=True)
        response = client.post('/api/signup/', json.dumps({'username': 'chris', 
            'password': 'chris'}), content_type='application/json')
        self.assertEqual(response.status_code, 403)  
        # Request without csrf token returns 403 response

        response = client.get('/api/token')
        csrftoken = response.cookies['csrftoken'].value  
        # Get csrf token from cookie
        response = client.delete('/api/token', content_type='application/json', 
        HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 405)

        response = client.post(
            '/api/signup/', 
            json.dumps({'username': 'chris', 'password': 'chris', 'email': 'gongon.snu.ac.kr'}),
            content_type='application/json', 
            HTTP_X_CSRFTOKEN=csrftoken
        )
        self.assertEqual(response.status_code, 201)  # Pass csrf protection
        response = client.delete('/api/signup/', content_type='application/json', 
        HTTP_X_CSRFTOKEN=csrftoken) 

    def test_signin_out(self):
        client = Client(enforce_csrf_checks=True)
        response = client.get('/api/token')
        # Get csrf token from cookie
        csrftoken = response.cookies['csrftoken'].value  
        response = client.get('/api/curuser/', HTTP_X_CSRFTOKEN=csrftoken)
        
        # SIGNUP: valid signup
        response = client.post(
            '/api/signup/', 
            json.dumps({'username': 'chris', 'password': 'chris', 'email': 'gongon.snu.ac.kr'}),
            content_type='application/json', 
            HTTP_X_CSRFTOKEN=csrftoken
        )
        self.assertEqual(response.status_code, 201)

        # SIGNIN: valid signin
        response = client.get('/api/token')
        csrftoken = response.cookies['csrftoken'].value
        tempuser = User.objects.get(id=10)
        tempuser.is_active= True
        tempuser.save()
        response = client.post(
            '/api/signin/',
            json.dumps({'username': 'chris', 'password': 'chris'}),
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken
        )
        self.assertEqual(response.status_code, 204)
        response = client.get('/api/curuser/', HTTP_X_CSRFTOKEN=csrftoken)

        # SIGNIN: wrong id or password when signin
        response = client.get('/api/token')
        csrftoken = response.cookies['csrftoken'].value
        response = client.post(
            '/api/signin/', 
            json.dumps({'username': 'chis', 'password': 'chris'}),
            content_type='application/json', 
            HTTP_X_CSRFTOKEN=csrftoken
        )
        self.assertEqual(response.status_code, 401)
        
        # GETUSER: valid getuser
        response = client.get('/api/getuser/10/', HTTP_X_CSRFTOKEN=csrftoken)

        # SIGNIN: wrong request method
        response = client.delete(
            '/api/signin/', 
            content_type='application/json', 
            HTTP_X_CSRFTOKEN=csrftoken
        )
        self.assertEqual(response.status_code, 405)

        # SIGNOUT: valid signout
        response = client.get(
            '/api/signout/',
            content_type='application/json', 
            HTTP_X_CSRFTOKEN=csrftoken
        )
        self.assertEqual(response.status_code, 204)

        # SIGNOUT: wrong request method
        response = client.delete(
            '/api/signout/', 
            content_type='application/json', 
            HTTP_X_CSRFTOKEN=csrftoken
        )

        # CURUSER: valid curuser 
        response = client.get('/api/token')
        csrftoken = response.cookies['csrftoken'].value
        response = client.put(
            '/api/getuser/9/', 
            json.dumps({'password': 'cris'}),
            content_type='application/json', 
            HTTP_X_CSRFTOKEN=csrftoken
        )

    def test_ingredient_post(self):
        client = Client(enforce_csrf_checks=True)

        response = client.get('/api/token')
        csrftoken = response.cookies['csrftoken'].value
        igd_json = json.dumps({'name': 'first', 'quantity':1, 'price': 1000, 'igd_type': 'g', 'brand': 'CU'})
        response = client.post('/api/ingredient', data = { "json": igd_json, "file": ContentFile("new")}, 
                                HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 200)

        response = client.get('/api/token')
        csrftoken = response.cookies['csrftoken'].value
        igd_json = json.dumps({'name': 'first', 'quatity':1, 'price': 1000, 'igd_type': 'g', 'brand': 'CU'})
        response = client.post('/api/ingredient', data = { "json": igd_json, "file": ContentFile("new")}, 
                                HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 400)

        response = client.get('/api/ingredient', HTTP_X_CSRFTOKEN=csrftoken)

        resposne = client.get('/api/ingredient/', HTTP_X_CSRFTOKEN=csrftoken)
        resposne = client.delete('/api/ingredient/', HTTP_X_CSRFTOKEN=csrftoken)
        response = client.delete('/api/ingredient', HTTP_X_CSRFTOKEN=csrftoken)

        igd_json = json.dumps({'name': 'first', 'quantity':1, 'igd_type': 'g', 'brand': 'CU'})
        response = client.post('/api/ingredient', data = { "json": igd_json, "file": ContentFile("new")}, 
                                HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 400)
        response = client.put('/api/ingredient', data = { "json": igd_json, "file": ContentFile("new")}, 
                                HTTP_X_CSRFTOKEN=csrftoken)

    def test_recipe_page(self):
        client = self.client
        csrftoken = self.csrftoken
        print(client.login(username='swpp', password='iluvswpp'))
        rcp_json = json.dumps({'title': 'test_title', 'totalPrice': 100, 'duration': 100, 
                                'thumbnail': 'data:image/png;base64,nothingblablabla',
                                'descriptionList': '[step1, step2]', 'tagList': '[tag1, tag2]', 'category': 'American',
                                'ingredientList': [{'name': 'first','price':1000, 'amount':1, 'igd_type': 'g', 'brand': 'CU'}],
                                'prevList': ['data:image/png;base64,nothingblablabla', 'data:image/png;base64,nothingblablabla'], 
                                'summary': 'test_summary', 'date': '2020-01-01'}, )
        Ingredient.objects.create(name= 'first', price =1000, quantity =1, igd_type = 'g', brand= 'CU')
        response = client.post('/api/recipe/', rcp_json, content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 201)

        rp_json = {
            'American': 'true',
            'Korean': 'true',
            'Chinese': 'true',
            'Japanese': 'true',
            'ConvenienceStore': 'true',
            'Dessert': 'true',

            'minPrice' : 0,
            'maxPrice' : 100000,
            'minDuration' : 0,
            'maxDuration' : 100,
            'searchWord' : "",

            'pageStart' : 0,
            'pageNumber': 1,
            'searchMode' : "cost",
            'searchOptionsClicked' : 'false',
        }
        response = client.get('/api/recipepage/', rp_json, HTTP_X_CSRFTOKEN=csrftoken)

        rp_json = {
            'American': 'true',
            'Korean': 'true',
            'Chinese': 'true',
            'Japanese': 'true',
            'ConvenienceStore': 'true',
            'Dessert': 'true',

            'minPrice' : 0,
            'maxPrice' : 100000,
            'minDuration' : 0,
            'maxDuration' : 100,
            'searchWord' : "gon",

            'pageStart' : 0,
            'pageNumber': 1,
            'searchMode' : "cost",
            'searchOptionsClicked' : 'false',
        }
        response = client.get('/api/recipepage/', rp_json, HTTP_X_CSRFTOKEN=csrftoken)

        rp_json = {
            'American': 'true',
            'Korean': 'true',
            'Chinese': 'true',
            'Japanese': 'true',
            'ConvenienceStore': 'true',
            'Dessert': 'true',

            'minPrice' : 0,
            'maxPrice' : 100000,
            'minDuration' : 0,
            'maxDuration' : 100,
            'searchWord' : "gon",

            'pageStart' : 0,
            'pageNumber': 1,
            'searchMode' : "likes",
            'searchOptionsClicked' : 'false',
        }
        response = client.get('/api/recipepage/', rp_json, HTTP_X_CSRFTOKEN=csrftoken)

    def test_recipe_post(self):
        client = self.client
        csrftoken = self.csrftoken
        # test unauthenticated user:
        rcp_json = json.dumps({'title': 'test_title', 'totalPrice': 100, 'duration': 100, 
                                'thumbnail': 'img_thumbnail',
                                'descriptionList': '[step1, step2]', 'tagList': '[tag1, tag2]', 
                                'ingredientList': [{'name': 'first','price':1000, 'quantity':1, 
                                'igd_type': 'g', 'brand': 'CU'}],
                                'prevList': ['img1_URL'], 'summary': 'test_summary', 'date': '2020-01-01'})
        response = client.post('/api/recipe/', rcp_json, content_type='application/json', 
                                HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 401)
        
        # authenticated
        client.login(username='swpp', password='iluvswpp')
        # test decode error
        rcp_json_false = json.dumps({'ti': 'test_title', 'totalPrice': 100, 'duration': 100, 
                                'thumbnail': 'img_thumbnail',
                                'descriptionList': '[step1, step2]', 'tagList': '[tag1, tag2]'})
        response = client.post('/api/recipe/', rcp_json_false, content_type='application/json', 
                                HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 400)

        # test normal execution
        rcp_json = json.dumps({'title': 'test_title', 'totalPrice': 100, 'duration': 100, 
                                'thumbnail': 'data:image/png;base64,nothingblablabla',
                                'descriptionList': '[step1, step2]', 'tagList': '[tag1, tag2]', 'category': 'American',
                                'ingredientList': [{'name': 'first','price':1000, 'amount':1, 'igd_type': 'g', 'brand': 'CU'}],
                                'prevList': ['data:image/png;base64,nothingblablabla', 'data:image/png;base64,nothingblablabla'], 
                                'summary': 'test_summary', 'date': '2020-01-01'}, )
        Ingredient.objects.create(name= 'first', price =1000, quantity =1, igd_type = 'g', brand= 'CU')
        response = client.post('/api/recipe/', rcp_json, content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 201)

        response = client.get('/api/recipepage/', { 'category1': 'true', 'category2': 'true', 'category3': 'true', 
                                'category4': 'true', 'category5': 'true', 'category6': 'true',
                                'minPrice' : 0, 'maxPrice' : 100000, 'minDuration' : 0, 'maxDuration' : 1000, 
                                'searchWord' : "", 'pageStart' : 0, 'pageNumber': 1,
                                'searchMode' : "rating", 'searchOptionsClicked' : 'false'}, HTTP_X_CSRFTOKEN=csrftoken)

        response = client.get('/api/recipepage/', { 'category1': 'false', 'category2': 'false', 'category3': 'false', 
                                'category4': 'false', 'category5': 'false', 'category6': 'false',
                                'minPrice' : 0, 'maxPrice' : 100000, 'minDuration' : 0, 'maxDuration' : 1000, 
                                'searchWord' : "", 'pageStart' : 0, 'pageNumber': 1,
                                'searchMode' : "uploaded-date", 'searchOptionsClicked' : 'false'}, HTTP_X_CSRFTOKEN=csrftoken)

        response = client.get('/api/recipepage/', { 'category1': 'true', 'category2': 'true', 'category3': 'true', 
                                'category4': 'true', 'category5': 'true', 'category6': 'true',
                                'minPrice' : 0, 'maxPrice' : 100000, 'minDuration' : 0, 'maxDuration' : 1000, 
                                'searchWord' : "", 'pageStart' : 0, 'pageNumber': 1,
                                'searchMode' : "likes", 'searchOptionsClicked' : 'false'}, HTTP_X_CSRFTOKEN=csrftoken)
        response = client.get('/api/recipepage/', { 'category1': 'true', 'category2': 'true', 'category3': 'true', 
                                'category4': 'true', 'category5': 'true', 'category6': 'true',
                                'minPrice' : 0, 'maxPrice' : 100000, 'minDuration' : 0, 'maxDuration' : 1000, 
                                'searchWord' : "", 'pageStart' : 0, 'pageNumber': 1,
                                'searchMode' : "cost", 'searchOptionsClicked' : 'false'}, HTTP_X_CSRFTOKEN=csrftoken)

        Recipe.objects.create(title='test_title', price=100, duration=100, thumbnail='carrot.png',
                                description_list='[step1, step2]', category='American',
                                summary='test_summary')
        response = client.get('/api/recipepage/', { 'category1': 'true', 'category2': 'true', 'category3': 'true', 
                                'category4': 'true', 'category5': 'true', 'category6': 'true',
                                'minPrice' : 0, 'maxPrice' : 100000, 'minDuration' : 0, 'maxDuration' : 1000, 
                                'searchWord' : "", 'pageStart' : 0, 'pageNumber': 1,
                                'searchMode' : "price", 'searchOptionsClicked' : 'false'}, HTTP_X_CSRFTOKEN=csrftoken)

        # test other unallowed methods
        response = client.get('/api/recipe/')
        self.assertEqual(response.status_code, 405)


        rcp_json = json.dumps({'title': 'test_title', 'totalPrice': 100, 'duration': 100, 'thumbnail': 'data:image/png;base64,nothingblablabla',
                                'descriptionList': '[step1, step2]', 'tagList': '[tag1, tag2]', 'category': 'American',
                                'ingredientList': [{'name': 'first','price':1000, 'amount':1, 'igd_type': 'g', 'brand': 'CU'}],
                                'prevList': ['data:image/png;base64,nothingblablabla', 'data:image/png;base64,nothingblablabla'], 
                                'summary': 'test_summary', 'date': '2020-01-01'}, )
        Ingredient.objects.create(name= 'first', price =1000, quantity =1, igd_type = 'g', brand= 'CU')
        response = client.post('/api/recipe/', rcp_json, content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 201)
        response = client.get('/api/random/', HTTP_X_CSRFTOKEN=csrftoken)
        Recipe.objects.create(title='test_title', price=100, duration=100, thumbnail='carrot.png',
                                description_list='[step1, step2]', category='American',
                                summary='test_summary')
        Recipe.objects.create(title='test_title', price=100, duration=100, thumbnail='carrot.png',
                                description_list='[step1, step2]', category='American',
                                summary='test_summary')
        Recipe.objects.create(title='test_title', price=100, duration=100, thumbnail='carrot.png',
                                description_list='[step1, step2]', category='American',
                                summary='test_summary')
        Recipe.objects.create(title='test_title', price=100, duration=100, thumbnail='carrot.png',
                                description_list='[step1, step2]', category='American',
                                summary='test_summary')
        response = client.get('/api/random/', HTTP_X_CSRFTOKEN=csrftoken)
        response = client.delete('/api/recipe/3/', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 200)
        response = client.delete('/api/recipe/12/', HTTP_X_CSRFTOKEN=csrftoken)
        response = client.post('/api/recipe/13/', {'data': 'qwtq'}, HTTP_X_CSRFTOKEN=csrftoken)


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


    
    def test_comment(self):
        client = self.client
        csrftoken = self.csrftoken
        client.login(username='swpp', password='iluvswpp')

        rcp_json = json.dumps({'title': 'test_title', 'totalPrice': 100, 'duration': 100, 'thumbnail': 'data:image/png;base64,nothingblablabla',
                                'descriptionList': '[step1, step2]', 'tagList': '[tag1, tag2]', 'category': 'American',
                                'ingredientList': [{'name': 'first','price':1000, 'amount':1, 'igd_type': 'g', 'brand': 'CU'}],
                                'prevList': ['data:image/png;base64,nothingblablabla', 'data:image/png;base64,nothingblablabla'], 'summary': 'test_summary', 'date': '2020-01-01'}, )
        Ingredient.objects.create(name= 'first', price =1000, quantity =1, igd_type = 'g', brand= 'CU')
        response = client.post('/api/recipe/', rcp_json, content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 201)

        response = client.post('/api/recipe/1/comment/',json.dumps({'content': 'chris12452', 'edited': True, 'date':'2020-10-08'}),
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 201)
        response = client.put('/api/recipe/1/comment/',json.dumps({'content': 'c12452', 'edited': True, 'date':'2020-10-08'}),
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        response = client.get('/api/recipe/1/comment/')
        self.assertEqual(response.status_code, 200)
        response = client.get('/api/comment/1/')
        self.assertEqual(response.status_code, 200)
        response = client.get('/api/token')
        csrftoken = response.cookies['csrftoken'].value
        response = client.put('/api/comment/1/',json.dumps({'content': 'c12452', 'edited': True, 'date':'2020-10-08'}),
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 200)
        response = client.put('/api/comment/11/',json.dumps({'content': 'c12452', 'edited': True, 'date':'2020-10-08'}),
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        response = client.delete('/api/comment/1/',
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 200)
        response = client.delete('/api/comment/11/',
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        response = client.post('/api/comment/1/',json.dumps({'content': 'c12452', 'edited': True, 'date':'2020-10-08'}),
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        

    def test_reply(self):
        client = self.client
        csrftoken = self.csrftoken
        client.login(username='swpp', password='iluvswpp')

        rcp_json = json.dumps({'title': 'test_title', 'totalPrice': 100, 'duration': 100, 'thumbnail': 'data:image/png;base64,nothingblablabla',
                                'descriptionList': '[step1, step2]', 'tagList': '[tag1, tag2]', 'category': 'American',
                                'ingredientList': [{'name': 'first','price':1000, 'amount':1, 'igd_type': 'g', 'brand': 'CU'}],
                                'prevList': ['data:image/png;base64,nothingblablabla', 'data:image/png;base64,nothingblablabla'], 'summary': 'test_summary', 'date': '2020-01-01'}, )
        Ingredient.objects.create(name= 'first', price =1000, quantity =1, igd_type = 'g', brand= 'CU')
        response = client.post('/api/recipe/', rcp_json, content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 201)

        print(Recipe.objects.all().values())
        response = client.post('/api/recipe/10/comment/',json.dumps({'content': 'chris12452', 'edited': True, 'date':'2020-10-08'}),
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 201)

        response = client.get('/api/token')
        csrftoken = response.cookies['csrftoken'].value
        print(Comment.objects.all().values())
        response = client.post('/api/comment/2/reply/',json.dumps({'content': 'chris12452', 'edited': True, 'date':'2020-10-08'}),
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 201)
        
        response = client.get('/api/image/', HTTP_X_CSRFTOKEN=csrftoken)
        response = client.delete('/api/image/', HTTP_X_CSRFTOKEN=csrftoken)

        response = client.put('/api/comment/2/reply/',json.dumps({'content': 'c12452', 'edited': True, 'date':'2020-10-08'}),
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        response = client.get('/api/comment/2/reply/')
        self.assertEqual(response.status_code, 200)
        response = client.get('/api/reply/1/')
        self.assertEqual(response.status_code, 200)
        response = client.get('/api/token')
        csrftoken = response.cookies['csrftoken'].value
        response = client.put('/api/reply/1/',json.dumps({'content': 'c12452', 'edited': True, 'date':'2020-10-08'}),
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 200)
        response = client.put('/api/reply/11/',json.dumps({'content': 'c12452', 'edited': True, 'date':'2020-10-08'}),
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        response = client.delete('/api/reply/1/',
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 200)
        response = client.delete('/api/reply/11/',
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        response = client.post('/api/reply/1/',json.dumps({'content': 'c12452', 'edited': True, 'date':'2020-10-08'}),
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        response = client.delete('/api/recipe/10/', HTTP_X_CSRFTOKEN=csrftoken)


    def test_zrecipe(self):
        client = self.client
        csrftoken = self.csrftoken
        print(client.login(username='swpp', password='iluvswpp'))
        rcp_json = json.dumps({'title': 'test_title', 'totalPrice': 100, 'duration': 100, 'price': 100,
                                'thumbnail': 'data:image/png;base64,nothingblablabla',
                                'descriptionList': '[step1, step2]', 'tagList': '[tag1, tag2]', 'category': 'American',
                                'ingredientList': [{'name': 'first','price':1000, 'amount':1, 'igd_type': 'g', 'brand': 'CU', 'picture':'data:image/png;base64,nothingblablaqwrqbla'}],
                                'prevList': ['data:image/png;base64,nothingblablabla', 'data:image/png;base64,nothingblablabla'], 
                                'summary': 'test_summary', 'date': '2020-01-01'}, )
        Ingredient.objects.create(name= 'first', price =1000, quantity =1, igd_type = 'g', brand= 'CU')
        response = client.post('/api/recipe/', rcp_json, content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 201)
        
        cp_json = json.dumps({'title': 'test_title', 'duration': 100, 'price': 100,
                                'thumbnail': 'data:image/png;base64,nothingblablabla',
                                'description_list': '[step1, step2]', 'tagList': '[tag1, tag2]', 'category': 'American',
                                'ingredient_list': [{'name': 'first','price':1000, 'amount':1, 'igd_type': 'g', 'brand': 'CU', 'picture':'data:image/png;base64,nothingblablaqwrqbla'}],
                                'photo_list': ['data:image/png;base64,nothingblablabla', 'data:image/png;base64,nothingblablabla'], 
                                'summary': 'test_summary', 'date': '2020-01-01'}, )

        response = client.put('/api/recipe/11/', cp_json, content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 200)
        response = client.get('/api/recipe/11/', HTTP_X_CSRFTOKEN=csrftoken)

    def test_zrecipedelete(self):
        client = self.client
        csrftoken = self.csrftoken
        print(client.login(username='swpp', password='iluvswpp'))
        rcp_json = json.dumps({'title': 'test_title', 'totalPrice': 100, 'duration': 100, 'price': 100,
                                'thumbnail': 'data:image/png;base64,nothingblablabla',
                                'descriptionList': '[step1, step2]', 'tagList': '[tag1, tag2]', 'category': 'American',
                                'ingredientList': [{'name': 'first','price':1000, 'amount':1, 'igd_type': 'g', 'brand': 'CU', 'picture':'data:image/png;base64,nothingblablaqwrqbla'}],
                                'prevList': ['data:image/png;base64,nothingblablabla', 'data:image/png;base64,nothingblablabla'], 
                                'summary': 'test_summary', 'date': '2020-01-01'}, )
        Ingredient.objects.create(name= 'first', price =1000, quantity =1, igd_type = 'g', brand= 'CU')
        response = client.post('/api/recipe/', rcp_json, content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 201)
        
        response = client.post('/api/recipe/12/like/', HTTP_X_CSRFTOKEN=csrftoken)
        response = client.post('/api/recipe/12/removelike/', HTTP_X_CSRFTOKEN=csrftoken)
        response = client.post('/api/recipe/12/scrap/', HTTP_X_CSRFTOKEN=csrftoken)
        response = client.post('/api/recipe/12/removescrap/', HTTP_X_CSRFTOKEN=csrftoken)
        response = client.get('/api/hot/', HTTP_X_CSRFTOKEN=csrftoken)
