import $ from 'jquery';

/**
 *  Requests data from the given url, parses the JSON by default
 *  Returns the data found
 */
const requestData = (url, parse = true) => {
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
            console.log('Error ' + error.message);
        }
    })
    return data;
}

export default requestData;