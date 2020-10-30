from django.test import TestCase, Client
from django.core.files.base import ContentFile
import json

# Create your tests here.
class RecipickTestCase(TestCase):
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

    def test_recipe_post(self):
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
                                'ingredients': [{'name': 'first','price':1000, 'quantity':1, 'igd_type': 'g', 'brand': 'CU'}]})
        response = client.post('/api/recipe', data = { "json": rcp_json, "file": [ContentFile("new")], "igd_file": [ContentFile("igd")]}, 
                                HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 201)

        response = client.delete('/api/ingredient', HTTP_X_CSRFTOKEN=csrftoken)
        