const rp = require('request-promise');
const cheerio = require('cheerio');

var Utility = require("../utilfunctions/utility");

function HTMLtoJSON(rawHTML) {
    let options = {
        uri: 'https://toolslick.com/api/process',
        method: 'POST',
        formData: {
            tool: 'data-html-to-json-converter',
            parameters: JSON.stringify({
                "indent":true,
                "unescapeJson":true,
                "mode":"Auto",
                "attributePrefix":"@",
                "textPropertyName":"#text",
                "input": rawHTML
            })
        }
    };
    
    return new Promise(function(resolve, reject) {
        rp(options)
        .then(function(response) {
            resolve(response)
        })
        .catch(function (err) {
            reject(err)
        });
    })
}

function FetchStopInfo(StopNumber) {
    let options = {
        uri: `http://rtpi.ie/Basic/WebDisplay.aspx?stopRef=${StopNumber}`,
        method: 'GET',
        transform: function (body) {
            return cheerio.load(body);
        }
    };

    return new Promise(function(resolve, reject) {
        rp(options)
        .then(function($) {
            let BusStopData = HTMLtoJSON($('#PanelRepeater').html())
            resolve(BusStopData)
        })
        .catch(function (err) {
            reject(err)
        });
    })
}

module.exports.run = async (bot, message, args) => {
        if (args.length == 0) {
            Utility.argumentsUsedExample(bot, message, "stop", "!bus 7571");
            return;
        } else if (args.length > 0) {
            FetchStopInfo(args[0])
            .then(buses => {
                let BusData = Array.from(JSON.parse(buses))
                let Schedule = "";
            
                for(var i in BusData) {
                    let Bus = BusData[i]
                    Schedule += (`*${Bus.Service} to ${Bus.To}* - **${Bus.Time}** \n \n`);
                }
            
                message.channel.send(Utility.Embedify(bot, Schedule));
            })
       }
}