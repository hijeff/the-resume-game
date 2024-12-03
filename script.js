const gameState = {
    currentLocation: 'desk',
    inventory: [],
};

const locations = {
    desk: {
        description: `
You are at your desk in a dimly lit office. A half-empty coffee mug sits precariously on the edge, 
papers are stacked haphazardly, and your laptop hums quietly. 
To your left, a drawer is locked. A ringing PHONE interrupts your thoughts. 
At the same time, a SLACK message pings, and you notice an EMAIL notification on your screen.
        `,
        options: [
            '- LOOK around.',
            '- TAKE the mug.',
            '- Use the PHONE.',
            '- Check SLACK.',
            '- Read the EMAIL.',
            '- EXPLORE the office.',
        ],
        actions: {
            look: 'examineDesk',
            phone: 'answerPhone',
            slack: 'checkSlack',
            email: 'readEmail',
            explore: 'moveOffice',
        },
    },
    cantTakeMug: {
        description: `
You can't take ye mug. It's firmly bolted to the desk. Never you mind.
        `,
        options: [
            '- LOOK around.',
            '- Go BACK to your desk.',
        ],
        actions: { look: 'examineDesk', back: 'desk' },
    },
    examineDesk: {
        description: `
Your desk has a laptop, some papers, and a locked drawer. 
There's a mug here, but something feels... unusual.
        `,
        options: [
            '- TAKE the mug.',
            '- INSPECT the drawer.',
            '- Check UNDER the desk.',
            '- Go BACK to your desk.',
        ],
        actions: { back: 'desk' },
    },
};

function typeText(text, options, callback) {
    const output = document.getElementById('output');
    const p = document.createElement('p');
    p.style.textAlign = 'left';
    output.appendChild(p);

    let index = 0;

    function addChar() {
        if (index < text.length) {
            p.textContent += text[index];
            index++;
            setTimeout(addChar, 25);
        } else if (callback) {
            callback();
        }
        output.scrollTop = output.scrollHeight;
    }

    addChar();

    if (options && options.length > 0) {
        setTimeout(() => {
            options.forEach((opt) => {
                const optionElement = document.createElement('p');
                optionElement.textContent = opt;
                optionElement.style.margin = '0';
                optionElement.style.textAlign = 'left';
                output.appendChild(optionElement);
                output.scrollTop = output.scrollHeight;
            });
        }, text.length * 25 + 100);
    }
}

function displayText(text, options) {
    typeText(text.trim(), options);
}

function processCommand() {
    const input = document.getElementById('command-input');
    const command = input.value.toLowerCase().trim();
    input.value = '';

    if (!command) return;

    typeText(`> ${command.toUpperCase()}`);

    const location = locations[gameState.currentLocation];

    // Handle mug-related commands
    if (
        ['take the mug', 'take mug', 'get mug', 'pick up mug'].includes(command) &&
        gameState.currentLocation === 'desk'
    ) {
        gameState.currentLocation = 'cantTakeMug';
    } else if (location.actions[command]) {
        gameState.currentLocation = location.actions[command];
    } else {
        typeText("Invalid command. Try again.");
        return;
    }

    const { description, options } = locations[gameState.currentLocation];
    displayText(description, options);
}

document.getElementById('command-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') processCommand();
});
const { description, options } = locations.desk;
displayText(description, options);
