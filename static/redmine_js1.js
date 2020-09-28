// テーマのロード。お好みのものを。
//$("head").append('<link href="https://unpkg.com/tabulator-tables@4.8.1/dist/css/tabulator.min.css" rel="stylesheet">'); // 標準
$("head").append('<link href="https://unpkg.com/tabulator-tables@4.8.1/dist/css/tabulator_simple.min.css" rel="stylesheet">'); // シンプル
//$("head").append('<link href="https://unpkg.com/tabulator-tables@4.8.1/dist/css/bootstrap/tabulator_bootstrap.min.css" rel="stylesheet">'); // Bootstrap3

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
