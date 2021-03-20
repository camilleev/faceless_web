export default function(filter = {}, action) {
 
    if(action.type === 'addFilter') {
      console.log("FILTER", action.filter)
      return action.filter;
    } else if (action.type === 'clearFilter'){
      var clearFilter = {}
      return clearFilter
    } else {
      return filter;
    }
   }