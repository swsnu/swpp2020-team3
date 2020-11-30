from selenium import webdriver
from bs4 import BeautifulSoup
import time
import os
import re
import sys
import json
# from urlparse import urlparse 
import urllib.request
from django.core.files import File
  #add imprt of content file wrapper
from django.core.files.base import ContentFile

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
import django
django.setup()

from recipick.models import Ingredient


def noBrandScraper():
    driver = webdriver.Chrome('./chromedriver')
    driver.implicitly_wait(3)
    driver.get("http://emart.ssg.com/specialStore/nobrand/sub.ssg?ctgId=6000032943")
    nobrand_page_source = ''
    for i in range(1, 5):
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(6)
        nobrand_page_source = nobrand_page_source + driver.page_source

    soup = BeautifulSoup(nobrand_page_source, 'html.parser')
        # products_selector = soup.find_all('ul', class_="grid_item_lst").find_all('li')
    products_selector = soup.find('ul', class_="grid_item_lst").find_all('li', class_='cunit_t232')
    totalSum = 0
    result_list= []
    for product in products_selector:
        totalSum = totalSum+1
        photoURL = product.find('img')['src'][2:]
        prodName = product.find('div', class_='title').find('a').find('em', class_='tx_ko').get_text()
        prodPrice = product.find('em', class_='ssg_price').get_text()
        # there are two options to get the quantity of an ingredient
        # 1. click and get price (총용량) (something like below)
        # the problem is that it's slow and emart website blocked too much page refreshes (which this code does)
            # detail_page_link = product.find('div', class_='thmb').find('a')['href']
            # driver.get(detail_page_link)
            # detail_page_source = driver.page_source
            # detail_soup = BeautifulSoup(detail_page_source, 'html.parser')
            # unparsed = detail_soup.find('p', class_="cdtl_txt_info hide_gl")
        # 2. parse the title (for numbers and the type)
        # has more possibilites of being incorrect
        # I chose 2 (because faster), but can totally change
        prodQuantity = 0    
        numbers = re.findall(r'\d+', prodName)
        # print(len(numbers))
        if(len(numbers) > 1): # handle cornercases # x * , ml, g, kg, 개입, 입, \ \(space),  15입(65ml*15), 70% 100g
            print(prodName)
        else:
            if(len(numbers) == 0):
                prodIngType = 'unKnown'
                prodQuantity = -1
            else:
                unparsed = prodName.split(numbers[0])
                prodName = unparsed[0]
                prodQuantity = numbers[0]
                prodIngType = unparsed[1]
            prodPrice = prodPrice.replace(',', '')
            photoURL = f"http://{photoURL}"
            prodPhoto = ContentFile(urllib.request.urlopen(photoURL).read(), name=f"{prodName}.jpeg")
            result_dict = {'name': prodName, 'quantity': prodQuantity, 'price': prodPrice, 'igd_type': prodIngType, 'brand': 'NoBrand', 'picture': prodPhoto}
            result_list.append(result_dict)
    print(totalSum)
    return result_list



if __name__=='__main__':
    # img_url = 'http://i.ytimg.com/vi/GPpN5YUNDeI/default.jpg'
    # name = urllib.parse(img_url)
    # print(name)
    args = (sys.argv)
    cnt = 0 
    result_list = noBrandScraper()
    for ing in result_list:
        if len(args) > 1 and cnt >= int(args[1]):
            print(f"finish scraping {args[1]} ingredients")
            break
        temp = Ingredient.objects.create(name=ing['name'], quantity=ing['quantity'], price=ing['price'],
                igd_type=ing['igd_type'], brand=ing['brand'], picture=ing['picture'], price_normalized=ing['price']/ing['quantity'])
        temp.save()


# CU: ##############

# driver.get("http://cu.bgfretail.com/product/product.do?category=product&depth2=4")
# web_element= driver.find_element_by_class_name("more")

# cu_page_source = driver.page_source
# soup = BeautifulSoup(cu_page_source, 'html.parser')
# products_selector = soup.find('div', class_='prodListWrap').find_all('li')
# i = 0
# print(len(products_selector))
# for product in products_selector:
#     print(i)
#     i = i+1
#     photo = product.find('div', class_='photo').find('img')['src']
#     prodName = product.find('p', class_='prodName').get_text()
#     prodPrice = product.find('p', class_='prodPrice').get_text()
#     print(photo)
#     print(prodName)
#     print(prodPrice)

##################
