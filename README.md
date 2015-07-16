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
  <form class="signup" action="/users" method="post">
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

  ```
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

  ```
  router.post('/', function(req, res, next) {
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(req.body.password, salt, function(err, hash) {
        user = User.insert({ email: req.body.email, password_digest: hash });
        req.session.currentUserEmail = user.query.email;
        res.redirect('/');
      });
    });
  });
  ```

1.  Pass in user email into views in the 'routes/index.js' file, updating root path like so:

  ```
  router.get('/', function(req, res, next) {
    res.render('index', { title: 'Cool App, Dude', currentUserEmail: req.session.currentUserEmail});
  });
  ```

1. And finally, update the layout view nav to use your new session:

  ```
  <nav>
    {{#if currentUserEmail}}
      <h1>Welcome, {{currentUserEmail}}!</h1>
    {{else}}
      <a href="/signup">Sign up</a>
    {{/if}}
  </nav>
  ```
