var input = require("readline-sync");

// Input name section -- acquire the name from the user and check if the name input is appropriate.
// My own definition of a proper name is that it needs at least 2 characters and only contain alphabets and white spaces.

console.log(`Welcome to XYZ Membership Loyalty Programme!`);

do                                      
{
    var username = input.question(`Please enter your name: `);

    var nameValidity = (username.length >= 2 && username.match(/[^a-z\s]/i) == null);     // use boolean variable to determine if the name is valid, no need to keep testing

    // regular expression is used to detect any characters that are not alphabet or white spaces
    
    if (!nameValidity)      // if the name is invalid, prompt the user
    {
        console.log("Please enter an appropriate name.\n");
    }

} while(!nameValidity);     // if the name is invalid, the user will have to re-enter


// Declaring and initialising the list of members and storing them into the memberList array

var memberList = [
    ["Leonardo", "Gold", "1 Dec 2019", "1 Jan 1980", 1400],
    ["Catherine", "Ruby", "14 Jan 2020", "28 Oct 1985", 250],
    ["Luther", "Gold", "29 Apr 2020", "16 Mar 1992", 3350],
    ["Bruce", "Diamond", "3 Jun 2020", "18 Mar 1994", 40200],
    ["Amy", "Ruby", "5 Jun 2020", "31 May 2020", 500]
];

// Declare an array on members property types 

var membersProperties = ["Name", "Membership Type", "Date joined", "Date of birth", "Points Earned"];


// The selection section 

do
{
    var option = input.question(`\nHi ${username}, please select your choice:\n\t1. Display all members' information\n\t2. Update points earned\n\t3. Statistics\n\t4. Exit\n\t>> `)

    // using escape sequence to print next line so that we can obtain a table-like output


    switch (option)     // switch is used to direct the user input option to the appropriate case
    {
        case "1":         // Check member list
            
            for (var i = 0; i < memberList.length; i++)     // loop through each member in the member list
            {
                console.log("");
                for (var j = 0; j < 5; j++)                 // loop through each property of a member
                {
                    console.log(`${membersProperties[j]}: ${memberList[i][j]}`);            // output: "(property type): (property value)"
                }
            }
            break;

        case "2":                                           // work in progress
        case "3":
            console.log("Sorry, work in progress!");
            break;
        case "4":                                           // print goodbye message and break because we do not want the program to do anything other than exiting
            console.log("Thank you & goodbye!");
            break;
        default:                                            // error message if user enter anything other than case 1, 2, 3, or 4
            console.log("Please enter a valid input.");
    }

} while (option != 4)