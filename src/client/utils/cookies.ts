export function Cookies(){
    function getCookie(cname:string) {
        let name = cname + "=";
        let ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) == ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
          }
        }
        return "";
    }

    function setCookie(cname:string, cvalue:string, exdays:number) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    function hasCookie(key:string) {
      let user = getCookie(key);
      if(user != "") return true  
      return false
    }

    function deleteCookie(cookieName:string) {
      document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
    
    return{
        getCookie,
        setCookie,
        hasCookie,
        deleteCookie
    }
}