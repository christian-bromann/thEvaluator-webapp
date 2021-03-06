<li data-id="<%=testcase.get('id')%>">
    <button type="button" class="btn btn-mini showDetails"><i class="icon-align-justify"></i></button>
    <button type="button" class="btn btn-mini edit"><i class="icon-pencil"></i></button>
    <button type="button" class="btn btn-mini remove"><i class="icon-minus"></i></button>
    <em><%=testcase.get('name')%></em>
    <span><%=testcase.getCreationTime()%></span>

    <div class="details">
        <dl class="dl-horizontal">
            <dt>ID</dt>
            <dd><%=testcase.get('id')%></dd>
            <dt>Start URL</dt>
            <dd><%=testcase.get('url')%></dd>
            <dt>Resolution</dt>
            <dd><%=testcase.get('resolution')[0]%>px x <%=testcase.get('resolution')[1]%>px</dd>

            <% if(testcase.get('cookies').length) { %>
            <dt>Cookies</dt>
            <dd>
                <% _.each(testcase.get('cookies'), function(cookie,i) { %> 
                    <strong><%= cookie.name %>: </strong><%= cookie.value %><br>
                <% }); %>
            </dd>
            <% } %>

            <% if(testcase.get('tasks').length) { %>
            <dt>Tasks</dt>
            <dd>
                <% _.each(testcase.get('tasks'), function(task,i) { %> 
                    <%= task.name %>
                    <% if(task.required) { %><small>(required)</small><% } %>
                    <br>
                <% }); %>
            </dd>
            <% } %>
        </dl>
    </div>
</li>