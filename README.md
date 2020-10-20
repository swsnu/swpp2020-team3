# swpp2020-team3

# Project abstract

Recipick is a service that helps users to find recipes. And while we do recognize that there are many other web-services that recommend recipes based on categories, our service differs from them in that our recommendations are primarily based on budget. Just like some people would want some recipe ideas to lose/gain weight, we highly believe that many people would want to choose recipes based on money. Our website targets these people and offers them the unique budget-based recipe recommendation service. 
Our service aims to provide tight-on-budget people who want to make sure that they can eat the cheapest (or most extravagant) meals that they can find. Given a certain budget that you decide, we find you the best recipes out there that fits into the budget. You can also upload your personal recipes to share them with other people. 

# Customers

1. Those who live alone
2. Those who want to save up money on eating
3. Korean soliders...?
4. Busy people who want ideas for a quick meal

# Market competitors

![](https://github.com/swsnu/swpp2020-team3/blob/master/Photos/Market%20Competitors%20Analysis.png)

# User stories (features)

1. **Login**
  - Actor: User 
  - Preconditions: The user is already signed up (already has an account).
  - Scenario: 
    - The user wants to log in. 
    - Anywhere from where the user can access without having to log in, the user can click on the login button on the top to be redirected to the log in page.
    - The user inputs its credentials (id, password). Upon clicking on login button, the user is logged in if the credentials are correct and registered in our database. Else, an alert mentioning that the id/password is wrong.   
  

2. **Logout**
  - Actor: User
  - Preconditions: The user is already logged in.
  - Scenario: 
    - The user wants to log out. 
    - Anywhere from where the user can access logged in, the user can click on the logout button on the top to be redirected to the main page, logged out.  


3. **Sign Up**
  - Actor: User
  - Preconditions: None.
  - Scenario: 
     - The user wants to sign up. Anywhere from where the user can access without having to log in, the user can click on the sign up button on the top to be redirected to the signup page.
     - The user inputs its credentials including Name, Id, Password, Email for confirmation. Upon clicking on confirmation, an email will be sent for confirmation. The user will be able to successfully log in once the email has been confirmed.  
 

4. **Mainpage:**
  - Actor: Users
  - Feature: Search, Move between pages
  - Precondition: The user already logged in. After logged in, the page is 
  - Scenario: 
    1. Logged in, the user would want to search for new recipes, look at recommended recipes and click for more detail, go onto his/her own mypage, go onto the category list...  


5. **Price based search**
  - Actor: I am a customer who wants to search recipes based on price
  - Preconditions: None
  - Scenario: 
    - The user is on a page where he/she can access the search bar.
    - The user is given three search bars: one to type in the name of the menu he/she is looking for, one two input the minimum price limit, and another to input the maximum price limit. 
    - Upon clicking search, the user is shown a list of recipes that match the conditions above.
  - Acceptance test:
    - Input: "김치찌개", "2000"(원), "7000"(원).
    - Output: 0 or more recipes that contains "김치찌개" in their title, and whose price is between 2000~7000 원.  


6. **Get recipe's details**
  - Actor: User
  - Preconditions: Shown a list of recipes
  - Scenario: 
    - I searched a keyword (ex: 김치찌개) and was shown a list. 
    - I clicked on a specific category, and was shown a list.
    - I searched for a range of price, and was shown a list.
  - Exception:
    - If a user is watching a recipe detail page, and the author of the recipe deletes / edits the page, the page must be redirected to a not found page on the next page refresh.
  - Acceptance test:
    - When the user clicks on an image, or the title of the recipe the user wants to see the details of, the page should be redirected to this detail page.  


7. **View a list of recipes after search**
  - Actor: User
  - Preconditions : Logged in, clicked the recipe searched button
  - Scenario : 
    - I searched a keyword(+ possibly budgets and some tags)
    - List are shown based on those keywords and tags
    - I can change the sort method (ex) accuracy, RECIPICK recommendation ranking, Likes, etc
  - Exception:
  - Acceptance test:
    - Make a script that generates random selections of budget, categories and see if appropriate recipes are well recommended  


8. **Add a recipe**
  - Actor: User
  - Preconditions: Logged in
  - Scenario: 
    - I want to share my idea of a good, cheap or fast recipe
  - Exception:
    - The price of the ingredients are changed while the user is writing a recipe. 
  - Acceptance test: 
  - After the user clicks on “Confirm recipe”, the recipe must be added to the recipe database.
    - Example of recipe: { Name: "김치찌개 라면", Ingredients: ["CU - '김치찌개 라면' - 2000 - 2000", {"CU - '스펨' - 560 - 4000}], Instructions: ["File image", "Text for instructions."], Category: [Korean]}
    - All the details the user inputted must be saved. (Ex: Title: 김치찌개, Instructions: {...}..., must be saved).  


9. **Edit, delete a recipe**
  - Actor: A person who want to edit/delete recipe.
  - Preconditions: Logged in, shown a recipe detail which is made by the person.
  - Scenario1: 
    - I clicked the edit recipe button in recipe detail page.
    - Go to recipe edit page.
    - Revise content.
    - Click confirm button.
    - Recipe edited.
  - Scenario2:
    - I clicked the delete recipe button in recipe detail page.
    - Risk : Really delete? Are you sure?????
       - If I click yes, the recipe and its comments will be deleted.
       - If I click no, trying to delete will be canceled.
  - Acceptance Test:
    - I clicked the edit recipe button, it should go to the recipe edit page.
    - I changed the comment in the recipe edit page and click the confirm button, it should go to the recipe detail page and the content should be changed to what I put.
    - I clicked the delete recipe button -> reask : really delete?
       - case1: click confirm -> delete the recipe and go to the previous page of detail page.
       - case2: click cancel -> return to detail page.  


10. **Comment on recipe (Add, edit, delete comments)**
 - Actor: Users who want to add a comment, or edit/delete comments already written.
 - Preconditions: Must be logged in, clicked on article/detail page and has already written comments (for edit and delete).
 - Scenario 1(writing comments):
      - Locate the text area of the recipe detail page to write the comment.
      - Write the comment you want in that text area.
      - Click on the confirm button to submit your comment.
      - If you don't click on confirm and redirect to another page, your comment will disappear.
 - Scenario 2(edit/delete comment):
      - Among the comments, search the comments that you have written. 
      - Click the edit / delete button.
        - When you click on delete, there will be  pop up where you must confirm whether or not you will really delete.
        - When you click on edit, the comment will become editable. Click on confirm when you are done. You are always in the detail page. If you click on cancel while editing, the changes you made will be gone.  

11. **Like or/and scrap a recipe**
   - Actor: A person who wants to like or scrap the recipe.
   - Preconditions: Logged in, in recipe detail page.
   - Scenario1:
      - I clicked like button in the recipe detail page.
      - The number of likes increases.
   - Scenario2:
      - I clicked scrap button in the recipe detail page.
      - The number of scraps increases.
      - The recipe is scraped.
   - Acceptance Test:
      - If I click like button in the recipe detail page -> the number of likes should increase by 1.
      - If I click scrap button in the recipe detail page -> the number of scraps should increase by 1 -> I should be able to find the scrapped recipe in my page.  


12. **Follow a cook**
   - Actor: Users
   - Preconditions: I’m logged in, I want to follow this particular user I appreciate
   - Scenario:
      - I was searching around some recipes
      - I’ve found a user who uploads great recipes
      - I want to follow him/her
      - I clicked follow on him.her
      - Now I get alarms if he/she uploads recipes  


13. **Advanced search for category search**
   - Actor: user
   - Preconditions: none (the user doesn’t have to be logged in)
   - Scenario: 
      - the user would want to get the list of recipes that fit in the categories and include the keyword, price already typed in, or to be typed
   - Exception: 
   - Acceptance test: 
      - Should get the list of recipes when the user selects categories, enters keyword, price.  


16. **Add an ingredient when you can't find a certain ingredient in our DB**
   - Actor: User
   - Preconditions: 
      - The user must be logged in, and must be trying to add a recipe.
   - Scenario:
      - The user wants to add an ingredient to the recipe, but cannot find the ingredient in the DB.
   - Exceptions:
   - Acceptance test: 
      - After the user added an ingredient, price of the ingredient, both information must be saved for the recipe.
      - The added information must not be saved on the DB.  


17. **Calculate the estimated price of the recipe**
   - Actor: User
   - Preconditions: User is logged in, and is writing a recipe. The user already added all the ingredients to the recipe page.
   - Scenario:
      - The user can see the total price of the recipe at the bottom of the create-recipe page. The price will be calculated based on the ingredients the user previously added on the same page. The ingredients (among with its price) are added periodically from time to time, searched from websites.   


18. **Recommend similar (same ingredients, same category...) to the current recipe**
   - Actor: User
   - Preconditions: User clicked the recommended recipe and is in Recipe Detail page
   - Scenario: 
      - User is watching the recipe detail page
      - You can see the recommended recipes that include ingredients used in the current recipe you are watching.  
      - If you have some of the ingredients left after following the recipe you might move on to these recommended recipes   


19. **Add ingredients that you want.**
   - Actor: User who wants to request some ingredients that weren't in the create-recipe's page's ingredient list. 
   - Preconditions: The user must be logged in, writing a recipe in the create-recipe page.
   - Scenario: 
     - The user is writing a recipe, wants to add an ingredient which isn't in our "refrigerator" (database).
     - The user inputs the ingredient by typing in the name, price per unit, price of the whole package of the ingredient.
     - The user clicks on the confirm button to add this ingredient to the ingredient list.
     - When the user adds an ingredient, this is NOT added to the database (meaning it won't be there even if you search it).  
 

# UI details

## Total overview:
![](https://github.com/swsnu/swpp2020-team3/blob/master/Photos/TotalOverview.png)

## Main Page
<img src="https://github.com/swsnu/swpp2020-team3/blob/master/Photos/MainPageRedirection.jpg" width="500" height="800">

## Detail Page
<img src="https://github.com/swsnu/swpp2020-team3/blob/master/Photos/DetailPage_ListPage_Explained.jpg" width="500" height="800">

## Create Page
<img src="https://github.com/swsnu/swpp2020-team3/blob/master/Photos/CreatePageDetails.png" width="500" height="800">

## MyProfile
<img src="https://github.com/swsnu/swpp2020-team3/blob/master/Photos/MyProfile.png" width="500" height="800">
