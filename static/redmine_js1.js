// �e�[�}�̃��[�h�B���D�݂̂��̂��B
//$("head").append('<link href="https://unpkg.com/tabulator-tables@4.8.1/dist/css/tabulator.min.css" rel="stylesheet">'); // �W��
$("head").append('<link href="https://unpkg.com/tabulator-tables@4.8.1/dist/css/tabulator_simple.min.css" rel="stylesheet">'); // �V���v��
//$("head").append('<link href="https://unpkg.com/tabulator-tables@4.8.1/dist/css/bootstrap/tabulator_bootstrap.min.css" rel="stylesheet">'); // Bootstrap3

// Tabulator��js��ǂݍ��݌�A�X�N���v�g���s
$.getScript("https://unpkg.com/tabulator-tables@4.8.1/dist/js/tabulator.min.js", function () {
    // �e�[�u�����ߍ���
    $('table.issues').after('<div id="tabulator-issues"></div>');

    var tableHeader = [];
    $('table.issues').find('th').each(function(index, ele){
        if("checkbox" == $(ele).attr("class")){

        }else if("id" == $(ele).attr("class")){
            tableHeader.push({title: "#", field: "rid"});
        }else if("tracker" == $(ele).attr("class")){
            tableHeader.push({title: "Tracker", field: "tracker"});
        }else if("status" == $(ele).attr("class")){
            tableHeader.push({title: "Status", field: "status"});
        }else if("priority" == $(ele).attr("class")){
            tableHeader.push({title: "�D��x", field: "priority"});
        }else if("subject" == $(ele).attr("class")){
            tableHeader.push({title: "�薼", field: "subject"});
        }else if("assigned_to" == $(ele).attr("class")){
            tableHeader.push({title: "�S����", field: "assigned_to"});
        }
    });

    var tableData = [];
    $('table.issues > tbody').find('tr').each(function(tr_index, tr_ele){
        let a_data = {id: tr_index + 1};
        $(tr_ele).find('td').each(function(index, ele){
            if("checkbox" == $(ele).attr("class")){

            }else if("id" == $(ele).attr("class")){
                a_data["rid"] = $(ele).text();
            }else if("tracker" == $(ele).attr("class")){
                a_data["tracker"] = $(ele).text();
            }else if("status" == $(ele).attr("class")){
                a_data["status"] = $(ele).text();
            }else if("priority" == $(ele).attr("class")){
                a_data["priority"] = $(ele).text();
            }else if("subject" == $(ele).attr("class")){
                a_data["subject"] = $(ele).text();
            }else if("assigned_to" == $(ele).attr("class")){
                a_data["assigned_to"] = $(ele).text();
            }
        });
        tableData.push(a_data);
    });


    var table = new Tabulator("#tabulator-issues", {
        height: 205, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
        data: tableData, //assign data to table
        layout: "fitColumns", //fit columns to width of table (optional)
        columns: tableHeader,
        //autoColumns: true,
    });

});