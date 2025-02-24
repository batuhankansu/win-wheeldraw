class WheelController {
    constructor(canvasId, items = []) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.items = items;
        this.weightedItems = [];
        this.rotation = 0;
        this.isSpinning = false;
        this.targetRotations = 0;
        this.isWeighted = false;

        this.canvas.width = 300;
        this.canvas.height = 300;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        this.radius = Math.min(this.centerX, this.centerY) - 10;

        // Extended color palette
        this.colors = [
            // Reds
            '#FF6B6B', '#FF4D4D', '#FF3333', '#FF1A1A', '#FF0000',
            '#E60000', '#CC0000', '#B30000', '#990000', '#800000',
            
            // Oranges
            '#FFA07A', '#FF8C00', '#FF7F50', '#FF6347', '#FF4500',
            '#E65C00', '#CC5200', '#B34700', '#993D00', '#803300',
            
            // Yellows
            '#FFD700', '#FFCC00', '#FFC300', '#FFB900', '#FFAE00',
            '#E6A800', '#CC9600', '#B38300', '#997000', '#805D00',
            
            // Greens
            '#98FB98', '#90EE90', '#7CCD7C', '#66B266', '#4D994D',
            '#32CD32', '#228B22', '#006400', '#004D00', '#003300',
            
            // Blues
            '#87CEEB', '#00BFFF', '#1E90FF', '#4169E1', '#0000FF',
            '#0000E6', '#0000CC', '#0000B3', '#000099', '#000080',
            
            // Purples
            '#9370DB', '#8A2BE2', '#9400D3', '#8B008B', '#800080',
            '#4B0082', '#3C0066', '#2D004D', '#1F0033', '#110019',
            
            // Pinks
            '#FFB6C1', '#FF69B4', '#FF1493', '#DB7093', '#C71585',
            '#B31B1B', '#990F99', '#800F80', '#660066', '#4D004D',
            
            // Teals & Turquoise
            '#40E0D0', '#48D1CC', '#20B2AA', '#008B8B', '#008080',
            '#006666', '#004D4D', '#003333', '#002626', '#001919',
            
            // Additional Mixed Colors
            '#FFE4B5', '#DEB887', '#D2B48C', '#BC8F8F', '#F4A460',
            '#DAA520', '#CD853F', '#D2691E', '#8B4513', '#A0522D'
        ];
    }

    // Add a method to get a different color from the last used one
    getNextColor(usedColors = []) {
        const availableColors = this.colors.filter(color => !usedColors.includes(color));
        if (availableColors.length === 0) return this.colors[0];
        return availableColors[Math.floor(Math.random() * availableColors.length)];
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.save();
        this.ctx.translate(this.centerX, this.centerY);
        this.ctx.rotate(this.rotation);

        const items = this.isWeighted ? this.weightedItems : this.items;
        const usedColors = [];

        if (this.isWeighted) {
            const totalWeight = this.weightedItems.reduce((sum, item) => sum + item.weight, 0);
            let currentAngle = -Math.PI / 2;

            items.forEach((item, index) => {
                const sliceAngle = (2 * Math.PI * item.weight) / totalWeight;
                const endAngle = currentAngle + sliceAngle;

                // Get color - red for special items, random for others
                let segmentColor;
                if (item.isSpecial) {
                    segmentColor = '#FF0000'; // Bright red for special items
                } else {
                    segmentColor = this.getNextColor(usedColors);
                    usedColors.push(segmentColor);
                }

                // Draw slice
                this.ctx.beginPath();
                this.ctx.moveTo(0, 0);
                this.ctx.arc(0, 0, this.radius, currentAngle, endAngle);
                this.ctx.closePath();
                
                this.ctx.fillStyle = segmentColor;
                this.ctx.fill();
                this.ctx.strokeStyle = '#fff';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();

                // Draw text
                this.ctx.save();
                this.ctx.rotate(currentAngle + sliceAngle / 2);
                this.ctx.textAlign = 'right';
                this.ctx.fillStyle = '#fff';
                
                if (item.isSpecial) {
                    // Add growing/shrinking text animation
                    const time = Date.now() * 0.001; // Convert to seconds
                    const scale = 1 + Math.sin(time * 3) * 0.15; // Scale between 0.85 and 1.15
                    
                    this.ctx.font = `bold ${Math.floor(18 * scale)}px Arial`;
                    this.ctx.fillText(item.name, this.radius - 20, 5);
                } else {
                    // Normal text
                    this.ctx.font = 'bold 16px Arial';
                    this.ctx.fillText(item.name, this.radius - 20, 5);
                }
                
                this.ctx.restore();

                currentAngle = endAngle;
            });
        } else {
            // Original non-weighted drawing code with new color logic
            const sliceAngle = (2 * Math.PI) / this.items.length;
            this.items.forEach((item, index) => {
                const startAngle = index * sliceAngle - Math.PI / 2;
                const endAngle = startAngle + sliceAngle;

                // Get color - red for special items, random for others
                let segmentColor;
                if (item.isSpecial) {
                    segmentColor = '#FF0000'; // Bright red for special items
                } else {
                    segmentColor = this.getNextColor(usedColors);
                    usedColors.push(segmentColor);
                }

                this.ctx.beginPath();
                this.ctx.moveTo(0, 0);
                this.ctx.arc(0, 0, this.radius, startAngle, endAngle);
                this.ctx.closePath();
                
                this.ctx.fillStyle = segmentColor;
                this.ctx.fill();
                this.ctx.strokeStyle = '#fff';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();

                this.ctx.save();
                this.ctx.rotate(startAngle + sliceAngle / 2);
                this.ctx.textAlign = 'right';
                this.ctx.fillStyle = '#fff';
                this.ctx.font = 'bold 16px Arial';
                this.ctx.fillText(item.toString(), this.radius - 20, 5);
                this.ctx.restore();
            });
        }

        this.ctx.restore();
    }

    getItemsCount() {
        return this.isWeighted ? this.weightedItems.length : this.items.length;
    }

    getItem(index) {
        return this.isWeighted ? this.weightedItems[index].name : this.items[index];
    }

    getWeightedRandomIndex() {
        const totalWeight = this.weightedItems.reduce((sum, item) => sum + item.weight, 0);
        let random = Math.random() * totalWeight;
        
        for (let i = 0; i < this.weightedItems.length; i++) {
            random -= this.weightedItems[i].weight;
            if (random <= 0) {
                return i;
            }
        }
        return this.weightedItems.length - 1;
    }

    async spin() {
        if (this.isSpinning || this.getItemsCount() < 2) return null;
        
        this.isSpinning = true;
        // Add spinning class to wheel container
        this.canvas.closest('.wheel').classList.add('spinning');
        
        // Set exact duration to 15000 milliseconds (15 seconds)
        const duration = 12000;
        const startTime = Date.now();
        const startRotation = this.rotation;

        // For weighted wheel, calculate the target rotation to land on weighted random selection
        let targetRotation;
        if (this.isWeighted) {
            const winningIndex = this.getWeightedRandomIndex();
            const totalWeight = this.weightedItems.reduce((sum, item) => sum + item.weight, 0);
            let angleSum = 0;
            
            // Calculate the angle to the middle of the winning segment
            for (let i = 0; i < winningIndex; i++) {
                angleSum += (this.weightedItems[i].weight / totalWeight) * (2 * Math.PI);
            }
            // Add half of the winning segment's angle
            angleSum += (this.weightedItems[winningIndex].weight / totalWeight) * Math.PI;
            
            // Calculate final target rotation
            targetRotation = 2 * Math.PI * this.targetRotations + (2 * Math.PI - angleSum);
        } else {
            const randomIndex = Math.floor(Math.random() * this.items.length);
            const sliceAngle = (2 * Math.PI) / this.items.length;
            targetRotation = 2 * Math.PI * this.targetRotations + (2 * Math.PI - (randomIndex * sliceAngle + sliceAngle / 2));
        }

        return new Promise((resolve) => {
            const animate = () => {
                const currentTime = Date.now();
                const elapsed = currentTime - startTime;

                if (elapsed < duration) {
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Keep the same easing function for smooth animation
                    const easing = 1 - Math.pow(1 - progress, 4);
                    this.rotation = startRotation + targetRotation * easing;
                    this.draw();

                    requestAnimationFrame(animate);
                } else {
                    this.isSpinning = false;
                    // Remove spinning class when done
                    this.canvas.closest('.wheel').classList.remove('spinning');
                    
                    const finalRotation = this.rotation % (2 * Math.PI);
                    
                    if (this.isWeighted) {
                        const totalWeight = this.weightedItems.reduce((sum, item) => sum + item.weight, 0);
                        let currentAngle = 0;
                        let winningIndex = 0;
                        
                        // Find which segment contains the top position (0 radians)
                        const normalizedRotation = (2 * Math.PI - finalRotation) % (2 * Math.PI);
                        for (let i = 0; i < this.weightedItems.length; i++) {
                            const sliceAngle = (2 * Math.PI * this.weightedItems[i].weight) / totalWeight;
                            if (normalizedRotation >= currentAngle && 
                                normalizedRotation < currentAngle + sliceAngle) {
                                winningIndex = i;
                                break;
                            }
                            currentAngle += sliceAngle;
                        }
                        resolve(this.weightedItems[winningIndex].name);
                    } else {
                        const sliceAngle = (2 * Math.PI) / this.items.length;
                        const normalizedRotation = (2 * Math.PI - finalRotation) % (2 * Math.PI);
                        const winningIndex = Math.floor(normalizedRotation / sliceAngle);
                        resolve(this.getItem(winningIndex));
                    }
                }
            };
            animate();
        });
    }
}

// Initialize wheels
const tableWheel = new WheelController('tableCanvas');
const prizeWheel = new WheelController('prizeCanvas');
prizeWheel.isWeighted = true;

// Add these at the top of the file, after the WheelController class
const sounds = {
    wheelStop: new Audio('./sounds/wheel-stop.mp3'),
    win: new Audio('./sounds/win.mp3'),
    spinning: new Audio('./sounds/spinning.mp3'),
    bigWin: new Audio('./sounds/bigwin.mp3')
};

// Configure spinning sound to loop
sounds.spinning.loop = true;
sounds.spinning.volume = 0.3; // Lower volume for background sound

// Function to play sound with error handling
async function playSound(sound) {
    try {
        await sound.play();
    } catch (error) {
        console.log('Sound playback failed:', error);
    }
}

// Update the addTableNumber function
function addTableNumber() {
    const input = document.getElementById('tableInput');
    const numbers = input.value.split(',').map(n => n.trim()).filter(n => n);
    let addedAny = false;

    numbers.forEach(number => {
        if (!isNaN(number) && !tableWheel.items.includes(number)) {
            tableWheel.items.push(number);
            addedAny = true;
        }
    });

    if (addedAny) {
        updateList('tableList', tableWheel.items);
        updateList('tableList-side', tableWheel.items);
        tableWheel.draw();
        
        // Hide input section if there are 2 or more items
        if (tableWheel.items.length >= 2) {
            document.querySelector('#tableWheel').closest('.wheel-section').querySelector('.input-section').classList.add('hidden');
        }
    }

    input.value = '';
}

// Update the addPrize function
function addPrize() {
    const input = document.getElementById('prizeInput');
    const prizes = input.value.split(',').map(p => p.trim()).filter(p => p);
    let addedAny = false;

    // First, collect all prizes with their counts
    let prizeCollection = [];
    prizes.forEach(prize => {
        const match = prize.match(/^(.*?)\((\d+)\)$/);
        if (match) {
            let [, name, count] = match;
            const isSpecial = name.endsWith('!');
            name = name.replace('!', ''); // Remove the ! for display
            const countNum = parseInt(count);
            
            for (let i = 0; i < countNum; i++) {
                prizeCollection.push({
                    name: name,
                    weight: 1,
                    isSpecial: isSpecial // Add special flag
                });
            }
            addedAny = true;
        }
    });

    if (addedAny) {
        // Create array to hold final arrangement
        const finalArrangement = new Array(prizeCollection.length);
        let currentIndex = 0;

        // Sort prizes by count (most frequent first)
        const prizeCounts = {};
        prizeCollection.forEach(prize => {
            prizeCounts[prize.name] = (prizeCounts[prize.name] || 0) + 1;
        });

        // Sort prizes by frequency
        prizeCollection.sort((a, b) => prizeCounts[b.name] - prizeCounts[a.name]);

        // Place prizes with maximum spacing
        while (prizeCollection.length > 0) {
            const prize = prizeCollection.shift();
            
            // Find the best position for this prize
            let bestPosition = 0;
            let maxDistance = -1;

            for (let i = 0; i < finalArrangement.length; i++) {
                if (finalArrangement[i]) continue; // Skip filled positions

                // Check distance to nearest same prize
                let minDistance = finalArrangement.length;
                for (let j = 0; j < finalArrangement.length; j++) {
                    if (finalArrangement[j] && finalArrangement[j].name === prize.name) {
                        const distance = Math.min(
                            Math.abs(i - j),
                            finalArrangement.length - Math.abs(i - j)
                        );
                        minDistance = Math.min(minDistance, distance);
                    }
                }

                if (minDistance > maxDistance) {
                    maxDistance = minDistance;
                    bestPosition = i;
                }
            }

            finalArrangement[bestPosition] = prize;
        }

        // Update the wheel with the final arrangement
        prizeWheel.weightedItems = finalArrangement;

        const prizeList = prizeWheel.weightedItems.map(item => item.name);
        updateList('prizeList', prizeList);
        updateList('prizeList-side', prizeList);
        prizeWheel.draw();

        // Hide input section if there are 2 or more items
        if (prizeWheel.weightedItems.length >= 2) {
            document.querySelector('#prizeWheel').closest('.wheel-section').querySelector('.input-section').classList.add('hidden');
        }
    }

    input.value = '';
}

// Update display lists
function updateList(elementId, items) {
    const element = document.getElementById(elementId);
    const sideElement = document.getElementById(elementId + '-side');
    const itemsHtml = Array.isArray(items) 
        ? items.map(item => `<span>${item}</span>`).join('')
        : '';
    
    if (element) {
        element.innerHTML = itemsHtml;
    }
    if (sideElement) {
        sideElement.innerHTML = itemsHtml;
    }
}

// Add these functions at the top of the file
function createConfettiCannon() {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        }));
        confetti(Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        }));
    }, 250);
}

// Update the createSpecialCelebration function
function createSpecialCelebration() {
    // Enhanced confetti with more particles and longer duration
    const duration = 8000;
    const animationEnd = Date.now() + duration;
    const defaults = { 
        startVelocity: 45, 
        spread: 360, 
        ticks: 100, 
        zIndex: 0,
        shapes: ['star', 'circle'],
        colors: ['#FFD700', '#FFA500', '#FF0000', '#FF1493', '#FFFFFF']
    };

    // Side shooters
    const sideShooters = setInterval(() => {
        // Left side shooters
        confetti(Object.assign({}, defaults, {
            particleCount: 20,
            angle: 60,
            spread: 50,
            origin: { x: 0, y: 0.7 }
        }));
        confetti(Object.assign({}, defaults, {
            particleCount: 20,
            angle: 120,
            spread: 50,
            origin: { x: 1, y: 0.7 }
        }));
    }, 500);

    // Main celebration
    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            clearInterval(interval);
            clearInterval(sideShooters);
            
            // Final burst
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { x: 0.5, y: 0.3 },
                colors: ['#FFD700', '#FFA500'],
                shapes: ['star']
            });
            return;
        }

        const particleCount = 100 * (timeLeft / duration);
        
        // Center bursts
        confetti(Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.3, 0.7), y: randomInRange(0.2, 0.4) }
        }));

        // Side bursts
        confetti(Object.assign({}, defaults, {
            particleCount: particleCount * 0.5,
            angle: 60,
            spread: 80,
            origin: { x: 0, y: randomInRange(0.4, 0.6) }
        }));
        confetti(Object.assign({}, defaults, {
            particleCount: particleCount * 0.5,
            angle: 120,
            spread: 80,
            origin: { x: 1, y: randomInRange(0.4, 0.6) }
        }));
    }, 250);

    // Add some random bursts
    const randomBursts = setInterval(() => {
        const side = Math.random() > 0.5;
        confetti({
            particleCount: 30,
            angle: side ? 60 : 120,
            spread: 55,
            origin: { x: side ? 0 : 1, y: 0.5 },
            colors: ['#FFD700', '#FFA500', '#FF0000'],
            shapes: ['star']
        });
    }, 1000);

    // Clear random bursts after duration
    setTimeout(() => clearInterval(randomBursts), duration);
}

// Update the spinWheels function
async function spinWheels() {
    if (tableWheel.items.length < 2 || prizeWheel.weightedItems.length < 2) {
        alert('Lütfen her çarka en az 2 öğe ekleyin!');
        return;
    }

    const spinButton = document.getElementById('spinButton');
    spinButton.disabled = true;

    // Start spinning sound
    try {
        sounds.spinning.currentTime = 0;
        await sounds.spinning.play();
    } catch (error) {
        console.log('Spinning sound playback failed:', error);
    }

    // Set different rotations for each wheel
    const baseRotations = 4;
    tableWheel.targetRotations = baseRotations + Math.random() * 4;
    prizeWheel.targetRotations = baseRotations + Math.random() * 4;

    // Spin table wheel first
    const tableResult = await tableWheel.spin();

    // Stop spinning sound and play stop sound
    sounds.spinning.pause();
    await playSound(sounds.wheelStop);

    // Short delay before starting prize wheel
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Start spinning sound again for second wheel
    try {
        sounds.spinning.currentTime = 0;
        await sounds.spinning.play();
    } catch (error) {
        console.log('Spinning sound playback failed:', error);
    }

    // Then spin prize wheel
    const prizeResult = await prizeWheel.spin();

    // Stop spinning sound
    sounds.spinning.pause();

    // Check if the winning prize is special
    const winningPrize = prizeWheel.weightedItems.find(item => item.name === prizeResult);
    const isSpecialPrize = winningPrize && winningPrize.isSpecial;

    // Play appropriate sound based on prize type
    if (isSpecialPrize) {
        await playSound(sounds.bigWin);
        createSpecialCelebration();
    } else {
        await playSound(sounds.win);
        createConfettiCannon();
    }

    const resultDisplay = document.getElementById('result');
    resultDisplay.style.display = 'block';
    resultDisplay.innerHTML = `
        <h2>${isSpecialPrize ? '🌟 BÜYÜK ÖDÜL! 🌟' : '🎉 Tebrikler! 🎉'}</h2>
        <p class="winner-text" ${isSpecialPrize ? 'style="font-size: 1.5em; color: #FF0000; text-shadow: 0 0 10px #FFD700;"' : ''}>
            Masa ${tableResult} kazandı: ${prizeResult}!
        </p>
    `;

    // Add special animation class if it's a special prize
    if (isSpecialPrize) {
        resultDisplay.classList.add('special-win');
        // Add pulsing background effect
        document.body.classList.add('special-win-background');
        // Remove the background effect after 5 seconds
        setTimeout(() => {
            document.body.classList.remove('special-win-background');
        }, 5000);
    }

    // Add 3 second delay before scrolling
    setTimeout(() => {
        resultDisplay.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 2000);

    spinButton.disabled = false;
}

// Initial draw
tableWheel.draw();
prizeWheel.draw();

// Add requestAnimationFrame loop to handle text animation
function animate() {
    if (prizeWheel.weightedItems.some(item => item.isSpecial)) {
        prizeWheel.draw();
    }
    requestAnimationFrame(animate);
}
animate();

// Modal functionality
const modal = document.getElementById('helpModal');
const helpBtn = document.getElementById('helpButton');
const closeBtn = document.getElementsByClassName('close')[0];

helpBtn.onclick = function() {
    modal.style.display = 'block';
}

closeBtn.onclick = function() {
    modal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Add keyboard support for closing modal
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && modal.style.display === 'block') {
        modal.style.display = 'none';
    }
}); 