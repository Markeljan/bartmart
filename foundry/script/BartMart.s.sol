// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Script} from "forge-std/Script.sol";
import {BartMart} from "../src/BartMart.sol";

contract BartMartScript is Script {
    BartMart public bartMart;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        bartMart = new BartMart();

        vm.stopBroadcast();
    }
}
