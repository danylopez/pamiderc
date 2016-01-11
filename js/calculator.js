
$(document).ready(function (){
    //fixing bug add-on currency size
    initRangeSliders();
    $(":radio").labelauty({  minimum_width: "50px"});
    allowJustNumbers();
     $('[data-toggle="tooltip"]').tooltip(); 
    fillPeriodSelect('a');
   $("input[name=timeUnitsRadio]:radio").change(function (){
        onPeriodKindChange();
    });
});

function onPeriodKindChange(){
    $('#plazoSelect').find('option:enabled').remove(); //optimize this later
    var timeUnits = $('input[name=timeUnitsRadio]:checked').val();
    fillPeriodSelect(timeUnits);
    
}

function fillPeriodSelect(timeUnits){
    var units;
    var months = [1,3,6,9,15,18,30];
    var years =[1,2,3,4,5,6,7,8,9,10,11,12,13,15,15];
    if(timeUnits=='a'){units=years;}
    if(timeUnits=='m'){units=months;}
    
    for(var i=0;i<units.length;i++){
        $('#plazoSelect').append($('<option>', {
            value: units[i],
            text: units[i]
        }));
    }
}

function setBestTaxRate(){
    
  var amount = $('#bestTaxRate');
  amount.val(50);  
}

function initRangeSliders(){
    var amount = $('#amountSlider');
    var bestTaxRateSlider = $('#bestTaxRate');
    //rangeslider initialization
    amount.rangeslider({

        // Deactivate the feature detection
        polyfill: false,

        // Callback function
        onInit: function() {
           // valueOutput(this.$element[0]);

        },

        // Callback function
        onSlide: function(position, value) {
            $('#amountText').val(value);
        },
        // Callback function
        onSlideEnd: function(position, value) {

        }
    });
    
    bestTaxRateSlider.rangeslider({

        // Deactivate the feature detection
        polyfill: false
      
    });
}

function allowJustNumbers(){

    $('#amountText').keydown(function (e){
         if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
             // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) ||
             // Allow: Ctrl+C
            (e.keyCode == 67 && e.ctrlKey === true) ||
             // Allow: Ctrl+X
            (e.keyCode == 88 && e.ctrlKey === true) ||
             // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
                 // let it happen, don't do anything
                 return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });

}