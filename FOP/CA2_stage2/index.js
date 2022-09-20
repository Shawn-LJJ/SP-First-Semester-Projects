// Website used to add colours to text on console:
// https://www.kindacode.com/article/node-js-colorizing-console-log-output/

// Website used to read and write files:
// https://nodejs.dev/learn/writing-files-with-nodejs

//const input = require("readline-sync");
//const MemberGroup = require("./classes.js");
//const fs = require("fs");
import * as input from "readline-sync";
import {MemberGroup} from './classes.js';
import * as fs from 'fs';


main();

// a function to get and validate user input on their username or the member's name
function getNameWithValidation(user)
{
    // validating user input with regular expression
    // my definition for an appropriate name is the same as CA2 stage 1
    const re = /^([a-z]*[a-z]){2}[a-z\s]*$/i;
    do
    {
        var username = input.question(`\nPlease enter ${user} name: `);

        // create a boolean variable to store the validation result
        var nameIsInvalid = !re.test(username);
        
        if (nameIsInvalid)
        {
            console.log('\x1b[31m%s\x1b[0m', `\nPlease enter ${user} name appropriately.`);
        }
    } while (nameIsInvalid);

    return username;
}

// check if the year is a leap year. Return true if is a leap year, false if is not
function isLeapYear(year)
{
  return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
}

// get user input on the member's date of birth and validate whether the date entered is valid
function getDoB()
{
    // get current date to determine whether the user entered a future date of birth 
    var currentDate = new Date();
    // VALIDMONTHSHORTNAME will check whether user entered the month name in 3 characters, and VALIDMONTHLONGNAME will check whether user entered the month in full
    const VALIDMONTHSHORTNAME = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    const VALIDMONTHLONGNAME = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
    // the number of days in each month. This is used to compare if the user entered a date over the number of days in the month that the user entered
    var daysInEachMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    do
    {
        // get user input and split it up. Lower case the month to compare the name of the months as non-cap-sensitive
        var userInputDate = input.question("Please enter member's date of birth: ");
        var arrayOfDate = userInputDate.split(' ');
        try 
        {
            // the reason I use the try keyword is to catch for an error when converting the date to numbers, the month to lower case, and year to numbers, and if user enter inappropriately, it will throw an error
            arrayOfDate = [Number(arrayOfDate[0]), arrayOfDate[1].toLowerCase(), Number(arrayOfDate[2])];

            // this if statement checks if the date entered is in a correct format: [(int, day), (string, name of the months that exists inside the valid month names arrays), (int, year)]
            if (!(Number.isInteger(arrayOfDate[0])) || !((VALIDMONTHLONGNAME.includes(arrayOfDate[1]) || (VALIDMONTHSHORTNAME.includes(arrayOfDate[1])))) || !(Number.isInteger(arrayOfDate[2])))
            {
                throw Error
            }
        }
        catch (err)
        {
            // if user entered inappropriately, the loop will iterate back to the beginning with the continue statement to skip the remaining body of code
            console.log('\x1b[31m%s\x1b[0m', "Invalid date. Please enter again.");
            continue;
        }

        // monthIndex will store the month number minus one.
        var monthIndex;

        // check whether the month is in shortform or longform, and assign the monthIndex accordingly
        if (VALIDMONTHLONGNAME.includes(arrayOfDate[1]))
        {
            monthIndex = VALIDMONTHLONGNAME.indexOf(arrayOfDate[1]);
        }
        else
        {
            monthIndex = VALIDMONTHSHORTNAME.indexOf(arrayOfDate[1]);
        }

        // if the year that the user entered is a leap year, increase the number of days in February to 29
        if (isLeapYear(arrayOfDate[2]))
        {
            daysInEachMonth[1]++
        }

        // assign the maximum number of days in the user input month to maxDays, this variable will be used to determine whether the user entered more than the number of days in the said month
        var maxDays = daysInEachMonth[monthIndex];

        // if the user entered the date that is more than the maximum number of days in the month, or is below 1, then prompt the user the range of dates for that month and year and return the user back to retype the date
        if (arrayOfDate[0] > maxDays || arrayOfDate[0] < 1)
        {
            console.log('\x1b[31m%s\x1b[0m', `The date for ${VALIDMONTHLONGNAME[monthIndex].charAt(0).toUpperCase() + VALIDMONTHLONGNAME[monthIndex].slice(1)} ${arrayOfDate[2]} is only from 1 to ${daysInEachMonth[monthIndex]}. Please re-enter the date.`);
            continue;
        }

        // nobody alive right now in this world is borned before 1900, so prompt the user that the year is invalid and retype the date if the user entered a year before 1900 as a birth year
        if (arrayOfDate[2] < 1900)
        {
            console.log('\x1b[31m%s\x1b[0m', "Everyone who was born before 1900 had passed away. Please enter a valid date of birth again.");
            continue;
        }
        // if the user entered this year or beyond, check if the full date entered is in the future
        else if (arrayOfDate[2] >= currentDate.getFullYear())
        {
            var isFutureDate = false;
            // if the user entered this year, check if the month entered is this month or future month
            if (arrayOfDate[2] == currentDate.getFullYear())
            {
                // if the user entered this year and month, check if the date is the future date, if so, then the date of birth is invalid
                if (monthIndex == currentDate.getMonth())
                {
                    if (arrayOfDate[0] > currentDate.getDate())
                    {
                        isFutureDate = true;
                    }
                }
                // if the user entered this year but future month, then the date of birth is invalid
                else if (monthIndex > currentDate.getMonth())
                {
                    isFutureDate = true;
                }
            }
            // else if the user entered a future year, then the date of birth is invalid
            else
            {
                isFutureDate = true;
            }
            // if the user entered a future date of birth, then prompt the user it is invalid and iterate the do while loop back to the beginning to reprompt
            if (isFutureDate)
            {
                console.log('\x1b[31m%s\x1b[0m', "Nobody is allowed to travel back in time. Please enter a valid date of birth again.");
                continue;
            }
        }

        // if the program has not hit any "continue" keyword and skip past the "return" keyword, it means the user entered a valid date of birth
        return [arrayOfDate[0], monthIndex + 1, arrayOfDate[2]];

    } while (true);    
}

function editOrDelMember(memberName, memberGrp)
{
    // user must choose whether they want to edit or remove the member
    let choice = input.question("\nDo you want to edit this member's info or delete the member?\n\t\t1. Edit member's info\n\t\t2. Remove member\n\t\t3. Exit\n\t\t>> ");
    
    // this for loop will acquire the index of the member in question in the memberList so that I can easily edit or remove members
    for (var memberIndex = 0; memberIndex < memberGrp.memberList.length; memberIndex++)
    {
        if (memberGrp.memberList[memberIndex].name.toLowerCase() == memberName)
        {
            break; // break the for loop because this is the member that we want to edit or remove
        }
    }

    switch(choice)
    {
        case '1':
            do
            {
                // user will choose which member's attribute to edit
                console.log("\nWhich attribute do you want to change?\n\t\t1. Name\n\t\t2. Date of Birth\n\t\t3. Member's point\n\t\t4. Exit");
                var editOption = input.question("\t\t>> ");

                switch (editOption)
                {
                    case '1':
                        // change member's name
                        var newName = getNameWithValidation("the new member's");
                        // check the database to see if the new name entered already exists
                        var memberExists = memberGrp.searchMember(newName, true);

                        // if it exists, prompt the user that it already exists do not proceed to edit the name
                        if (memberExists)
                        {
                            console.log('\x1b[31m%s\x1b[0m', "\nMember's name exists in database. Please enter a new name.");
                        }
                        else
                        {
                            // if the name does not exists in the database, proceed to update the name
                            memberGrp.memberList[memberIndex].name = newName;
                            console.log('\x1b[32m%s\x1b[0m', "Member's name updated successfully!");
                        }
                        break;

                    case '2':
                        // change member's date of birth
                        var newDoB = getDoB();
                        memberGrp.memberList[memberIndex].dateBirth = newDoB;
                        console.log('\x1b[32m%s\x1b[0m', "Member's date of birth updated successfully!");
                        break;

                    case '3':
                        // change member's points
                        var newPoints = input.question("Enter the new points for this member: ");
                        // validate to make sure the user entered an appropriate value
                        if (isNaN(newPoints))
                        {
                            console.log('\x1b[31m%s\x1b[0m', "\nInvalid points entered.");
                            break;
                        }
                        else
                        {
                            if (!Number.isInteger(parseFloat(newPoints)) || parseFloat(newPoints) < 0)
                            {
                                console.log('\x1b[31m%s\x1b[0m', "\nThe number of points must be in positive integer only.");
                                break;
                            }
                            // if the user entered a positive integer number, proceed to change the member's points and update the rank
                            memberGrp.memberList[memberIndex].points = parseInt(newPoints);
                            console.log('\x1b[32m%s\x1b[0m', "Member's points updated successfully!");
                            memberGrp.memberList[memberIndex].updateRank();
                            break;
                        }
                    default:
                        {
                            console.log('\x1b[31m%s\x1b[0m', "\nInvalid option.");
                            break;
                        }
                    case '4':
                }
            } while (editOption != '4');

            break;
        
        case '2':
            // prompt the user whether they are sure they want to delete the member.
            console.log('\x1b[33m%s\x1b[0m', `\nAre you sure you want to delete ${memberName}? (Y) `)
            let confirm = input.question('>> ');

            // if the user entered y or Y, proceed to deleting that user. Otherwise, by default, it will not delete
            if (confirm.toUpperCase() == 'Y')
            {
                memberGrp.memberList.splice(memberIndex, 1);
                console.log('\x1b[32m%s\x1b[0m', "Member has been deleted successfully!");
            }
            break;
        
        // if the user entered an invalid choice, direct the program to the default and prompt the user
        default:
            console.log('\x1b[31m%s\x1b[0m', "\nInvalid option.");
            break;
        case '3':
    }
}

function subMenu(memberGrp)
{
    // loop through the sub-menu unless the user chose option 6 to exit to main-menu
    do
    {
        // loop through each option instead of manually typing out console.log each time
        console.log('\t\tPlease select an option from the sub-menu:');
        const LISTOFSUBCHOICES = [
            'Display names of (all) a certain type of members only.',
            'Display the name of the youngest and oldest member in the system.',
            'Display the name of members with the highest and lowest points earned.',
            'Display total number of members in each membership type.',
            'Display the total points in each membership type.',
            'Return the main-menu.'
        ];

        for (let i = 1; i <= LISTOFSUBCHOICES.length; i++)
        {
            console.log(`\t\t${i}. ${LISTOFSUBCHOICES[i - 1]}`)
        }

        var choice = input.question("\t\t>> ");
        console.log("");

        // route the user to the appropriate option based on their option typed
        switch (choice)
        {
            case '1':
                const MEMBERSHIPTYPELIST = ['ruby', 'gold', 'platinum', 'diamond'];
                do
                {
                    var invalidMembershipType = false;
                    var memberShipType = input.question("\t\tEnter Membership Type: ").toLowerCase();
                    // if the user entered a membership type that does not exists, the .indexOf() function will return a -1, so if it gives a -1, then the user entered an invalid type
                    invalidMembershipType = MEMBERSHIPTYPELIST.indexOf(memberShipType) == -1;

                    if (invalidMembershipType)
                    {
                        console.log('\x1b[31m%s\x1b[0m', '\t\tPlease enter a valid membership type.\n')
                    }
                } while(invalidMembershipType);
                // proceed to the method on displaying members by membership type
                memberGrp.showMembersByType(MEMBERSHIPTYPELIST.indexOf(memberShipType), MEMBERSHIPTYPELIST[MEMBERSHIPTYPELIST.indexOf(memberShipType)]);
                break;

            case '2':
                memberGrp.displayYoungestAndOldest();
                break;

            case '3':
                memberGrp.displayHighestAndLowest();
                break;

            case '4':
            case '5':
                memberGrp.infoForEachType(choice);
                break;

            default:
                console.log('\x1b[31m%s\x1b[0m', "\t\tPlease enter an appropriate option.");
                break;
            case '6':
        }

    } while (choice != '6')
}

function main()
{
    // create the 5 pre-existing members first
    // for this line of code below, I instantiate the membergroup class so that I can have an object storing all the members
    var memberGrp = new MemberGroup();

    // a welcome message and then prompt for the username
    console.log("\nWelcome to XYZ Membership Loyalty Programme!");

    var username = getNameWithValidation('your');

    // display the choices and get the user choice
    const LISTOFCHOICES = ["Display all members' information", "Display member information", "Add new member", "Update points earned", "Statistics", "Modify/Delete member", "Save member information", "Exit"];
    do
    {
        console.log(`\nHi ${username}, please select your choice:`);
        // using the for loop to display all the menu options
        for (let i = 0; i < LISTOFCHOICES.length; i++)
        {
            console.log(`\t${i + 1}. ${LISTOFCHOICES[i]}`);
        }

        var choice = input.question("\t>> ");
        console.log("");

        // route the user to the correct option after the user input the choice 
        switch (choice)
        {
            case '1':
                // pass nothing to the displayInfo function and let memberName variable within that function to be undefined so that it can be treated as all members
                memberGrp.searchMember();
                break;

            case '2':
            case '6':
                // get user input on the name of the member and use the searchMember method within the memberGrp to look for it and display
                let memberName = input.question("Please enter member's name: ");       
                console.log("");
                
                // display member information
                var memberExists = memberGrp.searchMember(memberName, true, true);
                // if the user chose option 6, they will proceed to editing or removing the member
                if (choice == '6' && memberExists)
                {
                    editOrDelMember(memberName.toLowerCase(), memberGrp);
                }
                else if (!memberExists)
                {
                    console.log('\x1b[31m%s\x1b[0m', "Member does not exists.");
                }
                break;

            case '3':
                // loop through to ensure the new member's name does not exist in the database
                do
                {
                    // get new member name and validate to ensure the name is appropriate
                    var newMemberName = getNameWithValidation("member's");
                    // search if the member already exists and returns a boolean to indicate its presence
                    var memberExists = memberGrp.searchMember(newMemberName, true);

                    // if it exists, prompt the user that it already exists and iterate the loop
                    if (memberExists)
                    {
                        console.log('\x1b[31m%s\x1b[0m', "\nMember's name exists in database. Please enter a new name.");
                    }

                } while (memberExists);

                // get the date of birth of the member and validate it
                let DoB = getDoB();

                // get current date and format it to [date, month number, year]
                let currentDate = new Date();
                let formattedDate = [currentDate.getDate(), currentDate.getMonth() + 1, currentDate.getFullYear()];

                // create the new member
                memberGrp.createMember([newMemberName, 0, formattedDate, DoB, 0]);
                console.log('\x1b[32m%s\x1b[0m', 'Member added successfully!');
                break;
            
            case '4':
                // get the existing member's name to update the points
                var memberNameToUpdate = input.question("Please enter member's name: ");

                // if the member exists, proceed to prompting for the amount spent, otherwise, prompt that the member does not exist
                if (memberGrp.searchMember(memberNameToUpdate, true))
                {
                    let amountSpent = parseFloat(input.question("Please enter amount spent: "));

                    // if the user entered 0 or negative value, or enter a value with more than 2 decimal points, the user will be prompted to enter an appropriate value
                    if (isNaN(amountSpent) || amountSpent <= 0 || (amountSpent.toString() + ".0").split(".")[1].length > 2)
                    {
                        console.log('\x1b[31m%s\x1b[0m', "\nPlease enter an appropriate amount spent.")
                    }
                    else
                    {
                        // if the user entered an existing member's name and an appropriate value spent, proceed to updating the member's points
                        memberGrp.updatePoints(memberNameToUpdate, amountSpent);
                    }
                }
                else
                {
                    console.log('\x1b[31m%s\x1b[0m', "\nMember does not exists.");
                }

                break;
            
            case '5':
                // proceed to another function to display sub-menu
                subMenu(memberGrp);
                break;

            case '7':
                // the empty array below will store the list of members in an array format rather than in object format
                var memberListArrs = [];
                // loop through the member group object, for each each member object, create an array consisting of the member's properties, and then append into the memberListArrs
                for (var i = 0; i < memberGrp.memberList.length; i++)
                {
                    memberListArrs.push([memberGrp.memberList[i].name, memberGrp.memberList[i].membership, memberGrp.memberList[i].dateJoin, memberGrp.memberList[i].dateBirth, memberGrp.memberList[i].points]);
                }

                // convert the array into a string in an object format so that it can be stored in a .json file
                var data = JSON.stringify({
                    'memberListObject':memberListArrs
                })
                
                // attempt to write the data to data.json. Prompt an error message if it fails.
                try 
                {
                    fs.writeFileSync('data.json', data);
                    console.log('\x1b[32m%s\x1b[0m', 'Member info saved successfully!');
                } 
                catch (err) 
                {
                    console.log('\x1b[31m%s\x1b[0m', "\nWarning. Error occured while saving.");
                }
                break;

            case '8':
                console.log("Thank you and goodbye!\n");
                break;

            default:
                console.log('\x1b[31m%s\x1b[0m', "Please enter an appropriate option.")
        }
    } while (choice != '8')
}