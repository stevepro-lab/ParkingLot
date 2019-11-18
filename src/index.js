/**
 * @description requiring native Node modules
 */
const fs = require('fs'),
	readLine = require("readline");

var	commandLineInputs = process.argv; // processing command line inputs

/**
 * @description importing the parkingLot class
 */
var Parking = require('./modules/parkingLot.js'),
	parkingLot = new Parking();

// to avoid memory leaks errors, deafult max listeners = 10
require('events').EventEmitter.defaultMaxListeners = 0

// TODO: What if parking lot is not created
// TODO: Car with same numbers

if (commandLineInputs[commandLineInputs.length - 1] == 'true'){
    openInteractiveConsole();
} 
else {
    fs.readFile(commandLineInputs[2], 'utf-8', function (err, data) {
        var arr = data.split("\n");
		for (var i=0; i < arr.length; i++){
			processUserCommands(arr[i]);
		}
    });
}

/**
 * @description called when users want to interact via console
 * it process one command at a time
 */
function openInteractiveConsole(){
    if(commandLineInputs[commandLineInputs.length - 1] == 'true'){
        var prompts = readLine.createInterface({ input: process.stdin, output: process.stdout, terminal: false });
        // option for user to enter commands
        prompts.question("Input: ", function (data) {
            processUserCommands(data);
        });
    }
}

/**
 * 
 * @param {String} input entered via console
 * @description driver function for different commands for entered by users
 * calls respective functions of ParkingLot class based on commands
 */
function processUserCommands(input){
	var userCommand = input.split(" ")[0],
		parkingSlotNumber;
    switch (userCommand) {
        case "create_parking_lot":
            totalParkingSlots = parkingLot.createParkingLot(input);
            console.log("Created a parking lot with " + totalParkingSlots  + " slots.");
            break;
        case "park":
            parkingSlotNumber = parkingLot.parkCar(input);
            if(parkingSlotNumber){
                console.log("Allocated slot number: " + parkingSlotNumber);
			}
			else {
                console.log("Sorry, parking lot is full");
            }
            break;
        case "leave":
            parkingSlotNumber = parkingLot.leaveCar(input);
            if (parkingSlotNumber) {
                console.log("Slot number " + parkingSlotNumber + " is free.");
			}
			else {
                console.log("Sorry, parking lot is full");
            }
            break;
        case "status":
            var parkingSlotStatus = parkingLot.getParkingStatus();
            if (parkingSlotStatus.length > 1) {
                console.log(parkingSlotStatus.join("\n"));
            }
            else {
                console.log("Sorry, parking lot is empty"); // what if it's empty
            }
            break;
        case "registration_numbers_for_cars_with_colour":
            var registrationNumbers = parkingLot.getCarsWithSameColor(input);
            if (registrationNumbers) {
                console.log(registrationNumbers);
			}
			else {
                console.log("Sorry, Car with given color is not found");
            }
            break;
        case "slot_numbers_for_cars_with_colour":
            parkingSlotNumbers = parkingLot.getSlotsWithSameColorCar(input);
            if (parkingSlotNumbers) {
                console.log(parkingSlotNumbers);
            }
            else {
                console.log("Sorry, Car with given color is not found");
            }
            break;
        case "slot_number_for_registration_number":
            parkingSlotNumber = parkingLot.getSlotByCarNumber(input);
            if (parkingSlotNumber) {
                console.log(parkingSlotNumber);
			} 
			else {
                console.log("Sorry, Car with given registration number is not found");
            }
            break;
        case 'exit': 
			process.exit(0);
			break;
        default: 
            console.log(input, 'is not a recognized command');
            break;
    }
    openInteractiveConsole();
}
