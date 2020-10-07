// テーマのロード。お好みのものを。
//$("head").append('<link href="https://unpkg.com/tabulator-tables@4.8.1/dist/css/tabulator.min.css" rel="stylesheet">'); // 標準
$("head").append('<link href="https://unpkg.com/tabulator-tables@4.8.1/dist/css/tabulator_simple.min.css" rel="stylesheet">'); // シンプル
//$("head").append('<link href="https://unpkg.com/tabulator-tables@4.8.1/dist/css/bootstrap/tabulator_bootstrap.min.css" rel="stylesheet">'); // Bootstrap3

// Redmine情報。ajaxで取ってくることもできるけど、ページ読み込み遅くなりそうなのでとりあえず固定。
var INFO ={
 // /users.json を以下に貼り付け ("total_count","offset","limit" などは削除してね)
"users":[{"id":1,"login":"hono63","admin":true,"firstname":"N","lastname":"H","mail":"dummy@gmail.com","created_on":"2020-09-23T10:49:34Z","last_login_on":"2020-10-07T15:00:36Z"}]
, // /issue_statuses.json を以下に貼り付け
"issue_statuses":[{"id":1,"name":"新規","is_closed":false},{"id":2,"name":"進行中","is_closed":false},{"id":3,"name":"解決","is_closed":false},{"id":4,"name":"フィードバック","is_closed":false},{"id":5,"name":"終了","is_closed":true},{"id":6,"name":"却下","is_closed":true}]
, // /enumerations/issue_priorities.json を以下に貼り付け
"issue_priorities":[{"id":1,"name":"低め","is_default":false,"active":true},{"id":2,"name":"通常","is_default":true,"active":true},{"id":3,"name":"高め","is_default":false,"active":true},{"id":4,"name":"急いで","is_default":false,"active":true},{"id":5,"name":"今すぐ","is_default":false,"active":true}]
};

var apiKey = "";
$.get('/redmine/my/account').done(function(data){
    apiKey = $('#content > div.box > pre', $(data)).first().text();
});

// Tabulatorのjsを読み込み後、スクリプト実行
$.getScript("https://unpkg.com/tabulator-tables@4.8.1/dist/js/tabulator.min.js", function () {
    // テーブル埋め込み
    $('table.issues').after('<div id="tabulator-issues"></div>');

    var tableHeader = [];
    $('table.issues').find('th').each(function(index, ele){
        if("checkbox hide-when-print" == $(ele).attr("class")){
            // do nothing
        }else if("buttons" == $(ele).attr("class")){
            // do nothing
        }else if("id" == $(ele).attr("class")){
            tableHeader.push({title: "#", field: "rid", frozen:true, editor:false});
        }else if("tracker" == $(ele).attr("class")){
            tableHeader.push({title: $(ele).text(), field: $(ele).attr("class")}); // trackerはedit禁止とする 
        }else{
            tableHeader.push({title: $(ele).text(), field: $(ele).attr("class"), editor:true});
        }
    });
    tableHeader.push({title: "*", field: "updated", width:90, hozAlign:"center", formatter:"tickCross", sorter:"boolean", editor:false});

    var tableData = [];
    $('table.issues > tbody').find('tr').each(function(tr_index, tr_ele){
        let a_data = {id: tr_index + 1};
        $(tr_ele).find('td').each(function(index, ele){
            if("checkbox" == $(ele).attr("class")){

            }else if("id" == $(ele).attr("class")){
                a_data["rid"] = $(ele).text();
            }else{
                a_data[$(ele).attr("class")] = $(ele).text();
            }
        });
        a_data["updated"] = true;
        tableData.push(a_data);
    });


    var table = new Tabulator("#tabulator-issues", {
        height: 205, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
        data: tableData, //assign data to table
        layout: "fitColumns", //fit columns to width of table (optional)
        columns: tableHeader,
        //autoColumns: true,
        cellEdited: function(cell){
            let cell_data = cell["_cell"]["row"]["data"];
            let issue_url = "/redmine/issues/" + cell_data["rid"] + ".json";
            let posting_json = {
                "issue": {
                    "subject": cell_data["subject"],
                }
            };
            cell.getRow().update({"updated": false});
            $.ajax({
                url: issue_url,
                type: "PUT",
                data: JSON.stringify(posting_json),
                headers: {'X-Redmine-API-Key': apiKey},
                dataType: "text",
                contentType: 'application/json',
            })
            .done(function(data){
                //alert("Updated!");
                cell.getRow().update({"updated": true});
            })
            .fail(function(xhr, textStatus, errorThrown){
                alert("Failed: " + xhr.responseText);
            });
        },
    });

});
