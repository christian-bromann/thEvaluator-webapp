<div class="page-header">
    <h1><% if (testcase.attributes) { %>Edit<% } else { %>Create<% } %> Testcase</h1>
</div>

<form class="form-horizontal testcase-form">
    <div class="control-group">
        <label class="control-label" for="inputName">Name*</label>
        <div class="controls">
            <input type="text" name="name" id="inputName" class="required" value="<% if (testcase.attributes) { %><%=testcase.get('name')%><% } %>">
        </div>
    </div>
    <div class="control-group">
        <label class="control-label" for="inputStartURL">Start URL*</label>
        <div class="controls">
            <input type="text" name="url" id="inputStartURL" class="required" value="<% if (testcase.attributes) { %><%=testcase.get('url')%><% } else { %>http://<% } %>">
        </div>
    </div>
    <div class="control-group">
        <label class="control-label" for="inputMaxTime">Length of Time (max.)*</label>
        <div class="controls">
            <input type="text" name="maxTime" id="inputMaxTime" class="numberField required" value="<% if (testcase.attributes) { %><%=testcase.get('maxTime')%><% } %>"><small>&nbsp;(in min)</small>
        </div>
    </div>
    <fieldset class="cookies">
        <legend>Cookies <small>set before start of testcase</small></legend>
        <a class="btn add-cookie"><i class="icon-plus"></i> Add Cookie</a>

        <%=cookies%>
    </fieldset>

    <hr size="2">

    <div class="page-header">
        <h1>Add Tasks</h1>
    </div>

    <a class="btn add-task"><i class="icon-plus"></i> Add Task</a>

    <ul class="testcaseList tasks">
        <%=tasks%>
    </ul>

    <hr>

    <div class="control-group">
        <div class="controls">
            <button type="submit" class="btn btn-primary submit testcase"><% if (testcase.attributes) { %>Edit<% } else { %>Create<% } %></button>
            <small class="requiredLabel">* Required</small>
        </div>
    </div>
</form>