// JSON Data Example
var dataJSON = [
  {
    "week":13,
    "activities":[
      {
        "id":13,
        "area":"Fisciano - Molding",
        "type" : "Mechanical",
        "intTime" : 120
      },
      {
        "id":14,
        "area":"Nusco - Carpentry",
        "type" : "Electric",
        "intTime" : 30
      }
    ]
  },

  {
    "week" : 25,
    "activities" : [
      {
        "id":20,
        "area":"Morra - Painting",
        "type" : "Hydraulic",
        "intTime" : 250
      },
      {
        "id":21,
        "area":"Fisciano - Molding",
        "type" : "Electronics",
        "intTime" : 90
      },
      {
        "id":22,
        "area":"Morra - Molding",
        "type" : "Electric",
        "intTime" : 75
      }
    ]
  },

  {
    "week" : 43,
    "activities" : [
      {
        "id":35,
        "area":"Fisciano - Painting",
        "type" : "Hydraulic",
        "intTime" : 125
      },
      {
        "id":36,
        "area":"Fisciano - Carpentry",
        "type" : "Hydraulic",
        "intTime" : 100
      },
      {
        "id":37,
        "area":"Nusco - Molding",
        "type" : "Electric",
        "intTime" : 20
      }
    ]
  },

  {
    "week" : 45,
    "activities" :
    [
      {
        "id":50,
        "area":"Fisciano - Molding",
        "type" : "Hydraulic",
        "intTime" : 45
      },
      {
        "id":52,
        "area":"Nusco - Carpentry",
        "type" : "Mechanical",
        "intTime" : 60
      },
      {
        "id":53,
        "area":"Morra - Painting",
        "type" : "Electronics",
        "intTime" : 200
      }
    ]
  }
];


// Calculate current week
Date.prototype.getWeek = function () {
    var target  = new Date(this.valueOf());
    var dayNr   = (this.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    var firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() != 4) {
        target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - target) / 604800000);
}

var date = new Date();
let today = date.toLocaleDateString()
var currentWeek = date.getWeek();

$("#currentDate").text(today);
$("#currentWeek").text(currentWeek);

// add weeks buttons
function addWeeks(){
  for (var i = 1; i <= 53; i++) {

    // add card collapse
    $(".weeks").append(
      '<div class="card"><div class="card-header" id="heading' + i +

      '"><h2 class="mb-0"><button class="btn btn-outline-secondary btn-block text-center font-weight-bold" type="button" data-toggle="collapse" ' +
      'data-target="#collapse' + i + '" aria-expanded="false" aria-controls="collapse'+ i + '">' +
              '<i class="fas fa-caret-down"></i>Week' + i + '<i class="fas fa-caret-down"></i></button></h2></div>'
    );

    addCollapseTarget(i);
  }
};

// add table for week
function addCollapseTarget(id){
  var HTMLCode = '<div id="collapse' + id +'" class="collapse" aria-labelledby="heading' + id + '" data-parent="#accordionWeeks">' +
    `<div class="card-body">
      <div class="table-responsive">
        <table class="table table-striped table-hover table-sm text-center" id="table` + id + `">
          <thead class="thead-dark">
            <tr>
              <th>#</th>
              <th>Area</th>
              <th>Type</th>
              <th>Intervention Time[min]</th>
              <th></th>
            </tr>
          </thead>
          <tbody class="tbody` + id + `">

          </tbody>
        </table>
      </div>
      <div class='text-center'>
        <button type="button" class="btn btn-sm btn-warning text-right" data-toggle="modal" data-target="#planModal" data-week="` + id + `">Add Activity</button>
      </div>
    </div>
  `;

  $(".weeks").append(HTMLCode);
};

function loadTable(){
  // jQuery.getJSON('activityByWeek.json', function(data) {});
        var tr;
        for (var i = 0; i < dataJSON.length; i++) {
          var week = dataJSON[i].week;
          $.each(dataJSON[i].activities, function(key, value){
              //console.log(value);
              var activity = value.id + " - " + value.area + " - " + value.type+ " - " + value.intTime+ "'";
              var tableData = `
              <tr>
                <td>` + value.id + `</td>
                <td>` + value.area + `</td>
                <td>` + value.type + `</td>
                <td>` + value.intTime + `</td>
                <td>
                  <button data-toggle="modal" data-target="#selectedModal" data-week="` + week + `" data-activity="` + activity + `" id="` + value.id + `" type="button" class="btn btn-sm btn-block btn-outline-primary">Select</button>
                </td>
              </tr>
              `;
              $(".tbody"+week).append(tableData);
              $("#table"+week).addClass("");
//              table-striped table-hover
          });
          //console.log(dataJSON[i].week);
        }
};


addWeeks();
loadTable();
$("#collapse" + currentWeek).collapse();

$("#accordionWeeks").on('shown.bs.collapse', function (event) {
  //console.log(event);
  $('[data-target="#' + event.target.id +'"]').removeClass('btn-outline-secondary').addClass("btn-blue");
  var element = document.getElementById(event.target.id);
  element.scrollIntoView({behavior: "smooth", block: "center"});
});

$("#accordionWeeks").on('hide.bs.collapse', function (event) {
  //console.log(event);
  $('[data-target="#' + event.target.id +'"]').removeClass('btn-blue').addClass("btn-outline-secondary");
});

$('#planModal').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget); // Button that triggered the modal
  var activityWeek = button.data('week'); // Extract info from data-* attributes
  var modal = $(this)
  modal.find('.modal-title').text('Plan Activity for week ' +  activityWeek);
  modal.find('#activity-week').val(activityWeek);
});

$('#selectedModal').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget); // Button that triggered the modal
  console.log(button);
  var activity = button.data('activity'); // Extract info from data-* attributes
  var id = button.attr("id");
  var week = button.data("week");
  var modal = $(this)
  modal.find('.modal-title').text('Selected activity # ' +  id);
  modal.find('#selected-activity-week').text(week);
  modal.find('#selected-activity').text(activity);
});
