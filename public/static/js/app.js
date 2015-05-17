/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var app = app || {},
    that;
app.template = {
    pages : lib.template(
        '<% pages.data.forEach(function(page){ %>\n\
            <tr data-id="<%= page.id%>">\n\
                <td><%=page.name%></td>\n\
                <td><%=page.category%></td>\n\
                <td class="displayLink"><a href="https://facebook.com/<%=page.id%>" target="_myApp">View Page</a></td>\n\
            </tr>\n\
        <% }); %>'
    ),
    framePopup : lib.template(
        '<div id="framePopup">\n\
            <div class="backdrop"></div>\n\
            <div class="content">\n\
                <iframe id="displayPage" src="<%= frameSrc %>"></iframe>\n\
            </div>\n\
        </div>'
    )
};

window.fbAsyncInit = function() {
    FB.init({
        appId      : '947922011917951',
        xfbml      : true,
        version    : 'v2.3'
      });
    };

    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "//connect.facebook.net/en_US/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

setTimeout(
    function(){
        FB.getLoginStatus(function(response) {
            if (response.status === 'connected') {
              // the user is logged in and has authenticated your
              // app, and response.authResponse supplies
              // the user's ID, a valid access token, a signed
              // request, and the time the access token 
              // and signed request each expire
              app.uid = response.authResponse.userID;
              app.accessToken = response.authResponse.accessToken;
              app.init();
            } else if (response.status === 'not_authorized') {
              // the user is logged in to Facebook, 
              // but has not authenticated your app
              FB.login();
              console.log('Logged in.. 2');
            } else {
              // the user isn't logged in to Facebook.
              console.log('Logged in.. 3');
            }
         });
 },2000);
 
 app.searchResults = {};
 
 app.init = function(){
     that = this;
     lib.live('click', '#submitSearch', function(e,f){
        if( e.target !==  this ) return;
        var searchTerm = document.querySelector('#searchTerm').value.trim();
        FB.api('search?q='+searchTerm+'&type=page', 'get', {
           access_token : app.accessToken,
           limit : 20
        }, function(response){
            that.getList(response);
        });
     });
     
     lib.live('click', '#loadMore button', function(e,f){
        var link = this.getAttribute('data-href');
        link = link.split('facebook.com');
        link = link[1];
        FB.api(link, 'get', {
           limit : 20
        }, function(response){
            that.getList(response);
        });
     });
     
     lib.live('click', '.displayLink', function(){
        var containerEl = document.querySelectorAll('body')[0],
            frameSrc = 'https://www.facebook.com/' + this.innerHTML;
            
        containerEl.innerHTML += app.template.framePopup({
            frameSrc : frameSrc
        });
     });
 };
 
 app.getList = function(pages){
    console.log(pages);
    var markup = app.template.pages({
        pages : pages
    });
    var tableEl = document.querySelectorAll('#pagesTable')[0];
    tableEl.innerHTML += markup;
    document.getElementById('pagesTable').style.display = 'table';
    document.getElementById('loadMore').style.display = 'block';
    document.getElementById('searchPopup').style.display = 'none';
    document.querySelectorAll('#loadMore button')[0].setAttribute('data-href', pages.paging.next);
 };