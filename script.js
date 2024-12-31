let problems = [];

function generateProblems() {
    // 清除评分结果
    const resultDiv = document.getElementById('result');
    if (resultDiv) {
        resultDiv.innerHTML = '';
    }
    
    const difficulty = parseInt(document.getElementById('difficulty').value);
    const useThreeNumbers = document.getElementById('threeNumbers').checked;
    const range = difficulty;
    problems = [];
    
    // 生成20道题
    for (let i = 0; i < 20; i++) {
        if (useThreeNumbers && Math.random() < 0.5) {
            // 生成三数运算题
            let num1, num2, num3, operator1, operator2, answer, intermediateResult;
            
            do {
                num1 = Math.floor(Math.random() * range) + 1;
                num2 = Math.floor(Math.random() * range) + 1;
                num3 = Math.floor(Math.random() * range) + 1;
                
                operator1 = Math.random() < 0.5 ? '+' : '-';
                operator2 = Math.random() < 0.5 ? '+' : '-';
                
                // 计算中间结果和最终结果
                if (operator1 === '+') {
                    intermediateResult = num1 + num2;
                    answer = operator2 === '+' ? intermediateResult + num3 : intermediateResult - num3;
                } else {
                    intermediateResult = num1 - num2;
                    answer = operator2 === '+' ? intermediateResult + num3 : intermediateResult - num3;
                }
                
                // 确保中间结果和最终结果都在有效范围内
            } while (
                intermediateResult > range || 
                intermediateResult <= 0 || 
                answer > range || 
                answer <= 0
            );
            
            problems.push({
                num1: num1,
                num2: num2,
                num3: num3,
                operator1: operator1,
                operator2: operator2,
                answer: answer,
                isThreeNumbers: true
            });
        } else {
            // 原有的两数运算逻辑
            let num1, num2, operator, answer;
            const isAddition = Math.random() < 0.5;
            
            if (isAddition) {
                // 加法：确保结果不超过范围
                do {
                    num1 = Math.floor(Math.random() * range) + 1;
                    num2 = Math.floor(Math.random() * range) + 1;
                    answer = num1 + num2;
                } while (answer > range);
                
                operator = '+';
            } else {
                // 减法：确保结果为正且所有数都在范围内
                do {
                    num1 = Math.floor(Math.random() * range) + 1;
                    num2 = Math.floor(Math.random() * range) + 1;
                    if (num1 < num2) {
                        [num1, num2] = [num2, num1]; // 交换，确保大数在前
                    }
                    answer = num1 - num2;
                } while (answer > range || answer === 0);
                
                operator = '-';
            }
            
            problems.push({
                num1: num1,
                num2: num2,
                operator: operator,
                answer: answer,
                isThreeNumbers: false
            });
        }
    }
    
    displayProblems();
}

function displayProblems() {
    const container = document.getElementById('problems');
    container.innerHTML = '';
    container.className = 'problems-container';
    
    problems.forEach((problem, index) => {
        const div = document.createElement('div');
        div.className = 'problem';
        
        const calculation = problem.isThreeNumbers ? 
            `${problem.num1} ${problem.operator1} ${problem.num2} ${problem.operator2} ${problem.num3}` :
            `${problem.num1} ${problem.operator} ${problem.num2}`;
            
        div.innerHTML = `
            <div class="problem-wrapper">
                <div class="problem-number">${index + 1}</div>
                <div class="calculation">
                    <span class="calculation-expression">${calculation}</span>
                    <span class="calculation-equals">=</span>
                    <input type="number" 
                           class="answer-input" 
                           data-index="${index}"
                           readonly
                           onclick="createNumberPad(this)"
                           onchange="checkAnswer(${index}, this.value)">
                </div>
            </div>
        `;
        container.appendChild(div);
    });
}

// 添加答案检查功能
function checkAnswer(index, value) {
    const problem = problems[index];
    const inputElement = document.querySelector(`input[data-index="${index}"]`);
    
    // 获取包含问题的父级div元素
    const problemDiv = inputElement.closest('.problem');
    
    if (parseInt(value) === problem.answer) {
        // 添加正确答案的动画效果
        problemDiv.classList.add('correct');
        // 移除动画类，以便下次可以重新触发
        setTimeout(() => {
            problemDiv.classList.remove('correct');
        }, 500);
    }
}

function checkAnswers() {
    let score = 0;
    let wrongProblems = [];
    
    problems.forEach((problem, index) => {
        const inputElement = document.querySelector(`input[data-index="${index}"]`);
        if (!inputElement) return;
        
        const userAnswer = parseInt(inputElement.value) || 0;
        if (userAnswer === problem.answer) {
            score += 5; // 每题5分，总分100分
        } else {
            wrongProblems.push({
                index: index + 1,
                problem: problem,
                userAnswer: userAnswer
            });
        }
    });
    
    displayResults(score, wrongProblems);
}

// 添加烟花效果代码
function createFireworks() {
    const canvas = document.getElementById('fireworks');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    let particles = [];
    let animationStartTime = Date.now();
    
    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.radius = Math.random() * 3 + 2;
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 8 + 4;
            this.dx = Math.cos(angle) * velocity;
            this.dy = Math.sin(angle) * velocity;
            this.alpha = 1;
            // 使用更鲜艳的颜色
            const colors = [
                '#FF69B4', // 粉红
                '#FFD700', // 金色
                '#FF6B6B', // 红色
                '#4ECDC4', // 青色
                '#A7FF83', // 绿色
                '#9B59B6'  // 紫色
            ];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        
        update() {
            this.x += this.dx;
            this.y += this.dy;
            this.dy += 0.15; // 轻微重力效果
            this.alpha -= 0.02;
            return this.alpha > 0;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color + Math.floor(this.alpha * 255).toString(16).padStart(2, '0');
            ctx.fill();
        }
    }
    
    function createExplosion(x, y) {
        for (let i = 0; i < 80; i++) {
            particles.push(new Particle(x, y));
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles = particles.filter(particle => {
            particle.update();
            particle.draw();
            return particle.alpha > 0;
        });
        
        // 检查动画是否应该继续
        if (particles.length > 0 && Date.now() - animationStartTime < 2000) {
            requestAnimationFrame(animate);
        } else {
            // 清除画布并移除
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.style.display = 'none';
        }
    }
    
    // 在不同位置发射多个烟花
    function launchFireworks() {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const x = Math.random() * (canvas.width * 0.8) + (canvas.width * 0.1);
                const y = Math.random() * (canvas.height * 0.4) + (canvas.height * 0.2);
                createExplosion(x, y);
            }, i * 500);
        }
    }
    
    canvas.style.display = 'block';
    launchFireworks();
    animate();
}

// 修改 displayResults 函数
function displayResults(score, wrongProblems) {
    let resultDiv = document.getElementById('result');
    if (!resultDiv) {
        resultDiv = document.createElement('div');
        resultDiv.id = 'result';
        document.querySelector('.main-content').appendChild(resultDiv);
    }
    
    let html = `
        <div class="result-panel">
            <h2>本次得分：${score}分</h2>
            ${score === 100 ? '<div class="perfect-score">太棒了！满分！🎉</div>' : ''}
    `;
    
    if (wrongProblems.length > 0) {
        html += `
            <div class="wrong-problems">
                <h3>需要改进的题目：</h3>
                <ul>
                    ${wrongProblems.map(wrong => {
                        const problem = wrong.problem;
                        const calculation = problem.isThreeNumbers ? 
                            `${problem.num1} ${problem.operator1} ${problem.num2} ${problem.operator2} ${problem.num3} = ${problem.answer}` :
                            `${problem.num1} ${problem.operator} ${problem.num2} = ${problem.answer}`;
                        
                        return `
                            <li>
                                第${wrong.index}题：
                                ${calculation}
                                <br>
                                <span class="user-answer">你的答案：${wrong.userAnswer}</span>
                            </li>
                        `;
                    }).join('')}
                </ul>
            </div>
        `;
    }
    
    html += '</div>';
    resultDiv.innerHTML = html;
    
    // 当得分为100分时，触发烟花效果
    if (score === 100) {
        // 确保 canvas 存在
        let canvas = document.getElementById('fireworks');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'fireworks';
            document.body.appendChild(canvas);
        }
        createFireworks();
    }
}

function createNumberPad(input) {
    // 移除已存在的数字面板
    const existingPad = document.querySelector('.number-pad');
    if (existingPad) {
        existingPad.remove();
    }

    // 创建数字面板
    const numberPad = document.createElement('div');
    numberPad.className = 'number-pad';
    
    // 临时存储输入值
    let tempValue = '';
    
    // 更新输入框显示
    const updateInput = () => {
        input.value = tempValue;
    };
    
    // 创建数字按钮 1-9
    for (let i = 1; i <= 9; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.onclick = () => {
            tempValue += i;
            updateInput();
        };
        numberPad.appendChild(button);
    }
    
    // 添加数字 0
    const zeroButton = document.createElement('button');
    zeroButton.textContent = '0';
    zeroButton.onclick = () => {
        if (tempValue !== '') {  // 避免首位输入0
            tempValue += '0';
            updateInput();
        }
    };
    numberPad.appendChild(zeroButton);
    
    // 添加确认按钮
    const confirmButton = document.createElement('button');
    confirmButton.textContent = '✓';
    confirmButton.className = 'confirm-btn';
    confirmButton.onclick = () => {
        if (tempValue !== '') {
            numberPad.remove();
            // 触发 input 的 change 事件
            const event = new Event('change');
            input.dispatchEvent(event);
        }
    };
    numberPad.appendChild(confirmButton);

    // 计算位置
    const rect = input.getBoundingClientRect();
    numberPad.style.top = `${rect.bottom + window.scrollY + 5}px`;
    numberPad.style.left = `${rect.left + window.scrollX - 50}px`; // 居中对齐

    // 添加到页面
    document.body.appendChild(numberPad);

    // 点击其他地方关闭数字面板
    document.addEventListener('click', function closeNumberPad(e) {
        if (!numberPad.contains(e.target) && e.target !== input) {
            numberPad.remove();
            document.removeEventListener('click', closeNumberPad);
        }
    });
}