//NativeScript modules
import applicationModule = require("application");

var _isInit: boolean = false;

var mCallbackManager;
var loginManager;

declare var FBSDKLoginManager: any;
declare var FBSDKLoginBehaviorSystemAccount: any;
declare var FBSDKLoginBehaviorNative: any;
declare var FBSDKSettings: any;
declare var FBSDKAccessToken: any;
  console.log("facebook handler v3.0");

export function isAlreadyAuthenticated(): boolean {
  return FBSDKAccessToken.currentAccessToken() ? true : false;
}

export function accessToken(): any {
  return FBSDKAccessToken.currentAccessToken();
}

export function init(facebookAppId, facebookAppDisplayName): boolean { 
  console.log("facebook handler v3.0 init");

  // set the settings
  FBSDKSettings.setAppID(facebookAppId);
  FBSDKSettings.setDisplayName(facebookAppDisplayName);

  // fb initialization
  loginManager = FBSDKLoginManager.alloc().init();


  if (loginManager) {
    //This solve the case when user changes accounts error code 304
    loginManager.logOut();

    // loginManager.loginBehavior = FBSDKLoginBehaviorSystemAccount;
    loginManager.loginBehavior = FBSDKLoginBehaviorNative;
    
    _isInit = true;
    return true;
   }
   else {
    return false;
   }
  }

export function registerCallback(successCallback: any, cancelCallback: any, failCallback: any, declinePermissionsCallback: any) {
    if (_isInit) {
      mCallbackManager= function(result: FBSDKLoginManagerLoginResult, error: NSError) {

        if (error) {
          console.log("mCallbackManager error: " + error);
          failCallback(error);
          return;
        } 
        //something went really wrong no error and no result
        if (!result) {
          console.log("mCallbackManager !result");
          failCallback("Null error");
          return;
        }

        if (result.isCancelled) {
          console.log("mCallbackManager result.isCancelled");
          cancelCallback();
          return;
        }

        if (result.declinedPermissions) {
          console.log("mCallbackManager result.declinedPermissions");
          declinePermissionsCallback();
          return;
        }

        if (result.token) {
          console.log("mCallbackManager success: " + result.token.tokenString);
          successCallback(result.token.tokenString);
        }
        else {
          console.log("mCallbackManager Could not acquire an access token");
          failCallback("Could not acquire an access token");
          return;
        }
      }
    }
  }
export function logInWithPublishPermissions(permissions: string[]) {
    if (_isInit) {
      loginManager.logInWithPublishPermissionsHandler(permissions, mCallbackManager);
    }
  }
export function logInWithReadPermissions(permissions: string[]) {
    if (_isInit) {
    loginManager.logInWithReadPermissionsHandler(permissions, mCallbackManager);
    }
}
export function hasGrantedPermission(permission: string) {
    if (!_isInit) return false;
    if (!this.isAlreadyAuthenticated()) return;  
    console.log("hasGrantedPermissions: " + permission);
    return loginManager.hasGranted(permission);
}



