//const fs = require("fs");
import * as fs from 'fs';

// class member to create a member object
class Member 
{
    constructor(values)
    {
        this.name = values[0];
        this.membership = values[1];
        this.dateJoin = values[2];
        this.dateBirth = values[3];
        this.points = values[4];
    }

    // this method is use to map the membership type index to its appropriate membership type name
    getMembershipTypeName(membershipIndex = this.membership) 
    {
        const MEMBERSHIPTYPELIST = ['Ruby', 'Gold', 'Platinum', 'Diamond'];
        return MEMBERSHIPTYPELIST[membershipIndex];
    }

    // this method updates points by checking the member's points to see which rank the member's points meet the minimum requirement of
    updateRank()
    {
        const RANKBYPOINTS = [0, 500, 5000, 20000];
        const ORIGINALRANK = this.membership;

        // looping through the minimum points for each rank, reassign the member's rank until it reaches the rank that the member does not satisfy or at the top rank
        for (var i = 0; i < RANKBYPOINTS.length; i++)
        {
            if (this.points >= RANKBYPOINTS[i])
            {
                this.membership = i;
            }
            else
            {
                break;
            }
        }
        
        // decrement i by 1 because the i will be the index of the member's next rank rather than the current rank
        i--;
        // if the member's updated rank is higher than the original rank, display to show that the member has promoted in rank
        if (ORIGINALRANK < i)
        {
            console.log('\x1b[32m%s\x1b[0m', `${this.name}'s membership type has been promoted from ${this.getMembershipTypeName(ORIGINALRANK)} to ${this.getMembershipTypeName(i)}.`);                    
        }
    }
}

export class MemberGroup 
{
    constructor()
    {
        // the memberList property will be used to store all members objects
        this.memberList = [];
        
        // using try to attempt to get the data from a different file so if it catches an error, go to the catch section and prompt the user it cannot retrieve data
        // if it cannot retrieve any data, the data in memory will be empty
        try 
        {
            // the code below will attempt to retrieve the content in data.json and parse as object and store into memberListInObject variable
            let memberListInObject = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
            // loop through each member in the object, and attempt to create each of them
            for (let i = 0; i < memberListInObject["memberListObject"].length; i++)
            {
                this.createMember(memberListInObject["memberListObject"][i]);
            }
        } 
        catch (err) 
        {
            console.log('\x1b[31m%s\x1b[0m', "Warning, unable to retrieve member's data! ");
        }
    }

    // create a new member by instantiating the Member class and append into the memberList array
    createMember(listOfValues)
    {
        // listOfValues = ['Name', 'Rank', 'Joined date', 'Date of birth', 'points']
        this.memberList.push(new Member(listOfValues));
    }

    // search for the member and decide whether to return a boolean and also decide whether to display member's information
    // if memberName is null, print all the users and do not return anything
    // if returnBool is true, this method will return a boolean to signal whether the member exists in this.memberList
    // if displayMember is true, this method will display the member's info if memberName is not null
    searchMember(memberName = null, returnBool = false, displayMember = false) 
    {
        if (memberName == null)
        {
            for (let i = 0; i < this.memberList.length; i++)
            {
                printMemberInfo(this.memberList[i]);
            }  
        }
        else
        {
            for (let i = 0; i < this.memberList.length; i++)
            {
                if (this.memberList[i].name.toLowerCase() == memberName.toLowerCase())
                {
                    if (displayMember)
                    {
                        printMemberInfo(this.memberList[i]);
                    }
                    if (returnBool)
                    {
                        return true;
                    }
                }
            }
            if (returnBool)
            {
                return false;
            }
        }
    }

    // update the points based on the amount spent on the member and then update the rank
    updatePoints(memberName, amountSpent)
    {
        // create a list of minimum spending for each points earned as well as the list of points earned that correspond to the minimum amount spent
        const SPENTLIST = [0, 50.01, 100.01, 200.01, 500.01, 1000.01, 2500.01];
        const POINTSlIST = [10, 50, 100, 200, 500, 1000, 2000];
        // by doing so, i can loop through the minimum spending list, and compare with the member's amount spent
        // if the member's amount spent is higher than the minimum spending, assign its corresponding points earned to a variable until the amount spent no longer meets the minimum requirement
        var pointsEarned;
        for (let i = 0; i < SPENTLIST.length; i++)
        {
            if (amountSpent >= SPENTLIST[i])
            {
                // the pointsEarned variable will be used to add the member's points later on
                pointsEarned = POINTSlIST[i];
            }
            else
            {
                // if the amount spent is no longer equal or higher than the minimum spending, break the loop so that the pointsEarned don't get reassign a higher value
                break;
            }
        }
        // search through the member, if it detects the member, increment the total points and then update the rank, and break the loop
        for (let i = 0; i < this.memberList.length; i++)
        {
            if (this.memberList[i].name.toLowerCase() == memberName.toLowerCase())
            {
                this.memberList[i].points += pointsEarned;
                console.log('\x1b[32m%s\x1b[0m', `${this.memberList[i].name}'s points updated successfully.`);                    

                this.memberList[i].updateRank();
                break;
            }
        }    
    }

    // display the members by membership type
    showMembersByType(userInputMembershipType, membershipName)
    {
        // the variable below will store the member(s) name with the selected membership type
        var memberWithSelectedType = '';
        // loop through the database to compare whether each and every member has the specified membership type
        for (let i = 0; i < this.memberList.length; i++)
        {
            if (this.memberList[i].membership == userInputMembershipType)
            {
                memberWithSelectedType += this.memberList[i].name + ', ';
            }
        }    
        // if nobody has the specified membership type, prompt the user that nobody has it. Otherwise, prompt the member(s) name
        if (memberWithSelectedType.length == 0)
        {
            console.log(`\t\tNobody has membership type ${membershipName}.\n`);
        }
        else
        {
            console.log(`\t\tMember(s) of membership type ${membershipName}: ${memberWithSelectedType.slice(0, -2)}\n`);
        }
    }

    displayYoungestAndOldest()
    {
        // for both arrays on youngest and oldest, the first element stores the member's date of birth, second element stores member's name that is either youngest or oldest
        // for the second element of the array storing member's name, if the youngest/oldest member has a same date of birth as another member, then the member name will be appending into the string, by a comma
        var youngest = [this.memberList[0].dateBirth, this.memberList[0].name];
        var oldest = [this.memberList[0].dateBirth, this.memberList[0].name];

        for (let i = 1; i < this.memberList.length; i++)
        {
            let dateBirthOfCurrentMember = this.memberList[i].dateBirth;

            // compare the year, if the year is the same, compare the month
            if (dateBirthOfCurrentMember[2] == youngest[0][2])
            {
                // if the month is the same, compare the date
                if (dateBirthOfCurrentMember[1] == youngest[0][1])
                {
                    // if the date is the same, it means the youngest member stored and the current member have the same date of member, appending it to the array
                    if (dateBirthOfCurrentMember[0] == youngest[0][0])
                    {
                        youngest[1] += ", " + this.memberList[i].name;
                    }
                    else if (dateBirthOfCurrentMember[0] > youngest[0][0])
                    {
                        // if the date appears to be later than the youngest, then this current member is the youngest and will be reassign
                        youngest = [this.memberList[i].dateBirth, this.memberList[i].name];
                    }
                }
                else if (dateBirthOfCurrentMember[1] > youngest[0][1])
                {
                    // if the month is later than the youngest, then this current member is the youngest and reassign
                    youngest = [this.memberList[i].dateBirth, this.memberList[i].name];
                }
            }
            else if (dateBirthOfCurrentMember[2] > youngest[0][2])
            {
                // if the year is later than the youngest, it's obviously younger and will be reassign
                youngest = [this.memberList[i].dateBirth, this.memberList[i].name];
            }

            // compare the year, if the year is the same, compare the month
            if (dateBirthOfCurrentMember[2] == oldest[0][2])
            {
                // if the month is the same, compare the date
                if (dateBirthOfCurrentMember[1] == oldest[0][1])
                {
                    // if the date is the same, it means the oldest member stored and the current member have the same date of member, appending it to the array
                    if (dateBirthOfCurrentMember[0] == oldest[0][0])
                    {
                        oldest[1] += ", " + this.memberList[i].name;
                    }
                    else if (dateBirthOfCurrentMember[0] < oldest[0][0])
                    {
                        // if the date appears to be earlier than the oldest, then this current member is the oldest and will be reassign
                        oldest = [this.memberList[i].dateBirth, this.memberList[i].name];
                    }
                }
                else if (dateBirthOfCurrentMember[1] < oldest[0][1])
                {
                    // if the month is earlier than the oldest, then this current member is the oldest and reassign
                    oldest = [this.memberList[i].dateBirth, this.memberList[i].name];
                }
            }
            else if (dateBirthOfCurrentMember[2] < oldest[0][2])
            {
                // if the year is earlier than the oldest, it's obviously older and will be reassign
                oldest = [this.memberList[i].dateBirth, this.memberList[i].name];
            }
        }    

        console.log(`\t\tYoungest member(s): ${youngest[1]}\n\t\tYoungest member(s) date of birth: ${youngest[0][0]} ${getMonthName(youngest[0][1])} ${youngest[0][2]}\n\t\tYoungest member(s) age this year: ${(new Date()).getFullYear() - youngest[0][2]}\n`);
        console.log(`\t\tOldest member(s): ${oldest[1]}\n\t\tOldest member(s) date of birth: ${oldest[0][0]} ${getMonthName(oldest[0][1])} ${oldest[0][2]}\n\t\tOldest member(s) age this year: ${(new Date()).getFullYear() - oldest[0][2]}\n`);
    }

    // display the member who has the highest and lowest points
    displayHighestAndLowest()
    {
        // the arrays will contain in this format: [member's points, member's name]
        // i format it this way because i need the member's points to set as the highest/lowest if that member is detected to have the highest/lowest points so to compare with the remaining members
        // the member's name will then be highest/lowest points member's name
        // for the two arrays below, i assign it with the index 0 member as a starting va;ue to compare with the rest of the members
        var lowest = [this.memberList[0].points, this.memberList[0].name];
        var highest = [this.memberList[0].points, this.memberList[0].name];   

        for (let i = 1; i < this.memberList.length; i++)
        {
            // if the current member in this iteration has equal points, append the current member's name into the member's name within the array
            if (this.memberList[i].points == lowest[0])
            {
                lowest[1] += ", " + this.memberList[i].name;
            }
            // if the current member in this iteration has lower points than the current lowest points member, reassign the lowest points member name and point with the current iteration
            else if (this.memberList[i].points < lowest[0])
            {
                lowest = [this.memberList[i].points, this.memberList[i].name];
            }

            // if the current member in this iteration has equal points, append the current member's name into the member's name within the array
            if (this.memberList[i].points == highest[0])
            {
                highest[1] += ", " + this.memberList[i].name;
            }
            // if the current member in this iteration has higher points than the current highest points member, reassign the highest points member name and point with the current iteration
            else if (this.memberList[i].points > highest[0])
            {
                highest = [this.memberList[i].points, this.memberList[i].name];
            }
        }
        // output the highest and lowest points member(s)
        console.log(`\t\tHighest points member(s): ${highest[1]}\n\t\tPoints: ${highest[0]}\n`);
        console.log(`\t\tLowest points member(s): ${lowest[1]}\n\t\tPoints: ${lowest[0]}\n`);
    }

    infoForEachType(userChoice)
    {
        // if user chose option 4, then numOfMembersOrPoints will be [number of ruby members, number of gold members, number of platinum members, number of diamond members]
        // if user chose option 5, then numOfMembersOrPoints will be [total points in ruby, total points in gold, total points in platinum, total points in diamond]
        var numOfMembersOrPoints = [0, 0, 0, 0];
        const RANKS = ['ruby', 'gold', 'platinum', 'diamond'];

        // since I store the membership rank property in the member objects as integers as follows: 0 (ruby), 1 (gold), 2 (platinum) and 3 (diamond). This allows me to use that property type as index for the array of ranks
        // for example, if the user's rank is ruby, in the member's object, it will be stored as 0. So I can use the member's object rank value as index to increment the count for ruby or the total points for ruby
        for (let i = 0; i < this.memberList.length; i++)
        {
            if (userChoice == '4')
            {
                numOfMembersOrPoints[this.memberList[i].membership]++;
            }
            else
            {
                numOfMembersOrPoints[this.memberList[i].membership] += this.memberList[i].points;
            }
        }

        // loop through the number of people or total number of points in each rank
        for (let i = 0; i < RANKS.length; i++)
        {
            console.log(`\t\t${RANKS[i]}: ${numOfMembersOrPoints[i]}\n`)
        }
    }
}

// functions that are needed by the objects that instantiated by the classes in this file are left at this file instead of index.js
function getMonthName(monthIndex)
{
    const MONTHNAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return MONTHNAMES[monthIndex - 1];
}

function printMemberInfo(member)
{
    console.log(`Name: ${member.name}\nMembership Type: ${member.getMembershipTypeName()}\nDate Joined: ${member.dateJoin[0]} ${getMonthName(member.dateJoin[1])} ${member.dateJoin[2]}\nDate of Birth: ${member.dateBirth[0]} ${getMonthName(member.dateBirth[1])} ${member.dateBirth[2]}\nPoints Earned: ${member.points}\n`);
}