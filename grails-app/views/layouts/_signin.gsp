<script>
  function onSignIn(googleUser) {
  console.log(googleUser);
      // show spinner while the page is re-loading
      document.getElementById("login_spinner").setAttribute("class", "visible");
      var profile = googleUser.getBasicProfile();
      var token = googleUser.getAuthResponse().id_token;
      var auth2 = gapi.auth2.getAuthInstance();
      auth2.then(function() {
          var xhttp = new XMLHttpRequest();
          <auth:isNotAuthenticated>
          xhttp.onreadystatechange = function() {
              if (this.readyState == 4 && this.status == 200) {
                  location.reload();
              }
          };
          </auth:isNotAuthenticated>
          var url = "${raw(createLink(controller: "auth", action: "authUser"))}";
          var postData = "token=" + token;
          xhttp.open("POST", url, true);
          xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
          xhttp.send(postData);
      });
  }
  function signOut() {
      var auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut().then(function (){
          var xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function() {
              if (this.readyState == 4 && this.status == 200) {
                  window.location = "${request.contextPath}";
              }
          };
          var url = "${raw(createLink(controller: "logout", action: "logout"))}";
          xhttp.open("POST", url, true);
          xhttp.send();
      });
  }
</script>
