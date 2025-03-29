// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ArithmeticOperations {
    int256 public num1 = 0; // Default value
    int256 public num2 = 0; // Default value

    // Addition function
    function addNumbers() public view returns (int256) {
        return num1 + num2;
    }

    // Subtraction function
    function subtractNumbers() public view returns (int256) {
        return num1 - num2;
    }

    // Multiplication function
    function multiplyNumbers() public view returns (int256) {
        return num1 * num2;
    }

    // Division function with safety checks
    function divideNumbers() public view returns (int256) {
        require(num2 != 0, "Cannot divide by zero");
        return num1 / num2;
    }

    // Helper function to update numbers
    function updateNumbers(int256 _num1, int256 _num2) public {
        num1 = _num1;
        num2 = _num2;
    }
}
