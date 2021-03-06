<dl class="dl-horizontal">
    <dt>Number of Testruns</dt>
    <dd><%=testruns%></dd>
    <dt>Steps (in pages)</dt>
    <dd><b>Max:</b> <%=maxSteps !== 0 ? maxSteps : '--'%> &nbsp; <b>Min:</b> <%=minSteps !== 0 ? minSteps : '--'%> &nbsp; (avg. <%=Math.round((stepsCount/testruns)*100) / 100%>)</dd>
    <dt>Time</dt>
    <dd>
        <b>Max:</b> <%=maxTime !== 0 ? (Math.round(maxTime*100) / 100) : '--'%>s
        &nbsp;
        <b>Min:</b> <%=minTime !== 0 ? (Math.round(minTime*100) / 100) : '--'%>s
        &nbsp;
        <% if(minTime && maxTime) { %>
            (avg. <%=Math.round((timeCount/testruns)*100) / 100%>s)
        <% } %>
    </dd>
    <dt>Most Viewed:</dt>
    <dd>
        <% for(var i = mostViewed.length-1, j = 1; i > mostViewed.length - 6 && mostViewed[i]; --i, ++j) { %>
            <%=j%>. <a href="<%=mostViewed[i][0]%>"><small><%=mostViewed[i][0]%></small></a> (<%=mostViewed[i][1]%>)<br>
        <% } %>
    </dd>
</dl>
<div class="pieChart"></div>