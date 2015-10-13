<%@ Control Language="C#" AutoEventWireup="true" %>
<h1>Site analytics</h1>
<div id="view-selector-container"></div>

<div class="GA-Dashboard">
    <ul class="FlexGrid">
        <li class="FlexGrid-item">


            <div class="Chart">

                <header class="Titles">
                    <h1 class="Titles-main">Sessions</h1>
                    <b id="from-dates1"></b>
                </header>
                <div id="chart-1-container"></div>
                <div id="date-range-selector-1-container"></div>
            </div>
        </li>
        <li class="FlexGrid-item">
            <div class="Chart">
                <header class="Titles">
                    <h1 class="Titles-main">Pageviews</h1>
                    <b id="from-dates2"></b>
                </header>
                <div id="chart-2-container"></div>
                <div id="date-range-selector-2-container"></div>
            </div>
        </li>
    </ul><br />
    <ul class="FlexGrid">
        <li class="FlexGrid-item">
            <div class="Chart">
                <header class="Titles">
                    <h1 class="Titles-main">Browsers</h1>
                    <b id="from-dates3"></b>
                </header>
                <div id="chart-3-container"></div>
                <div id="date-range-selector-3-container"></div>
            </div>
        </li>
        <li class="FlexGrid-item">
            <div class="Chart">
                <header class="Titles">
                    <h1 class="Titles-main">Top Countries by Sessions</h1>
                    <b id="from-dates4"></b>
                </header>
                <div id="chart-4-container"></div>
                <div id="date-range-selector-4-container"></div>
            </div>
        </li>
    </ul>
</div>
