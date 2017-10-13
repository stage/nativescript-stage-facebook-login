# nativescript-stage-facebook-login

Example usage:

```
    const FacebookLoginHandler = require("nativescript-stage-facebook-login");

    // Initialize the handler
    FacebookLoginHandler.init(this._env.config.facebook.appId, this._env.config.facebook.appDisplayName);

    // Register our callbacks
    FacebookLoginHandler.registerCallback(this._loginFacebookSuccessCallback.bind(this), this.loginFacebookCancelCallback.bind(this), this.loginFacebookFailCallback.bind(this), this.loginFacebookDeclinedPermissions.bind(this));

    // Start the login process
    FacebookLoginHandler.logInWithReadPermissions(["public_profile", "email", "user_friends", "user_birthday"]);

```