<div class="page-header">
    <h1>Create Testcase</h1>
</div>

<form class="form-horizontal">
    <div class="control-group">
        <label class="control-label" for="inputName">Name*</label>
        <div class="controls">
            <input type="text" name="name" id="inputName" class="required">
        </div>
    </div>
    <div class="control-group">
        <label class="control-label" for="inputStartURL">Start URL*</label>
        <div class="controls">
            <input type="text" name="startURL" id="inputStartURL" class="required" value="http://">
        </div>
    </div>
    <div class="control-group">
        <label class="control-label" for="inputMaxTime">Length of Time (max.)*</label>
        <div class="controls">
            <input type="text" name="maxTime" id="inputMaxTime" class="numberField required"><small>&nbsp;(in min)</small>
        </div>
    </div>
    <fieldset>
        <legend>Target <small>action on element completed testcase</small></legend>
        <div class="control-group">
            <label class="control-label" for="inputTargetAction">Action*</label>

            <div class="controls">
                <select name="targetAction" class="targetAction">
                    <option value="blur">blur</option>
                    <option value="change">change</option>
                    <option value="click" selected>click</option>
                    <option value="contextmenu">contextmenu</option>
                    <option value="copy">copy</option>
                    <option value="cut">cut</option>
                    <option value="dblclick">dblclick</option>
                    <option value="error">error</option>
                    <option value="focus">focus</option>
                    <option value="focusin">focusin</option>
                    <option value="focusout">focusout</option>
                    <option value="hashchange">hashchange</option>
                    <option value="keydown">keydown</option>
                    <option value="keypress">keypress</option>
                    <option value="keyup">keyup</option>
                    <option value="load">load</option>
                    <option value="mousedown">mousedown</option>
                    <option value="mouseenter">mouseenter</option>
                    <option value="mouseleave">mouseleave</option>
                    <option value="mousemove">mousemove</option>
                    <option value="mouseout">mouseout</option>
                    <option value="mouseover">mouseover</option>
                    <option value="mouseup">mouseup</option>
                    <option value="mousewheel">mousewheel</option>
                    <option value="paste">paste</option>
                    <option value="reset">reset</option>
                    <option value="resize">resize</option>
                    <option value="scroll">scroll</option>
                    <option value="select">select</option>
                    <option value="submit">submit</option>
                    <option value="textinput">textinput</option>
                    <option value="unload">unload</option>
                    <option value="wheel">wheel</option>
                </select>
            </div>
        </div>
        <div class="control-group">
            <label class="control-label" for="inputTargetElem">Element*</label>
            <div class="controls">
                <input type="text" name="targetElem" id="inputTargetElem" class="required">
            </div>
        </div>
    </fieldset>

    <fieldset class="cookies">
        <legend>Cookies <small>set before start of testcase</small></legend>
        <a class="btn add-cookie"><i class="icon-plus"></i> Add Cookie</a>
    </fieldset>

    <hr>

    <div class="control-group">
        <div class="controls">
            <button type="submit" class="btn btn-primary submit">Create</button>
            <small class="requiredLabel">* Required</small>
        </div>
    </div>
</form>