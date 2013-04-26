<div class="page-header">
    <h1><% if (testcase.attributes) { %>Edit<% } else { %>Create<% } %> Testcase</h1>
</div>

<form class="form-horizontal">
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
    <fieldset>
        <legend>Target <small>action on element completed testcase</small></legend>
        <div class="control-group">
            <label class="control-label" for="inputTargetAction">Action*</label>

            <div class="controls">
                <select name="targetAction" class="targetAction">
                    <% 
                    var events = ['blur','change','click','contextmenu','copy','cut',
                        'dblclick','error','focus','focusin','focusout','hashchange','keydown',
                        'keypress','keyup','load','mousedown','mouseenter','mouseleave',
                        'mousemove','mouseout','mouseover','mouseup','mousewheel','paste',
                        'reset','resize','scroll','select','submit','textinput','unload','wheel']; 

                    for(var type in events) {
                    %>
                       <option <% if (testcase.attributes && testcase.get('targetAction') === events[type]) { %>selected="selected"<% } %> value="<%= events[type] %>"><%= events[type] %></option>
                    <% 
                    }
                    %>
                </select>
            </div>
        </div>
        <div class="control-group">
            <label class="control-label" for="inputTargetElem">Element*</label>
            <div class="controls">
                <input type="text" name="targetElem" id="inputTargetElem" class="required" value="<% if (testcase.attributes) { %><%=testcase.get('targetElem')%><% } %>">
            </div>
        </div>
    </fieldset>

    <fieldset class="cookies">
        <legend>Cookies <small>set before start of testcase</small></legend>
        <a class="btn add-cookie"><i class="icon-plus"></i> Add Cookie</a>

        <%=cookies%>
    </fieldset>

    <hr>

    <div class="control-group">
        <div class="controls">
            <button type="submit" class="btn btn-primary submit"><% if (testcase.attributes) { %>Edit<% } else { %>Create<% } %></button>
            <small class="requiredLabel">* Required</small>
        </div>
    </div>
</form>