# README

### How this thing was made

#### Basic setup
1. `$ express user-auth --git --hbs`
1. `$ cd user-auth`
1. Create this awesome README and outline all steps as we go!
1. `$ git init`
1. `$ git add -A`
1. '$ npm install'
1. `$ DEBUG=user-auth:* npm start`
1. Visit [http://localhost:3000/](http://localhost:3000/) and ensure all is well
1. Commit

#### User can sign up
1. In layout.hbs, add above `{{{body}}}`:

  ```html
  <nav>
    <a href="/signup">Sign up</a>
  </nav>
  ```

1. In `routes/index.js`, add route:

  ```js
  router.get('/signup', function(req, res, next) {
    res.render('users/new');
  });
  ```

1. Create a file `views/users/new.hbs` with the following content:

  ```html
  <form action="/users" method="post">
    <label for="email">Email</label>
    <input type="email" name="email" value="">
    <br>
    <label for="password">Password</label>
    <input type="password" name="password" value="">
    <br>
    <input type="submit" value="Sign Up">
  </form>
  ```

1. Add the dependencies needed to save user to the database to `package.json`:
  * `"bcrypt":"~0.8.3",`
  * `"cookie-session": "~1.2.0",`
  * `"monk": "~1.0.1",`
1. `$ npm install`
1. Add to `app.js` in the top requires:
  * `var cookieSession = require('cookie-session')`
1. Add to `app.js` under the engine setup:

  ```js
  app.set('trust proxy', 1)
  app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
  }))
  ```

1. Add to `routes/users.js` under the requires:
  * `var bcrypt = require('bcrypt');`
  * `var db = require('monk')('localhost/user-auth');`
  * `var User = db.get('users');`
1. Add route to create user from signup form in `users.js`:

  ```js
  router.post('/', function(req, res, next) {
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(req.body.password, salt, function(err, hash) {
        user = User.insert({ email: req.body.email, passwordDigest: hash });
        req.session.currentUserEmail = user.query.email;
        res.redirect('/');
      });
    });
  });
  ```

1.  Pass in user email into views in the 'routes/index.js' file, updating root path like so:

  ```js
  router.get('/', function(req, res, next) {
    res.render('index', { title: 'Cool App, Dude', currentUserEmail: req.session.currentUserEmail});
  });
  ```

1. And finally, update the layout view nav to use your new session:

  ```html
  <nav>
    {{#if currentUserEmail}}
      <h1>Welcome, {{currentUserEmail}}!</h1>
    {{else}}
      <a href="/signup">Sign up</a>
    {{/if}}
  </nav>
  ```

#### User can signout
1. Add a signout link to layout within `{{#if currentUserEmail}}`:
  * `<a href="/signout">Sign out</a>`
1. Add route to `index.js`:

  ```js
  router.get('/signout', function(req, res, next) {
    req.session = null;
    res.redirect('/');
  });
  ```

#### User can signin
1. Add a signin link to layout.hbs within else portion of `{{#if currentUserEmail}}`:
  * `<a href="/signin">Sign in</a>`
1. Add route to `index.js`

  ```js
  router.get('/signin', function(req, res, next) {
    res.render('authentication/new');
  });
  ```

1. Add `views/authentication/new.hbs` with the following content:

  ```html
  <h1>Sign in!</h1>
  <form action="/authentication" method="post">
    <label for="email">Email</label>
    <input type="email" name="email" value="">
    <br>
    <label for="password">Password</label>
    <input type="password" name="password" value="">
    <br>
    <input type="submit" value="Sign In">
  </form>
  ```

1. Add a authentication router to `app.js`:
  * `var authentication = require('./routes/authentication');` near other like route variables
  * `app.use('/authentication', authentication);` near other like `app.use` route middleware
1. Add a new route file `routes/authentication.js` with the following content:

  ```js
  router.post('/', function(req, res, next) {
    User.findOne({ email: req.body.email }).on('success', function (user) {
      bcrypt.compare(req.body.password, user.passwordDigest, function(err, valid) {
        if (valid) {
          req.session.currentUserEmail = user.email;
          res.redirect('/');
        };
      });
    });
  });
  ```

#### User must enter an email address on signup
1. In user routes, change post route to:

  ```
  router.post('/', function(req, res, next) {
    if (req.body.email == false){
      res.render('users/new', {errors: "Please enter your email"});
    } else {
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
          user = User.insert({ email: req.body.email, passwordDigest: hash });
          req.session.currentUserEmail = user.query.email;
          res.redirect('/');
        });
      });
    };
  });
  ```

1. To render this in the view, between h1 and form:

  ```
  {{#if error}}
    <h4>{{error}}</h4>
  {{/if}}
  ```
