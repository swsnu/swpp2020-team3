# Document revision history
Rev 1.0 -- initial version <br/>

# System architecture
Major interfaces between components:
![](https://github.com/swsnu/swpp2020-team3/blob/master/Photos/Deployment%20plan.png)

## Models 
- Relational schema:
![ER DIAGRAM](https://github.com/swsnu/swpp2020-team3/blob/master/Photos/Backend_model.PNG)  

- The arrows represent the foreign-key relationship between the tables.  
- The "id" field, which is not represented in the models are the primary key of each table.  
- The following is the relationship between the tables: <br/>
  - Recipe --> Ingredient: many-to-many relationship <br/>
  - Recipe --> ImageModel: one-to-many relationship <br/>
  - Comment --> Recipe: one-to-one relationship  
  - Reply --> Comment: one-to-one relationship  
  - User --> Recipe: one-to-many relationship


## Views 
- UI for view design
![](https://github.com/swsnu/swpp2020-team3/blob/master/Photos/TotalOverview.png)
- Functionality and requirements for each page:
  1. `/signup`: Signup 
      - Sign up a new user
      - User inputs: 'name', 'id', 'email', 'password'.
      - Confirm for password and send verification to the email.
      - User will be automatically signed in after the signup process.
      - Upon verification, user can use the notification feature. (Get alerts via email...)
   
  2. `/login`: Log in 
      - Log in an already registered user
      - User inputs: 'id', 'password'.
      - If the credentials are authenticated, log in and redirect to `/main-page`
      - Else, alert the user that the credentials are false/unregistered and redirect to `/signup`
 
  3. `/main-page`: Main page 
      - Displays the 'recipe of the day'.
      - Displays list of recipes of each category.
      - [optional] user input: a keyword to search with (tags, title, author name...)
      - [optional] user input: price range in which the user wants the recipes to be
      - By clicking the "Create" button, the user is redirected to the `/create` page.
      - By clicking anywhere on a recipe (title, or image), the user is redirected to the corresponding `/recipe/:id` page.

  4. `/create` Create new recipe 
      - Allows the user to create a new recipe.
      - User input: 'recipe title', 'recipe cooking time', 
      - User selects: 'ingredients-type', 'ingredients-quantity'
      - [optional for each step added] Allows the user to add images for each step of the recipe. 
      - [mandatory for each step added] User must input explanations for each step added. 
      - By clicking on the "Add a new step", the user can add a new step (a pair of image-upload and explanation-space).
      - By clicking on the appropriate category buttons, the user can select which category the recipe will fit in. 
      - Displays the estimated price of the recipe based on the ingredients and quantities selected.
      - By clicking on the "Submit" button, the user can save a new recipe. The user will be redirected to the recipe detail page. 

  5. `/detail-page/:id` Display details of recipe 
      - Displays the details of the selected recipe.
      - The details enclose the recipe ingredients, recipe making steps, recipe-related images.
      - In the side, the users can view the comments. The comments bar floats as the user scrolls up and down the page. The user can look at all the comments by clicking on the comment pages.
      - The user can add a comment and edit, delete a comment that the user made. 

  6. `/recipe/:id/edit` Edit recipe details 
      - Allows the user to edit a user-written recipe.
      - Similar to the create page, except that the default values of all the editable components are the original recipe.
      - By clicking on the 'Submit' button, the user can save the changes made.
      - By clicking on the 'Cancel' button, the user can go back to the previous page visited.
      - By clicking on the 'Preview' button, the user can preview how his/her input will appear on the screen.
      - By clicking on the 'Delete' button, the user can delete the currently displayed recipe. The user will be redirected to the previous page.

  7. `/my-page` Display My page 
      - Allows the user to edit his/her personal information and set default values for the prices.
      - The user can also view the list of scrapped articles and liked articles.
      - The user edits his/her information by clicking on the 'edit' button of each section.
      - The user can switch between sections by clicking on the tabs on the right.

  8. `/search` Display list of recipes (search result) 
      - Displays a list of recipes (main image and explanation) that satisfy the conditions the user previously inputted.
      - Each recipe is clickable and should redirect to the corresponding detail page.
      - The user can view more recipes by clicking on the pages at the bottom of the page. 
      - The user can decide the order of sorting of recipes (sorted from min price to max price, highest rating to lowest rating...)

  9. `/meal-planner` Display the meal-planner page
      - Display a weekly planner that allows you to add recipes to each day and plan a meal schedule for the week.
      - You can add up to 10 meals per day.
      - Each recipe is clickable and should redirect to the corresponding detail page.
      - The user can add a recipe to each day by clicking on the + button.
      - Users can also add a recipe to a day by clicking on the + button in the detail-recipe page.

## Controller
![models-view-controller](https://github.com/swsnu/swpp2020-team3/blob/master/Photos/models.png) 
   
- The above diagram represents the model-view-controller relationship of the website.  
- What is written above the arrow represents the data that the user sends to the server.   
- What is written below is the data that the server sends back to the user along with a HTTP response.
- What is colored in blue are those that are implemented. (Will remove at deployment)

# Design details

## Frontend Design
### Frontend components
- Containers, components and actioncreators
![Frontend Components](https://github.com/swsnu/swpp2020-team3/blob/master/Photos/Frontend_component.png)

### Frontend algorithms
### 1. Components

#### 1. Sign up <br/>
  - onClickSubmit:   
 call backend sign up api and make a new user. If successful, redirect to main page.

#### 2. Log In
  -  onClickSubmit:   
call backend sign in api. If authenticated successfully, change state accordingly and redirect to main page. If not, alert!

#### 3. Create Page
* submitHandler:   
Create a new recipe. Send create-recipe data to server to update the server database. Redirect to newly created recipe page.
* addStepHandler:  
Add a new step in Create Page. New Description(Text) and Image field created.
* deleteStepHandler:
Delete an added step in Create Page. Text and image field are removed.
* addSelectedIngredientHandler:   
Search the typed ingredient in the server database and show the result. The user select the ingredient shown. The total price should reflect the change.
* deleteSelectedIngredientHandler:
Delete the added ingredient. The total price should reflect the change.
* addIngredientQuantity:
Type the quantity needed for each ingredient added. The total price should reflect the change.
* onClickChangeColor:
Add and remove the tags for each recipe. The button will change colors: a darker shade for selected, and a lighter shade for deselected.
* inputHandler:
Allow user to type in description for each step.
* imageHandler:
Allow user to upload image for each step.
* thumbnailHandler:
Allow user to upload image for the thumbnail of the recipe.

#### 4. Main Page
* toCreateHandler:   
Redirect to create recipe page.

#### 5. List Page
* clickCategoryHandler:   
You can choose category in the list page. Choose multiple category and confirm search, you get sorted result of your query. 
* clickOptionsHandler:
Display the search modes.
* clickSearchModeHandler :   
Choose a search mode that determines the order of display of recipes.
* checkInputHandler:
Check the input keyword for the search, and see if there should be any default values.
* clickSearchHandler:   
Confirm all search options and show corresponding result
* clickRecipeHandler:    
Redirect to corresponding recipe detail page.
* clickPagePreviousHandler:      
Move to previous page block
* clickPageNumberHandler:   
Move to clicked page
* clickPageNextHandler:  
Move to next page block

#### 6. Detail Page -- Comments
* onClickCreateCommentButton:  
Create a new comment
* onClickEditCommentButton:  
Edit a comment
* onClickDeleteCommentButton:  
Delete a chosen comment 
* onClickRatingConfirmButton:  
Confirm your rating of the recipe
* onClickCommentPageNumber:  
Move to clicked comment page
* onClickCreateReplyButton:  
Create a reply(comment of comment)
* onClickEditReplyButton:  
Edit a chosen reply
* onClickDeleteReplyButton:  
Delete a chosen reply

#### 7. My Page
* onClickChangeImageButton:  
Change the profile image
* onClickTabList:   
There are list of tabs in my-page (My-profile, liked recipes, settings, Scrapped recipes) Move to corresponding tab by clicking.
* onClickLikedRecipeImage:  
Redirect to corresponding recipe detail page
* onClickSettingConfirmButton:  
Confirm the changes in the setting tab.


### 2. Sub-Components
#### Header
* onClickLogo:  
Redirect to main-page
* onClickCategory:  
Redirect to list-page of corresponding category
* onClickLogoutButton:  
Call backend api logout and redirect to main-page
* onClickLoginButton:  
Call backend api login and redirect to main-page
* onClickSignupButton:  
Redirect to signup page
* onClickCreateButton:  
Redirect to Create page
* onClickSearchConfirm:  
Redirect to list page with corresponding search query

### 3. Services
#### 1. user-service
+ sign_up : Call backend sign_up api, return result 
+ sign_in : Call backend sign_in api, return result  
+ sign_out : Call backend sign_out api, return result 
+ get_user_by_id : Call backend User api, return user
+ post_liked_recipe : Call backend post recipe api, return result
+ delete_liked_recipe : Call backend delete recipe api, return result 
+ post_setting_price  : Call backend post User api, return result (set user default price)
+ edit_setting_price  : Call backend post User api, return result
+ get_liked_recipe  : Call backend get recipe api, return recipe
+ get_setting_price  : Call backend get User api, return user default price

#### 2. recipe-service
+ post_recipe, comment, reply : Call backend api (post the data), return result
+ edit_recipe, comment, reply : Call backend api (edit the data), return result
+ delete_recipe, comment, reply : Call backend api (delete the data), return result
+ get_recipe, comment, reply : Call backend api, return recipe/comment/reply

#### 3. management-service
+ post_ingredient : Call backend api (post the data), return result
+ edit_ingredient : Call backend api (edit the data), return result
+ delete_ingredient : Call backend api (delete the data), return result
+ get_ingredient : Call backend api, return ingredient
### Frontend relations
- Relation between components
![Frontend Relation Schema](https://github.com/swsnu/swpp2020-team3/blob/master/Photos/Frontend_Relation_Schema.png)


## Backend Design
- Detailed specifications of API

| Model | API | GET | POST | PUT | DELETE |
| ------------- | ------------- | ------------- | ------------- | ------------- | ------------- |
| User | /signup | X | Create new user  | X | X |
|  | /signin | X | Log in | X | X |
|  | /signout | Log out  | X | X | X |
|  | /user/:id | Get specific user | X | X | X |
| Recipe | /recipe | Get recipes | Post recipe | X | X |
|  | /recipe/:id | Get specified recipe | X | Modify specified recipe | Delete specified recipe |
|  | /recipe/:id/comment | Get comments of specified recipe | Post comment to specified recipe | X | X |
| Ingredient | /ingredient | X | Post ingredient  | X | X |
|  | /ingredient/:id | Get specified ingredient | X | Modify specified ingredient | Delete specified ingredient |
| Comment | /comment/:id | Get specified comment | X | Modify specified comment | Delete specified comment |
|  | /comment/:id/reply | Get replies of specified comment | Post reply to specified comment | X | X |
| Reply | /reply/:id | Get specified reply | X | Modify specified reply | Delete specified reply |


# Implementation plan (tentative)

| Feature | Difficulties (1~5) | Times (days) | Sprint | Person | Challenge |
| ------------- | ------------- | ------------- | ------------- | ------------- | ------------- |
| Sign up | 1 | 1| 2 | (김현수) | |
| Main page | 1 | 1 | 2 | 권지웅 | |
| Recipe list | 1 | 1 | 2 | 김훈 | |
| Create recipe | 1 |1| 2 | 김현수 | | 
| Comment | 2 | 4 | 3 | (김기덕) | |
| Recipe detail | 1 |1| 2|김기덕 | | 
| Retrieve ingredients | 3 | 5 | 3 | (김훈, 김현수) | |
| Seed the database | 1 | 2 | 3 | (김기덕, 권지웅) | |
| (ML) Recommend article | 4 | 6 | (all?) | The frontend and backend must work well |
| Board implementation | 3 | 7 | 3 | (권지웅, 김현수) | |
| Alert feature | 3 | 6 | 3 | (김기덕, 김훈) | |
| Testing | 2 | 10 | all | all | In particular, at the end of each sprint, we will assure min 90% coverage |
| Design | 2 | 10 | 4 | (권지웅 +alpha) | |
| Additional features | ? | 10 | 5 | - | adding login via social media,  |

Above is a table for the implementation plan of our project.<br/>
The assignment of the members to the task is tentative and is subject to change. The number of tasks and even some tasks' content can also be modified during future sprints. <br/>
The tasks are also somewhat ordered in matter of dependencies, i.e. those who come first should be implemented in order to implement the latter ones. <br/>
We plan on finishing our basic frontend, backend implementation [up to the (ML) part in the table] until the mid-presentation.

### Possible risks:
- Crawling for ingredients could be harder than expected. <br/>
We would have to consider many things, for example: don't retrieve the same product but with different quantities, there could be many measuring units...
- Basic features are too simple. (The main idea could be too simple for the purpose of this class...) <br/>
> We plan on finishing the basic implementation as soon as possible and jump into additional features such as the "board" feature, "alert" features... Hopefully we would finish all basic implementation by the beginning of the first week of sprint 3, and finish the additional features by beginning of sprint 4.

# Testing plan

### Unit testing
Every components and modules should be tested. In each sprint, we will test implemented modules using following frameworks. We expect the code coverage to be over 90%.
- React: Jest & Enzyme
- Django: Python unit test

### Functional testing
Every APIs must be tested. We will use following frameworks and mock data to test. In sprint 3, we will cover testing RESTful API for authentication, recipe, ingredient, comment, reply and photo. We will also test API for reply.
- React: Jest & Enzyme
- Django: Python unit test

### Integration testing
Since Cucumber automatically maps user stories into tests for users and provides testing without a human in the loop to perform the actions, we will use Cucumber for acceptance testing. We already wrote necessary user stories in sprint 1. We will test them in sprint 5. For integration testing, we will use Travis CI.
- Acceptance Testing: Cucumber
- Integration Testing: Travis CI


### Look at examples of other team ([design_example](https://github.com/swsnu/swppfall2020/blob/master/project/design-and-planning-examples/Design_and_Planning_example.pdf), [기완팀](https://github.com/swsnu/swpp2019-team8/wiki/Design-and-Planning-Document))
### Refer to the markdown page provided: [design-and-planning](https://github.com/swsnu/swppfall2020/blob/master/project/design-and-planning.md)
