import $ from 'jquery';

function requestData(url, parse = true) {
    var data;
    $.ajax({
        url: url,
        type: "GET",
        async: false,
        success: function(result) {
            if (parse) {
                data = JSON.parse(result);
            }
            else {
                data = result;
            }
        },
        error: function(error) {
            // Handle this better, return an error of some kind
            console.log('Error ' + error.message);
        }
    })
    return data;
}

export default requestData;