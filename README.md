## LAS3009 ­ Single Page Applications: A Pragmatic Approach

###Introduction

A simple product catalogue developed as a single page application. 

Made up of two sections:

+ Back office application - A login is needed to access this section. Administrator can add a number of categories from the category tab, and add a number of products from the product tab.  Each product must be assigned a category. Products can have thumbnails and these are stored on http://cloudinary.com/

+ Public facing application - All the products are displayed by default.  The products are displayed using paging where the user can change the page size and even the display order of the products by name or price.  The user can also filter by category by clicking on the menu header, as well as searching for keywords in product names and description from the search field in the menu bar.

All data is stored in data/db.json and json-server is used to expose the data via a REST API.

### Setup and Running Application

+ npm install

+ bower install


+ grunt serve
+ json-server data\db.json

### Technologies Used

+ AngularJS - JavaScript MVW Framework
+ Json-server - REST API for json database
+ cloudinary_ng - Image hosting
+ bootstrap - HTML and CSS framework
+ gruntjs - used grunt connect as web server
+ underscorejs - javascript utility functions, used for arrays
+ connect-modrewrite - Rewrite rules for grunt connect
