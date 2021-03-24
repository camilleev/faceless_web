export default function(token = 0, action) {
 
    if(action.type === 'addToken') {
      var newToken = action.token;
      return newToken;
    } else if (action.type === 'clearToken'){
      var clearToken = 0;
      return clearToken;
    } else {
      return token;
    }
   }