# Fritter

Build your own not-quite-[Twitter](https://twitter.com/)!

## Starter Code

  This starter code implements users (with login/sessions), and freets so that you may focus on implementing your own design ideas.

The project is structured as follows:

- `index.ts` sets up the database connection and the Express server
- for each `concept`, `/concept` contains files related to that concept
  - `collection.ts` contains concept collection class to wrap around MongoDB database
  - `middleware.ts` contains concept middleware
  - `model.ts` contains definition of concept datatype
  - `router.ts` contains backend concept routes
  - `util.ts` contains concept utility functions for transforming data returned to the client
- `/public` contains the code for the frontend (HTML/CSS/browser JS)

## API routes

The following api routes have already been implemented for you (**Make sure to document all the routes that you have added.**):

#### `GET /`

This renders the `index.html` file that will be used to interact with the backend

#### `GET /api/freets` - Get all the freets

**Returns**

- An array of all accessible freets sorted in descending order by date modified

#### `GET /api/freets?author=USERNAME` - Get freets by author

**Returns**

- An array of accessible freets created by user with username `author`

**Throws**

- `400` if `author` is not given
- `404` if `author` is not a recognized username of any user

#### `POST /api/freets` - Create a new freet

**Body**

- `content` _{string}_ - The content of the freet
- `visibility` _{string}_ - `"public"`, `"friends"`, `"only me"` corresponding visibility of freet

**Returns**

- A success message
- A object with the created freet

**Throws**

- `403` if the user is not logged in
- `400` If the freet content is empty or a stream of empty spaces
- `400` if `visibility` is incorrect

#### `DELETE /api/freets/:freetId?` - Delete an existing freet

**Returns**

- A success message

**Throws**

- `403` if the user is not logged in
- `403` if the user is not the author of the freet
- `404` if the freetId is invalid

#### `PUT /api/freets/:freetId?` - Update an existing freet

**Body**

- `content` _{string}_ - The new content of the freet
- `visibility` _{string}_ - `"public"`, `"friends"`, `"only me"` corresponding visibility of freet

**Returns**

- A success message
- An object with the updated freet

**Throws**

- `403` if the user is not logged in
- `404` if the freetId is invalid
- `403` if the user is not the author of the freet
- `400` if the new freet content is empty or a stream of empty spaces
- `400` if `visibility` is incorrect

#### `POST /api/users/session` - Sign in user

**Body**

- `username` _{string}_ - The user's username
- `password` _{string}_ - The user's password

**Returns**

- A success message
- An object with user's details (without password)

**Throws**

- `403` if the user is already logged in
- `400` if username or password is not in correct format format or missing in the req
- `401` if the user login credentials are invalid

#### `DELETE /api/users/session` - Sign out user

**Returns**

- A success message

**Throws**

- `403` if user is not logged in

#### `POST /api/users` - Create an new user account

**Body**

- `username` _{string}_ - The user's username
- `password` _{string}_ - The user's password

**Returns**

- A success message
- An object with the created user's details (without password)

**Throws**

- `403` if there is a user already logged in
- `400` if username or password is in the wrong format
- `409` if username is already in use

#### `PUT /api/users` - Update a user's profile

**Body** _(no need to add fields that are not being changed)_

- `username` _{string}_ - The user's username
- `password` _{string}_ - The user's password

**Returns**

- A success message
- An object with the update user details (without password)

**Throws**

- `403` if the user is not logged in
- `400` if username or password is in the wrong format
- `409` if the username is already in use

#### `DELETE /api/users` - Delete user

**Returns**

- A success message

**Throws**

- `403` if the user is not logged in

#### `GET /api/comments` - Get accessible comments by filtering with author or freedId (or both)

**Query**

- `author` - The username of author we want comments from
- `freetId` - The id of the freet that comments are in

**Returns**

- Array of comments, sorted by date from recent to old

**Throws**
- `400` is `author` or `freetId` are given but empty
- `404` if `author`/`freetId` is non-empty but no user/freet match it

#### `POST /api/comments/onfreet/:freetId?` - Comment on a freet with given id

**Returns**

- Success message
- Comment object

**Throws**
- `400` if `freetId` is missing
- `403` if the user is not logged in
- `403` if `freetId` is not accessible by current user
- `404` if `freetId` is not recognizable as a freet
  
#### `POST /api/comments/oncomment/:commentId?` - Comment on a comment with given id

**Body**
- `content` _{string}_ - comment content

**Returns**

- Success message
- Comment object

**Throws**
- `400` if `commentId` is missing
- `403` if the user is not logged in
- `403` if freet associated with `commentId` is not accessible by current user
- `404` if `commentId` is not recognizable as a comment

#### `PUT /api/comments/:commentId` - Modify a comment with given id

**Body**
- `content` _{string}_ - comment content

**Returns**

- Success message
- Comment object

**Throws**
- `400` if `commentId` is missing
- `403` if freet associated with `commentId` is not accessible by current user (e.g., visibility of freet changed)
- `403` if current user is not author of comment with `commentId`
- `404` if `commentId` is not recognizable as a comment

#### `DELETE /api/comments/:commentId` - Delete a comment with given id (delete means mark it as delete rather than purging it)

**Returns**

- Success message

**Throws**
- `400` if `commentId` is missing
- `403` if freet associated with `commentId` is not accessible by current user (e.g., visibility of freet changed)
- `403` if current user is not author of comment with `commentId`
- `404` if `commentId` is not recognizable as a comment

#### `GET /api/follows/` - Get users who you follow

**Returns**

- Array of follow objects where currently logged in user is the follower, sorted by following date first being most recent.

**Throws**

- `403` if user is not logged in

#### `PUT /api/follows/:followee?` - Follow user with given username 

**Returns**

- Success message
- Follow object

**Throws**

- `403` if user is not logged in
- `400` if `followee` is missing
- `404` if `followee` is not recognizable user
- `409` if already following or `followee` is user itself

#### `DELETE /api/follows/:followee?` - Unfollow user with given username 

**Returns**

- Success message

**Throws**

- `403` if user is not logged in
- `400` if `followee` is missing
- `404` if `followee` is not recognizable user
- `409` if already not following or `followee` is user itself

#### `GET /api/follows/count/:followee?` - Get count of followers of user with given username

**Returns**

- Username (i.e. `followee`)
- Follower count of `followee`

**Throws**
- `400` if `followee` is missing
- `404` if `followee` is not recognizable user

#### `GET /api/follows/freets` - Get freets by followings

**Returns**

- Array of accessible freets posted by followings of logged in user, sorted by date first one being most recent. These freets will include your freets as well.

**Throws**

- `403` if user not logged in


#### `GET /api/friends/list` - Get your friends

**Returns**

- Array of friend objects, sorted by date first one being most recent
  
**Throws**
- `403` if user not logged in

#### `GET /api/friends/list/:friend` - Get friends of your friend

**Returns**
- Array of friend objects, sorted by date first one being most recent

**Throws**
- `403` if user not logged in
- `404` if `friend` is not recognizable username
- `403` if `friend` is not a friend of current user

#### `DELETE /api/friends/list/:friend?` - Unfriend someone

**Returns**
- Success message

**Throws**
- `403` if user not logged in
- `400` is `friend` is empty
- `404` if `friend` is not recognizable username
- `403` if `friend` is not a friend of current user

#### `GET /api/friends/requests` - Get your friend requests

**Returns**
- Array of friend request objects, sorted by date first one being most recent

**Throws**
- `403` if user not logged in

#### `PUT /api/friends/requests/:requestee?` - Make a friend request
**Returns**
- Success message
- Friend request object

**Throws**
- `403` if user not logged in
- `400` is `requestee` is empty
- `404` if `requestee` is not recognizable username
- `409` if already friends with `requestee`, or has incoming or sent friend request to `requestee`
  
#### `DELETE /api/friends/requests/:requestee?` - Withdraw a friend request
**Returns**
- Success message

**Throws**
- `403` if user not logged in
- `400` is `requestee` is empty
- `404` if `requestee` is not recognizable username
- `404` if friend request does not exist

#### `PUT /api/friends/requests/respond/:requester?` - Respond to a friend request

**Returns**
- Success message
- Friend request object

**Throws**
- `403` if user not logged in
- `400` is `requester` is empty
- `404` if `requester` is not recognizable username
- `404` if friend request does not exist

#### `GET /api/quickaccess/` - Get quick access list

**Returns**

- An array of quick access entries, in the same order as user specified

**Throws**

- `403` if user not logged in
  

#### `PUT /api/quickaccess` - Update quick access list

**Body**

- `entries` _{Array<name: string, url: string>}_ - entries of quick access list

**Returns**

- Success message
- Updated quick access object

**Throws**
- `403` if uset not logged in
- `400` if any name is empty or have something other than letters, digits and spaces
- `400` if there are duplicate names
- `400` if any url in entries is invalid

#### `GET /api/votes/my` - Get all voted freets or comments

**Returns**
- Array of upvote objects that are done by user, sorted by date first one being most recent

**Throws**
- `403` if user not logged in

#### `PUT /api/votes/freet/:freetId?` - Vote a freet

**Body**
- `vote` _{string}_ - `"upvote"` or `"downvote"`

**Returns**
- Success message
- Number of new upvotes and downvotes

**Throws**
- `403` if user not logged in or freet is not accessible
- `400` if `freetId` is empty
- `404` if `freetId` is not recognizable freet
- `400` if `vote` is invalid or missing

#### `DELETE /api/votes/freet/:freetId?` - Unvote a freet

**Returns**
- Success message
- Number of new upvotes and downvotes

**Throws**
- `403` if user not logged in or freet is not accessible
- `400` if `freetId` is empty
- `404` if `freetId` is not recognizable freet
- `404` if vote does not exist
- 
#### `PUT /api/votes/comment/:commentId?` - Vote a comment

**Body**
- `vote` _{string}_ - `"upvote"` or `"downvote"`

**Returns**
- Success message
- Number of new upvotes and downvotes

**Throws**
- `403` if user not logged in or comment is not accessible
- `400` if `commentId` is empty
- `404` if `commentId` is not recognizable comment
- `400` if `vote` is invalid or missing

#### `DELETE /api/votes/comment/:commentId?` - Unvote a comment

**Returns**
- Success message
- Number of new upvotes and downvotes

**Throws**
- `403` if user not logged in or comment is not accessible
- `400` if `commentId` is empty
- `404` if `commentId` is not recognizable comment
- `404` if vote does not exist

