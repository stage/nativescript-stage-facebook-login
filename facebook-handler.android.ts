//NativeScript modules
import applicationModule = require("application");

declare var AccessToken: any;

var _isInit: boolean = false;
var _AndroidApplication = applicationModule.android;
var _act: android.app.Activity;

var mCallbackManager;
var loginManager;

// not implemented
export function isAlreadyAuthenticated(): boolean {
  return com.facebook.AccessToken.getCurrentAccessToken() != null;
}

// not implemented
export function accessToken(): boolean {
  return com.facebook.AccessToken.getCurrentAccessToken();
}


export function init(facebookAppId, facebookAppDisplayName): boolean {

  try {
    //fb initialization
    com.facebook.FacebookSdk.sdkInitialize(_AndroidApplication.context.getApplicationContext());
  }
  catch (e) {
    console.log("nativescript-facebook-login: The plugin could not find the android library, try to clean the android platform")
  }

  mCallbackManager = com.facebook.CallbackManager.Factory.create();
  loginManager = com.facebook.login.LoginManager.getInstance();

  //This solve the case when user changes accounts error code 304
  loginManager.logOut();


  // if we want to change the loginBehavior:
  // https://developers.facebook.com/docs/reference/android/current/class/LoginBehavior/
  // loginManager = loginManager.setLoginBehavior(loginBehavior);

  if (mCallbackManager && loginManager) {
    _isInit = true;
    return true;
  }
  else {
    return false;
  }
}

export function registerCallback(successCallback: any, cancelCallback: any, failCallback: any, declinePermissionsCallback: any) {

  if (_isInit) {
    var act = _AndroidApplication.foregroundActivity || _AndroidApplication.startActivity;
    _act = act;

    loginManager.registerCallback(mCallbackManager, new com.facebook.FacebookCallback({

      onSuccess: function (result) {
        let _deniedPermissionsCount = result.getRecentlyDeniedPermissions().size();
        _deniedPermissionsCount > 0 ? declinePermissionsCallback() : successCallback(result.getAccessToken().getToken());
      },
      onCancel: function () {
        cancelCallback();

      },
      onError: function (e) {
        failCallback(e);
      }

    }));

    //Overriding Activity onActivityResult method to send it to the callbackManager
    act.onActivityResult = (requestCode: number, resultCode: number, data: android.content.Intent) => {
      mCallbackManager.onActivityResult(requestCode, resultCode, data);
    }
  }
}

export function logInWithPublishPermissions(permissions: string[]) {
  if (_isInit) {
    var javaPermissions = java.util.Arrays.asList(permissions);
    //Start the login process
    loginManager.logInWithPublishPermissions(_act, javaPermissions);
  }
}

export function logInWithReadPermissions(permissions: string[]) {
  if (_isInit) {
    var javaPermissions = java.util.Arrays.asList(permissions);
    //Start the login process
    loginManager.logInWithReadPermissions(_act, javaPermissions);
  }
}

