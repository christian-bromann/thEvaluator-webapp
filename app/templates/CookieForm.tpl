<div class="control-group">
    <label class="control-label" for="inputCookieName">Name*</label>
    <div class="controls cookieControls error">
        <input type="text" name="cookieName" class="inputCookieName" value="<%=cookie.name%>">
    </div>
    <label class="control-label cookieLabel" for="inputCookieValue">Value</label>
    <div class="controls cookieControls">
        <input type="text" name="cookieValue" class="inputCookieValue" value="<%=cookie.value%>">
    </div>
    <a class="btn remove-cookie"><i class="icon-minus"></i></a>
</div>