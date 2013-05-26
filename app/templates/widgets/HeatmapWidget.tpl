<nav>
    <div class="btn-group">
        <button class="btn">View</button>
        <button class="btn dropdown-toggle" data-toggle="dropdown">
            <span class="caret"></span>
        </button>
        <ul class="dropdown-menu testcaseList mapList">
            <li><a href="#!/clickmap">Clickmap</a></li>
            <li><a href="#!/heatmap">Heatmap</a></li>
            <li><a href="#!/timelapse">Heatmap (time-lapse)</a></li>
            <li><a href="#!/gazespots">Gaze spots</a></li>
            <li><a href="#!/gazeplots">Gaze plots</a></li>
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

    <div class="btn-group testrunList">
        <button class="btn drpdownLabel">By Testrun</button>
        <a class="btn clear" href="#!/" data-placeholder="By Testrun" data-param="testrun"><i class="icon-remove"></i></a>
        <button class="btn dropdown-toggle" data-toggle="dropdown">
            <span class="caret"></span>
        </button>
        <ul class="dropdown-menu testcaseList idList">
            <% for(var i = 0; i < models.length; ++i) { %>
            <li class="<%=models[i]._id%>"><a href="#!/<%=models[i]._id%>"><%=models[i].timestamp%></a></li>
            <% } %>
        </ul>
    </div>

    <div class="btn-group testrunList">
        <button class="btn drpdownLabel">Filter</button>
        <a class="btn clear" href="#!/" data-placeholder="Filter" data-param="filter"><i class="icon-remove"></i></a>
        <button class="btn dropdown-toggle" data-toggle="dropdown">
            <span class="caret"></span>
        </button>
        <ul class="dropdown-menu testcaseList filterList">
            <li><a href="#!/only-successful">Only Successful Testruns</a></li>
            <li><a href="#!/only-timedout">Only Timed-Out Testruns</a></li>
            <li><a href="#!/only-failed">Only Failed Testruns</a></li>
            <li><a href="#!/fastest">Fastest Testruns</a></li>
            <li><a href="#!/slowest">Slowest Testruns</a></li>
            <li><a href="#!/mostSteps">Testruns With Most Steps</a></li>
            <li><a href="#!/leastSteps">Testruns With Least Steps</a></li>
        </ul>
    </div>
</nav>

<i class="nocontent choose">Please choose a view and page option!</i>