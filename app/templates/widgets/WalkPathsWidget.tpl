<nav>
    <div class="btn-group">
        <button class="btn">By Task</button>
        <button class="btn dropdown-toggle" data-toggle="dropdown">
            <span class="caret"></span>
        </button>
        <ul class="dropdown-menu testcaseList pageList">
            <% for(var i = 0; i < tasks.length; ++i) { %>
            <li><a href="#!/<%=encodeURIComponent(tasks[i]._id)%>"><%=tasks[i].name%></a></li>
            <% } %>
        </ul>
    </div>
</nav>