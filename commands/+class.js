const Discord = module.require('discord.js');
const fs = require('fs');
const puppeteer = require('puppeteer');

module.exports.run = async (bot, message, args) => {
  let itemUrl = "https://opentimetable.dcu.ie/";
  var command = args[0];
  var course = args[1];
  var hoursfromnow = args[2];
  var daysfromnow = args[3];
  var xcord = 0;
  var ycord = 0;

// give advice if command misused
  if (!command || !course){
    var command = "help";
  }

// set undefinded stuff to 0
  if (!hoursfromnow){
    var hoursfromnow = 0;
    var daysfromnow = 0;
  }

  if (!daysfromnow){
    var daysfromnow = 0;
  }

// get date info
  var curtime = new Date();
  var hour = Math.floor(+hoursfromnow + +curtime.getHours());
  var day = Math.floor(+daysfromnow + +curtime.getDay());

// log for debug
console.log("Hours from now: " + hoursfromnow)
console.log("Days from now: " + daysfromnow)
console.log("Hour: " + hour)
console.log("Day: " + day)

// day 0 is sunday so im gonna make it the 7th day for ease of use
  if (day === 0){
    var day = 7;}

// how to use command
  if (command == "help"){
    message.channel.send(`Usage: +class info (course) (hours from now {wip}) (days from now {wip})`);
  }
  if (command == "info"){

      message.channel.send(`Getting Class Info...`);
// attempt to get class info
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.setViewport({ width: 1920, height: 1080 });
      await page.goto(itemUrl, { waitUntil: 'networkidle2'});
      await page.mouse.move(50, 160, {steps: 5}); // goto dropdown
      await page.mouse.down();  // click dropdown
      await page.mouse.up();
      await page.keyboard.press('ArrowDown'); // navigate to courses in dropdown
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter'); // select courses in dropdown
      await page.mouse.move(50, 190, {steps: 5}); // goto course search box
      await page.mouse.down(); // click course search box
      await page.mouse.up();
      await page.keyboard.type(course); // fill in search box
      await page.mouse.move(104, 296, {steps: 5}); // goto course selector
      await page.waitFor(2000); // wait for course to show up
      await page.mouse.down(); // select course
      await page.mouse.up();
      await page.waitFor(2000); // wait for time table to load
      message.channel.send('Done!');
      await page.screenshot({ path: 'timetable.png' })
      message.channel.send("", { files: ["./timetable.png"] });
// days to x cords
      if (day === 1){var xcord = 600;}
      if (day === 2){var xcord = 900;}
      if (day === 3){var xcord = 1200;}
      if (day === 4){var xcord = 1500;}
      if (day === 5){var xcord = 1800;}
      if (day > 5){var xcord = 600;} // no weekend courses
// hours to y cords
      if (hour < 8){var ycord = 250;}
      if (hour === 8){var ycord = 250;}
      if (hour === 9){var ycord = 310;}
      if (hour === 10){var ycord = 360;}
      if (hour === 11){var ycord = 420;}
      if (hour === 12){var ycord = 480;}
      if (hour === 13){var ycord = 540;}
      if (hour === 14){var ycord = 600;}
      if (hour === 15){var ycord = 650;}
      if (hour === 16){var ycord = 700;}
      if (hour === 17){var ycord = 750;}
      if (hour === 18){var ycord = 800;}
      if (hour === 19){var ycord = 850;}
      if (hour === 20){var ycord = 910;}
      if (hour === 21){var ycord = 970;}
      if (hour > 21){var ycord = 250;} // no courses past 9

      await page.mouse.move( xcord , ycord , {steps: 5}); // goto cords / class
      await page.mouse.down(); // select class
      await page.mouse.up();
      await page.waitFor(1500); // wait for load
// find element data
      let itemdata = await page.evaluate(() => {
          let classname = document.querySelector("body > app-root > app-layout > app-desktop > div.wrapper > div > div.right-sidebar.slid-in-right-sidebar > app-activity-details > div > div > div.c-filter-block > div.c-filter-block__item.js-pg-changemanage-filter.is-disabled.i-core.i-core--file-text2 > p > span").innerText;
          let lecturer = document.querySelector("body > app-root > app-layout > app-desktop > div.wrapper > div > div.right-sidebar.slid-in-right-sidebar > app-activity-details > div > div > div.c-filter-block > div.c-filter-block__item.js-pg-changemanage-filter.is-disabled.i-core.i-core--staff > p > span").innerText;
          let location = document.querySelector("body > app-root > app-layout > app-desktop > div.wrapper > div > div.right-sidebar.slid-in-right-sidebar > app-activity-details > div > div > div.c-filter-block > div.c-filter-block__item.js-pg-changemanage-filter.is-disabled.i-core.i-core--location > p > span").innerText;
          let classtime = document.querySelector("body > app-root > app-layout > app-desktop > div.wrapper > div > div.right-sidebar.slid-in-right-sidebar > app-activity-details > div > div > div.c-filter-block > div.c-filter-block__item.js-pg-changemanage-filter.is-disabled.i-core.i-core--time > p > span").innerText;
          let classdate = document.querySelector("body > app-root > app-layout > app-desktop > div.wrapper > div > div.right-sidebar.slid-in-right-sidebar > app-activity-details > div > div > div.c-filter-block > div.c-filter-block__item.js-pg-changemanage-filter.is-disabled.i-core.i-core--date-picker > p > span").innerText;
          let classday = document.querySelector("body > app-root > app-layout > app-desktop > div.wrapper > div > div.right-sidebar.slid-in-right-sidebar > app-activity-details > div > div > div.c-filter-block > div.c-filter-block__item.js-pg-changemanage-filter.is-disabled.i-core.i-core--calendar-day > p > span").innerText;
          return {classname, location, lecturer, classday, classdate, classtime}
        });
// use element data
        console.log(itemdata);
        let classname = itemdata["classname"];
        let lecturer = itemdata["lecturer"];
        let location = itemdata["location"];
        let classday = itemdata["classday"];
        let classdate = itemdata["classdate"];
        let classtime = itemdata["classtime"];
// process building text
        let rawlocation = location.split('.')[1];
        let finallocation = rawlocation.split(',')[0];
        var buildingletters = finallocation.match(/[a-zA-Z]+/g);
// find building
        if (String(buildingletters) === "L" || String(buildingletters) === "LG"){
          var building = "McNulty Building";
          var image = "https://cdn.discordapp.com/attachments/491690629378736139/630192317223010314/McNultyBuilding.png";
        } else if (String(buildingletters) === "N" || String(buildingletters) === "NG") {
          var building = "Marconi Building";
          var image = "https://cdn.discordapp.com/attachments/491690629378736139/630192315222327296/MarconiBuilding.png";
        } else if (String(buildingletters) === "X" || String(buildingletters) === "XG" || String(buildingletters) === 'XG,A,B,') {
          var building = "Lonsdale Building";
          var image = "https://cdn.discordapp.com/attachments/491690629378736139/630192313435684883/LonsdaleBuilding.png";
        } else if (String(buildingletters) === "S" || String(buildingletters) === "SG" || String(buildingletters) === "SA") {
          var building = "Stokes Building";
          var image = "https://cdn.discordapp.com/attachments/491690629378736139/630192318334500895/StokesBuilding.png";
        } else if (String(buildingletters) === "Q" || String(buildingletters) === "QG") {
          var building = "DCU Business School";
          var image = "https://cdn.discordapp.com/attachments/491690629378736139/630192323321397249/DCUBusinessSchool.png";
        } else if (String(buildingletters) === "C" || String(buildingletters) === "CG") {
          var building = "Henry Grattan Building";
          var image = "https://cdn.discordapp.com/attachments/491690629378736139/630192311007051796/HenryGrattanBuilding.png";
        } else if (String(buildingletters) === "H" || String(buildingletters) === "HG") {
          var building = "Healthy Living Center";
          var image = "https://cdn.discordapp.com/attachments/491690629378736139/630192328937570325/HealthyLivingCentre.png";
        } else if (String(buildingletters) === "A" || String(buildingletters) === "AG") {
          var building = "Albert College";
          var image = "https://cdn.discordapp.com/attachments/491690629378736139/630192321907916831/AlbertCollege.png";
        } else if (String(buildingletters) === "T" || String(buildingletters) === "TG") {
          var building = "Terence Larkin Theatre";
          var image = "https://cdn.discordapp.com/attachments/491690629378736139/630192319437602817/TerenceLarkinTheatre.png";
        } else {
          var building = buildingletters + ", Unknown/Unimplemented Building";
          var image = "https://cdn.discordapp.com/attachments/491690629378736139/630192609222066185/20191004_112248_-_Copy.jpg"
          }
// make discord form
        let messageform = new Discord.RichEmbed()
            .setAuthor("CLASS INFO")
            .setColor("FFD800")
            .addField("Class Name:", classname, false)
            .addField("Location:", location, false)
            .addField("Building:", building, false)
            .addField("Time:", classtime, false)
            .addField("Day:", classday, false)
            .addField("Lecturer:", lecturer, false)
            .setImage(image)
            .setFooter(`Date: ` + classdate, message.author.displayAvatarURL);
// send discord form
        message.channel.send(messageform);
      await browser.close();
  }
}
