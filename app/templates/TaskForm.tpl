<li class="taskform<% if (task.attributes) { %> editMode<% } %>"<% if (task.attributes) { %>  data-timestamp="<%=task.get('timestamp')%>"<% } %>>
    <div class="control-group">
        <label class="control-label" for="inputName">Name*</label>
        <div class="controls">
            <input type="text" name="name" id="inputName" class="required" value="<% if (task.attributes) { %><%=task.get('name')%><% } %>">
        </div>
    </div>
    <div class="control-group">
        <label class="control-label" for="inputDesc">Task Descripton*</label>
        <div class="controls">
            <textarea name="description" rows="4" class="required" id="inputDesc"><% if (task.attributes) { %><%=task.get('description')%><% } %></textarea>
        </div>
    </div>
    <div class="control-group">
        <label class="control-label" for="inputName">Required?</label>
        <div class="controls">
            <label class="checkbox">
                <input type="checkbox" name="required" value="1" class="required"<% if (task.attributes && task.get('required')) { %> checked="checked"<% } %>>
                <small>(task is <i>required</i> to continue with the next test?)</small>
            </label>
        </div>
    </div>
    <div class="control-group">
        <label class="control-label" for="inputMaxTime">Length of Time (max.)*</label>
        <div class="controls">
            <input type="text" name="maxTime" id="inputMaxTime" class="numberField required" value="<% if (task.attributes) { %><%=task.get('maxTime')%><% } %>"><small>&nbsp;(in min)</small>
        </div>
    </div>
    <div class="control-group input-prepend">
        <div class="btn-group">
            <label class="control-label" for="inputName">Target Action*</label>
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
                   <option <% if (task.attributes && task.get('targetAction') === events[type]) { %>selected="selected"<% } %> value="<%= events[type] %>"><%= events[type] %></option>
                <% 
                }
                %>
            </select>
            <input type="text" name="targetElem" class="targetElem required" value="<% if (task.attributes) { %><%=task.get('targetElem')%><% } %>"><small>(target elem, e.g. .submitButton)</small>
            </div>
        </div>
    </div>
    <div class="controls">
        <button class="btn cancel">Cancel</button>
        <button type="submit" class="btn btn-primary submit task"><% if (task.attributes) { %>Save Task<% } else { %>Add New Task<% } %></button>
    </div>
</li>