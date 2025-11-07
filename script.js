// Calculator JavaScript
let display = document.getElementById('display');
let currentInput = '0';
let shouldResetDisplay = false;
let isScientific = false;
let errorCount = 0;

function updateDisplay() {
    display.value = currentInput;
    // Adjust font size for long messages
    if (currentInput.length > 30) {
        display.style.fontSize = '0.875rem';
    } else if (currentInput.length > 15) {
        display.style.fontSize = '1.125rem';
    } else {
        display.style.fontSize = '2.25rem';
    }
}

function appendToDisplay(value) {
    if (shouldResetDisplay) {
        currentInput = '0';
        shouldResetDisplay = false;
    }
    
    if (currentInput === '0' && value !== '.') {
        currentInput = value;
    } else {
        currentInput += value;
    }
    updateDisplay();
}

function clearDisplay() {
    currentInput = '0';
    errorCount = 0; // Reset error count when clearing
    updateDisplay();
}

function deleteLast() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

function calculate() {
    try {
        // Handle factorial
        let expression = currentInput.replace(/([0-9]+)!/g, 'factorial($1)');
        // Handle trigonometric functions (convert to radians)
        expression = expression.replace(/sin\(/g, 'Math.sin(');
        expression = expression.replace(/cos\(/g, 'Math.cos(');
        expression = expression.replace(/tan\(/g, 'Math.tan(');
        expression = expression.replace(/log\(/g, 'Math.log10(');
        expression = expression.replace(/ln\(/g, 'Math.log(');
        
        let result = eval(expression);
        if (!isFinite(result)) {
            throw new Error('Invalid calculation');
        }
        currentInput = result.toString();
        shouldResetDisplay = true;
        errorCount = 0; // Reset error count on successful calculation
        updateDisplay();
    } catch (error) {
        errorCount++;
        if (errorCount >= 4) {
            currentInput = 'Really? Math is hard!';
        } else if (errorCount === 3) {
            currentInput = 'Try again, genius!';
        } else {
            currentInput = 'Fuck you! You retarded being.';
        }
        shouldResetDisplay = true;
        updateDisplay();
    }
}

function factorial(n) {
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

function appendFunction(func) {
    if (shouldResetDisplay) {
        currentInput = '0';
        shouldResetDisplay = false;
    }
    
    if (currentInput === '0') {
        currentInput = func;
    } else {
        currentInput += func;
    }
    updateDisplay();
}

function toggleCalculator() {
    const basicCalc = document.getElementById('basicCalc');
    const scientificCalc = document.getElementById('scientificCalc');
    const calculator = document.getElementById('calculator');
    
    if (!isScientific) {
        basicCalc.classList.add('hidden');
        scientificCalc.classList.remove('hidden');
        calculator.classList.remove('calculator-basic');
        calculator.classList.add('scientific-mode');
        isScientific = true;
    } else {
        basicCalc.classList.remove('hidden');
        scientificCalc.classList.add('hidden');
        calculator.classList.remove('scientific-mode');
        calculator.classList.add('calculator-basic');
        isScientific = false;
    }
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    // Prevent default behavior for Tab and some other keys
    if (key === 'Tab' || key === 'Shift') {
        event.preventDefault();
    }
    
    // Numbers and decimal point
    if (key >= '0' && key <= '9') {
        appendToDisplay(key);
    } else if (key === '.' || key === ',') {
        appendToDisplay('.');
    }
    // Operators
    else if (key === '+') {
        appendToDisplay('+');
    } else if (key === '-') {
        appendToDisplay('-');
    } else if (key === '*') {
        appendToDisplay('*');
    } else if (key === '/') {
        appendToDisplay('/');
    }
    // Calculate
    else if (key === 'Enter' || key === '=') {
        calculate();
    }
    // Clear display
    else if (key === 'Shift') {
        clearDisplay();
    }
    // Delete last character
    else if (key === 'Backspace') {
        deleteLast();
    }
    // Switch calculator mode
    else if (key === 'Tab') {
        toggleCalculator();
    }
    // Alternative clear options
    else if (key === 'Escape' || key === 'Delete' || key === 'c' || key === 'C') {
        clearDisplay();
    }
    // Scientific functions (when in scientific mode)
    else if (isScientific) {
        if (key === 's') {
            appendFunction('sin(');
        } else if (key === 'o') {
            appendFunction('cos(');
        } else if (key === 't') {
            appendFunction('tan(');
        } else if (key === 'l') {
            appendFunction('log(');
        } else if (key === 'n') {
            appendFunction('ln(');
        } else if (key === 'p') {
            appendToDisplay('Math.PI');
        } else if (key === 'e') {
            appendToDisplay('Math.E');
        } else if (key === 'r') {
            appendFunction('Math.sqrt(');
        } else if (key === '!') {
            appendToDisplay('!');
        }
    }
});

// Show keyboard shortcuts info on page load
window.addEventListener('load', function() {
    console.log('Calculator Keyboard Shortcuts:');
    console.log('Numbers: 0-9');
    console.log('Operators: + - * /');
    console.log('Decimal: . or ,');
    console.log('Calculate: Enter or =');
    console.log('Clear: Shift, Escape, Delete, or C');
    console.log('Backspace: Remove last digit');
    console.log('Switch Mode: Tab');
    console.log('Scientific (when active): s=sin, o=cos, t=tan, l=log, n=ln, p=π, e=e, r=√, !=factorial');
});