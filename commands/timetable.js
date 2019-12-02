const Request = require('request-promise')
const Utility = require("../utilfunctions/utility");

const Weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

function StartOfWeek() {
    date = new Date()

    var diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
  
    FirstDayInWeek = new Date(date.setDate(diff)).toISOString()
    return FirstDayInWeek.slice(0, -14).concat("T00:00:00.000Z")
    // Should output something like 2019-10-21T00:00:00.000Z
}

function LoadNewTemplate() {
    let NewTemplate = require('../variables/req-template.json')

    return NewTemplate
}

function EditTemplate(template, DayName) {
    let FinalDayName;
    let FinalDayNumber;

    if (DayName != null) {
        FinalDayNumber = Weekdays.indexOf(DayName) + 1
        FinalDayName = DayName
    } else {
        FinalDayNumber = DayNumber = new Date().getDay()
        FinalDayName = Weekdays[DayNumber - 1]
    }

    /*if (DayNumber > Weekdays.length && Weekdays.indexOf(DayName) == -1) {
        DayNumber = DayNumber = new Date().getDay()
        Day = Weekdays[DayNumber - 1]
    }*/

    template['ViewOptions']['Weeks'][0]['FirstDayInWeek'] = StartOfWeek()
    template['ViewOptions']['Days'][0]['Name'] = FinalDayName
    template['ViewOptions']['Days'][0]['DayOfWeek'] = FinalDayNumber
    
    return template
}

function SortByTime(Arr) {
    return new Promise(function(resolve, reject) {
        resolve(Arr.sort((a,b)=> a.Time.slice(0, -3) - b.Time.slice(0, -3)))
    })
}

function FetchTimetable(Body) {

    const ReqHeaders = {
        "Authorization": "basic T64Mdy7m[",
        "Content-Type" : "application/json; charset=utf-8",
        "credentials": "include",
        "Referer" : "https://opentimetable.dcu.ie/",
        "Origin" : "https://opentimetable.dcu.ie/"
    }

    var ReqPayload = {
        method: 'POST',
        uri: 'https://opentimetable.dcu.ie/broker/api/categoryTypes/241e4d36-60e0-49f8-b27e-99416745d98d/categories/events/filter',
        headers: ReqHeaders,
        body: Body,
        json: true
    };

    return new Promise(function(resolve, reject) {
        Request(ReqPayload)
            .then(function (res_body) {
                resolve(res_body)
            })
            .catch(function (err) {
                reject(err)
            });
    })
}

module.exports.run = async (bot, message, args, purpose) => {
    return new Promise(function(resolve, reject) {
        DayToCheck = null

        if (args != null && args.length == 1) {
            DayToCheck = args[0]
        }

        FetchTimetable(EditTemplate(LoadNewTemplate(), DayToCheck))
        .then(Classes => {
            let ClassesToday = []

            ClassesArray = Classes[0].CategoryEvents
            ClassesArray.forEach(Class => {
                let ThisClass = new Object
                ThisClass.ClassName = Class.Description
                ThisClass.Type = Class.EventType
                ThisClass.Time = Class.StartDateTime.slice(11, -9)
                ThisClass.Location = Class.Location.substring(4)

                if (ThisClass.Time == '08:00') { ThisClass.Time = '09:00' } // because apparently maths starts at 8

                ClassesToday.push(ThisClass)
            });
        
            SortByTime(ClassesToday)
            .then(SortedArray => {
                Str = "" // for sending on discord
                Str2 = "" // for use with the google assistant

                Object.keys(SortedArray).forEach(Property => {
                    let CurrClass = SortedArray[Property]
        
                    if (CurrClass.ClassName == null) { // because apparently fucking IT Mathematics is null? lol
                        CurrClass.ClassName = 'IT Mathematics'
                    }

                    
                    let CurrentTime = new Date().toISOString()
                    let Day = new Date().getDay() - 1

                    if ((CurrentTime.slice(11, -11) > CurrClass.Time.slice(0, -3)) && Weekdays.indexOf(args[0]) <= Day) {
                        // if the day has already passed we want to mark the lectures as done too
                        Str = Str + (`\n\n *${CurrClass.ClassName}* (${CurrClass.Type}) - @ **${CurrClass.Time}** in ${CurrClass.Location} ✅`)
                    } else {
                        Str = Str + (`\n\n *${CurrClass.ClassName}* (${CurrClass.Type}) - @ **${CurrClass.Time}** in ${CurrClass.Location}`)
                    }
                    Str2 = Str2 + (`\n\n ${CurrClass.ClassName} (${CurrClass.Type}) - @ ${CurrClass.Time} in ${CurrClass.Location}`)
                })

                if (message != null) {
                    message.channel.send(Utility.Embedify(bot, Str))
                }
                if (purpose == "GA") {
                    resolve(Str2)
                } else {
                    resolve(Str)
                }
            })
        })
        .catch(err => {
            console.log(err)
            reject(err)
        })
    })
}