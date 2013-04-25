<li data-id="<%=testcase.get('id')%>">
    <button type="button" class="btn btn-mini showDetails"><i class="icon-align-justify"></i></button>
    <button type="button" class="btn btn-mini remove"><i class="icon-minus"></i></button>
    <em><%=testcase.get('name')%></em>
    <span><%=testcase.getCreationTime()%></span>

    <div class="details">
        <dl class="dl-horizontal">
            <dt>ID</dt>
            <dd><%=testcase.get('id')%></dd>
            <dt>Start URL</dt>
            <dd><%=testcase.get('url')%></dd>
            <dt>max. Time</dt>
            <dd><%=testcase.get('maxTime')%></dd>
            <dt>Target Action</dt>
            <dd><%=testcase.get('targetAction')%></dd>
            <dt>Target Element</dt>
            <dd><%=testcase.get('targetElem')%></dd>

            <% if(testcase.get('cookies').length) { %>
            <dt>Cookies</dt>
            <dd>
                <% _.each(testcase.get('cookies'), function(cookie,i) { %> 
                    <strong><%= cookie.name %>: </strong><%= cookie.value %><br>
                <% }); %>
            </dd>
            <% } %>
        </dl>
    </div>
</li>