<% for(var i = 0; i < testruns.length; ++i) { %>
<blockquote>
  <p><%=testruns[i].feedback.text%></p>
  <small><%=testruns[i].feedback.timestamp%></small>
</blockquote>
<% } %>