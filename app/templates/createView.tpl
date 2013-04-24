<div class="page-header">
    <h1>Create Testcase</h1>
</div>

<form class="form-horizontal">
    <div class="control-group">
        <label class="control-label" for="inputName">Name*</label>
        <div class="controls">
            <input type="text" id="inputName">
        </div>
    </div>
    <div class="control-group">
        <label class="control-label" for="inputStartURL">Start URL*</label>
        <div class="controls">
            <input type="text" id="inputStartURL">
        </div>
    </div>
    <div class="control-group">
        <label class="control-label" for="inputMaxTime">Length of Time (max.)*</label>
        <div class="controls">
            <input type="text" id="inputMaxTime"><small>&nbsp;(in ms)</small>
        </div>
    </div>
    <fieldset>
        <legend>Target <small>action on element completed testcase</small></legend>
        <div class="control-group">
            <label class="control-label" for="inputTargetAction">Action*</label>
            <div class="controls">
                <input type="text" id="inputTargetAction">
            </div>
        </div>
        <div class="control-group">
            <label class="control-label" for="inputTargetElem">Element*</label>
            <div class="controls">
                <input type="text" id="inputTargetElem">
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
            <small class="required">* Required</small>
        </div>
    </div>
</form>