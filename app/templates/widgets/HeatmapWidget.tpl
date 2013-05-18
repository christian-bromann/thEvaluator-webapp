<nav>
    <div class="btn-group">
        <button class="btn">View</button>
        <button class="btn dropdown-toggle" data-toggle="dropdown">
            <span class="caret"></span>
        </button>
        <ul class="dropdown-menu testcaseList">
            <li><a href="#!/heatmap">Heatmap</a></li>
            <li><a href="#!/movemap">Movemap</a></li>
            <li><a href="#!/both">Both</a></li>
        </ul>
    </div>

    <div class="btn-group">
        <button class="btn">By Page</button>
        <a class="btn clear" href="#!/" data-placeholder="By Page" data-param="url"><i class="icon-remove"></i></a>
        <button class="btn dropdown-toggle" data-toggle="dropdown">
            <span class="caret"></span>
        </button>
        <ul class="dropdown-menu testcaseList pageList">
            <% for(var i = pages.length - 1; i >= 0; --i) { %>
            <li><a href="#!/<%=encodeURIComponent(pages[i][0])%>"><%=pages[i][0]%></a></li>
            <% } %>
        </ul>
    </div>

    <!--<div class="btn-group">
        <button class="btn">By Testrun</button>
        <a class="btn" href="#!/" data-placeholder="By Testrun" data-param="testrun"><i class="icon-remove"></i></a>
        <button class="btn dropdown-toggle" data-toggle="dropdown">
            <span class="caret"></span>
        </button>
        <ul class="dropdown-menu testcaseList idList">
            <% for(var i = 0; i < models.length; ++i) { %>
            <li><a href="#!/<%=models[i]._id%>"><%=models[i].timestamp%></a></li>
            <% } %>
        </ul>
    </div>-->
</nav>
<img src="">