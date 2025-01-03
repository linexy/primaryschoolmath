let problems = [];

function generateProblems() {
    const resultDiv = document.getElementById('result');
    if (resultDiv) {
        resultDiv.innerHTML = '';
    }
    
    const difficulty = parseInt(document.getElementById('difficulty').value);
    const useThreeNumbers = document.getElementById('threeNumbers').checked;
    const useLeftBlank = document.getElementById('leftBlank').checked;
    const range = difficulty;
    problems = [];
    
    for (let i = 0; i < 20; i++) {
        // 即使勾选了左边填空，也随机决定是否使用左边填空
        const isLeftBlank = useLeftBlank ? Math.random() < 0.5 : false;
        
        if (useThreeNumbers && Math.random() < 0.5) {
            // 三数运算题
            let num1, num2, num3, operator1, operator2, answer, intermediateResult, finalResult;
            
            do {
                num1 = Math.floor(Math.random() * range) + 1;
                num2 = Math.floor(Math.random() * range) + 1;
                num3 = Math.floor(Math.random() * range) + 1;
                operator1 = Math.random() < 0.5 ? '+' : '-';
                operator2 = Math.random() < 0.5 ? '+' : '-';
                
                if (operator1 === '+') {
                    intermediateResult = num1 + num2;
                    finalResult = operator2 === '+' ? intermediateResult + num3 : intermediateResult - num3;
                } else {
                    intermediateResult = num1 - num2;
                    finalResult = operator2 === '+' ? intermediateResult + num3 : intermediateResult - num3;
                }
                
            } while (
                intermediateResult > range || 
                intermediateResult <= 0 || 
                finalResult > range || 
                finalResult <= 0
            );
            
            // 如果允许左边填空，则在1-3之间随机选择位置，否则只能是最后的结果
            const blankPosition = isLeftBlank ? Math.floor(Math.random() * 3) + 1 : 0;
            
            if (isLeftBlank) {
                if (blankPosition === 1) answer = num1;
                else if (blankPosition === 2) answer = num2;
                else if (blankPosition === 3) answer = num3;
            } else {
                answer = finalResult;
            }
            
            problems.push({
                num1: num1,
                num2: num2,
                num3: num3,
                operator1: operator1,
                operator2: operator2,
                answer: answer,
                isThreeNumbers: true,
                blankPosition: blankPosition,
                finalResult: finalResult
            });
        } else {
            // 两数运算题
            let num1, num2, operator, answer, finalResult;
            
            do {
                num1 = Math.floor(Math.random() * range) + 1;
                num2 = Math.floor(Math.random() * range) + 1;
                operator = Math.random() < 0.5 ? '+' : '-';
                
                if (operator === '+') {
                    finalResult = num1 + num2;
                } else {
                    if (num1 < num2) {
                        [num1, num2] = [num2, num1];
                    }
                    finalResult = num1 - num2;
                }
            } while (finalResult > range || finalResult <= 0);
            
            // 如果允许左边填空，则随机选择位置1或2，否则只能是结果
            const blankPosition = isLeftBlank ? Math.floor(Math.random() * 2) + 1 : 0;
            
            if (isLeftBlank) {
                answer = blankPosition === 1 ? num1 : num2;
            } else {
                answer = finalResult;
            }
            
            problems.push({
                num1: num1,
                num2: num2,
                operator: operator,
                answer: answer,
                isThreeNumbers: false,
                blankPosition: blankPosition,
                finalResult: finalResult
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
        
        let calculationHtml;
        if (problem.isThreeNumbers) {
            // 三数运算题显示
            const result = problem.operator1 === '+' ? 
                (problem.operator2 === '+' ? problem.num1 + problem.num2 + problem.num3 : problem.num1 + problem.num2 - problem.num3) :
                (problem.operator2 === '+' ? problem.num1 - problem.num2 + problem.num3 : problem.num1 - problem.num2 - problem.num3);
            
            if (problem.blankPosition === 1) {
                calculationHtml = `<input type="number" class="answer-input" data-index="${index}" readonly onclick="createNumberPad(this)"> ${problem.operator1} ${problem.num2} ${problem.operator2} ${problem.num3} = ${result}`;
            } else if (problem.blankPosition === 2) {
                calculationHtml = `${problem.num1} ${problem.operator1} <input type="number" class="answer-input" data-index="${index}" readonly onclick="createNumberPad(this)"> ${problem.operator2} ${problem.num3} = ${result}`;
            } else if (problem.blankPosition === 3) {
                calculationHtml = `${problem.num1} ${problem.operator1} ${problem.num2} ${problem.operator2} <input type="number" class="answer-input" data-index="${index}" readonly onclick="createNumberPad(this)"> = ${result}`;
            } else {
                calculationHtml = `${problem.num1} ${problem.operator1} ${problem.num2} ${problem.operator2} ${problem.num3} = <input type="number" class="answer-input" data-index="${index}" readonly onclick="createNumberPad(this)">`;
            }
        } else {
            // 两数运算题显示
            const result = problem.operator === '+' ? 
                problem.num1 + problem.num2 : 
                problem.num1 - problem.num2;
            
            if (problem.blankPosition === 1) {
                calculationHtml = `<input type="number" class="answer-input" data-index="${index}" readonly onclick="createNumberPad(this)"> ${problem.operator} ${problem.num2} = ${result}`;
            } else if (problem.blankPosition === 2) {
                calculationHtml = `${problem.num1} ${problem.operator} <input type="number" class="answer-input" data-index="${index}" readonly onclick="createNumberPad(this)"> = ${result}`;
            } else {
                calculationHtml = `${problem.num1} ${problem.operator} ${problem.num2} = <input type="number" class="answer-input" data-index="${index}" readonly onclick="createNumberPad(this)">`;
            }
        }
        
        div.innerHTML = `
            <div class="problem-wrapper">
                <div class="problem-number">${index + 1}</div>
                <div class="calculation">
                    <span class="calculation-expression">${calculationHtml}</span>
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
    
    displayResults(score, wrongProblems);{
        saveScore(score);
    }
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

// 修改 displayResults 函数，添加得分保存
function displayResults(score, wrongProblems) {
    const resultDiv = document.getElementById('result');
    
    // 清除之前的错题标记
    document.querySelectorAll('.problem-wrong').forEach(problem => {
        problem.classList.remove('problem-wrong');
    });
    
    // 标记错题
    wrongProblems.forEach(wrong => {
        const problemElement = document.querySelectorAll('.problem')[wrong.index - 1];
        if (problemElement) {
            problemElement.classList.add('problem-wrong');
        }
    });
    
    // 显示分数和错题解析按钮
    resultDiv.innerHTML = `
        <h3>本次得分：${score}分</h3>
        ${wrongProblems.length > 0 ? `
            <button class="primary-btn" onclick="showWrongAnalysis(${JSON.stringify(wrongProblems).replace(/"/g, '&quot;')})">
                <span class="icon">📝</span>错题解析
            </button>
        ` : ''}
    `;
    
    // 3秒后移除闪烁效果
    setTimeout(() => {
        document.querySelectorAll('.problem-wrong').forEach(problem => {
            problem.classList.remove('problem-wrong');
        });
    }, 3000);
}

// 修改显示错题解析的函数
function showWrongAnalysis(wrongProblems) {
    const resultDiv = document.getElementById('result');
    const currentScore = resultDiv.querySelector('h3').textContent.match(/\d+/)[0]; // 从当前显示中获取分数
    
    resultDiv.innerHTML = `
        <h3>本次得分：${currentScore}分</h3>
        <div class="wrong-problems-list">
            ${wrongProblems.map(wrong => {
                let equation;
                if (wrong.problem.isThreeNumbers) {
                    // 三数运算的显示逻辑
                    if (wrong.problem.blankPosition === 1) {
                        equation = `□ ${wrong.problem.operator1} ${wrong.problem.num2} ${wrong.problem.operator2} ${wrong.problem.num3} = ${wrong.problem.finalResult}`;
                    } else if (wrong.problem.blankPosition === 2) {
                        equation = `${wrong.problem.num1} ${wrong.problem.operator1} □ ${wrong.problem.operator2} ${wrong.problem.num3} = ${wrong.problem.finalResult}`;
                    } else if (wrong.problem.blankPosition === 3) {
                        equation = `${wrong.problem.num1} ${wrong.problem.operator1} ${wrong.problem.num2} ${wrong.problem.operator2} □ = ${wrong.problem.finalResult}`;
                    } else {
                        equation = `${wrong.problem.num1} ${wrong.problem.operator1} ${wrong.problem.num2} ${wrong.problem.operator2} ${wrong.problem.num3} = □`;
                    }
                } else {
                    // 两数运算的显示逻辑
                    if (wrong.problem.blankPosition === 1) {
                        equation = `□ ${wrong.problem.operator} ${wrong.problem.num2} = ${wrong.problem.finalResult}`;
                    } else if (wrong.problem.blankPosition === 2) {
                        equation = `${wrong.problem.num1} ${wrong.problem.operator} □ = ${wrong.problem.finalResult}`;
                    } else {
                        equation = `${wrong.problem.num1} ${wrong.problem.operator} ${wrong.problem.num2} = □`;
                    }
                }
                
                return `
                    <div class="wrong-problem">
                        <div class="wrong-content">
                            <p>第${wrong.index}题：${equation}</p>
                            <p class="wrong-answer">你的答案：${wrong.userAnswer}</p>
                            <p class="correct-answer">正确答案：${wrong.problem.answer}</p>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
        <button class="primary-btn" onclick="hideWrongAnalysis()">
            <span class="icon">✖</span>关闭解析
        </button>
    `;
}

function hideWrongAnalysis() {
    const resultDiv = document.getElementById('result');
    const currentScore = resultDiv.querySelector('h3').textContent.match(/\d+/)[0];
    resultDiv.innerHTML = `<h3>本次得分：${currentScore}分</h3>`;
}

// 保存最后一次的错题信息
let lastWrongProblems = [];

// 修改提交答案函数
function submitAnswers() {
    if (!checkAllAnswered()) {
        return;
    }

    let score = 0;
    const wrongProblems = [];

    problems.forEach((problem, index) => {
        const userAnswer = parseInt(document.querySelector(`input[data-index="${index}"]`).value);
        if (userAnswer === problem.answer) {
            score += 5;
        } else {
            wrongProblems.push({
                index: index + 1,
                problem: problem,
                userAnswer: userAnswer
            });
        }
    });

    lastWrongProblems = wrongProblems; // 保存错题信息
    displayResults(score, wrongProblems);
    saveScore(score);
}

function checkAllAnswered() {
    const inputs = document.querySelectorAll('.answer-input');
    let allAnswered = true;
    
    // 移除之前的未完成标记
    document.querySelectorAll('.incomplete').forEach(problem => {
        problem.classList.remove('incomplete');
    });

    // 检查每个输入框
    inputs.forEach((input, index) => {
        if (!input.value.trim()) {
            allAnswered = false;
            // 找到对应的题目容器并添加未完成效果
            input.closest('.problem').classList.add('incomplete');
        }
    });

    if (!allAnswered) {
        // 3秒后移除闪烁效果
        setTimeout(() => {
            document.querySelectorAll('.incomplete').forEach(problem => {
                problem.classList.remove('incomplete');
            });
        }, 3000);
    }

    return allAnswered;
}

// 修改CSS样式，确保输入框可以正常点击
function addStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .calculation-expression.incomplete {
            animation: incompleteShake 0.8s ease-in-out infinite;
            background-color: rgba(255, 0, 0, 0.1);
            border-radius: 4px;
            padding: 2px 4px;
        }
        
        .answer-input {
            position: relative;
            z-index: 10;  /* 确保输入框在上层 */
        }
        
        @keyframes incompleteShake {
            0% { background-color: rgba(255, 0, 0, 0.1); }
            50% { background-color: rgba(255, 0, 0, 0.2); }
            100% { background-color: rgba(255, 0, 0, 0.1); }
        }
    `;
    document.head.appendChild(styleElement);
}

// 页面加载时添加样式
document.addEventListener('DOMContentLoaded', addStyles);

// 添加新的CSS样式
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes wrongShake {
        0% { background-color: rgba(255, 0, 0, 0.1); }
        50% { background-color: rgba(255, 0, 0, 0.2); }
        100% { background-color: rgba(255, 0, 0, 0.1); }
    }

    .problem-wrong {
        animation: wrongShake 0.8s ease-in-out infinite;
    }

    .problem-wrong .answer-input {
        pointer-events: auto !important;
        position: relative;
        z-index: 100;
    }

    .problem-wrapper {
        position: relative;
    }

    .calculation {
        position: relative;
        z-index: 1;
    }
`;
document.head.appendChild(styleSheet);

// 更新输入框的函数
function updateInput(input, value) {
    // 如果输入框为空，直接设置值
    if (!input.value) {
        input.value = value;
    } else {
        // 如果已有值，追加新值
        const newValue = parseInt(input.value + value);
        input.value = newValue;
    }
    // 触发change事件
    input.dispatchEvent(new Event('change'));
}

function createNumberPad(input) {
    // 移除可能存在的旧键盘
    const oldPad = document.querySelector('.number-pad-container');
    if (oldPad) {
        oldPad.remove();
    }

    const pad = document.createElement('div');
    pad.className = 'number-pad';
    
    // 数字按钮
    for (let i = 1; i <= 9; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.className = 'number-button';
        button.onclick = (e) => {
            e.stopPropagation();
            updateInput(input, i);
        };
        pad.appendChild(button);
    }
    
    // 添加0、删除和确认按钮
    const button0 = document.createElement('button');
    button0.textContent = '0';
    button0.className = 'number-button';
    button0.onclick = (e) => {
        e.stopPropagation();
        updateInput(input, 0);
    };
    
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '←';
    deleteButton.className = 'delete-button';
    deleteButton.onclick = (e) => {
        e.stopPropagation();
        input.value = '';
        input.dispatchEvent(new Event('change'));
    };
    
    const confirmButton = document.createElement('button');
    confirmButton.textContent = '✓';
    confirmButton.className = 'confirm-button';
    confirmButton.onclick = (e) => {
        e.stopPropagation();
        padContainer.remove();
    };
    
    pad.appendChild(button0);
    pad.appendChild(deleteButton);
    pad.appendChild(confirmButton);
    
    // 创建一个容器来固定键盘位置
    const padContainer = document.createElement('div');
    padContainer.className = 'number-pad-container';
    padContainer.appendChild(pad);
    
    // 将键盘添加到body
    document.body.appendChild(padContainer);
    
    // 计算键盘位置
    const inputRect = input.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // 设置键盘位置
    padContainer.style.position = 'absolute';
    padContainer.style.top = `${inputRect.bottom + scrollTop}px`;
    padContainer.style.left = `${inputRect.left}px`;
    
    // 点击其他地方关闭键盘
    document.addEventListener('click', function closeNumberPad(e) {
        if (!pad.contains(e.target) && e.target !== input) {
            padContainer.remove();
            document.removeEventListener('click', closeNumberPad);
        }
    });

    // 阻止键盘上的点击事件冒泡
    pad.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}


// 添加日历相关函数
function initCalendar() {
    const calendar = document.getElementById('calendar');
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    // 清空日历
    calendar.innerHTML = '';
    
    // 添加星期标题
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    weekdays.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day weekday';
        dayElement.textContent = day;
        calendar.appendChild(dayElement);
    });
    
    // 填充月初空白
    for (let i = 0; i < firstDay.getDay(); i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendar.appendChild(emptyDay);
    }
    
    // 填充日期
    for (let date = 1; date <= lastDay.getDate(); date++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        const dateDiv = document.createElement('div');
        dateDiv.className = 'date';
        dateDiv.textContent = date;
        
        const scoreDiv = document.createElement('div');
        scoreDiv.className = 'score';
        
        const dateStr = `${today.getFullYear()}-${(today.getMonth()+1).toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;
        const score = getScoreForDate(dateStr);
        if (score !== null) {
            scoreDiv.textContent = score + '分';
            dayElement.classList.add(getScoreClass(score));
            
            // 添加满分标识
            if (score === 100) {
                scoreDiv.textContent = '满分 🎉';
            }
        }
        
        dayElement.appendChild(dateDiv);
        dayElement.appendChild(scoreDiv);
        calendar.appendChild(dayElement);
    }
}
// 获取指定日期的得分
function getScoreForDate(dateStr) {
    const scores = JSON.parse(localStorage.getItem('mathScores') || '{}');
    return scores[dateStr] || null;
}
// 保存得分记录
function saveScore(score) {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    const scores = JSON.parse(localStorage.getItem('mathScores') || '{}');
    
    // 只保存当天第一次的得分
    if (!scores[dateStr]) {
        scores[dateStr] = score;
        localStorage.setItem('mathScores', JSON.stringify(scores));
        
        // 更新日历显示
        initCalendar();
    }
}
// 根据得分返回对应的样式类
function getScoreClass(score) {
    if (score === 100) return 'score-100';
    if (score >= 95) return 'score-95';
    if (score >= 90) return 'score-90';
    return 'score-0';
}

// 在页面加载时初始化日历
document.addEventListener('DOMContentLoaded', initCalendar);
// 添加切换日历显示的函数
function toggleCalendar() {
    const calendarPanel = document.querySelector('.calendar-panel');
    if (calendarPanel.style.display === 'block') {
        calendarPanel.style.display = 'none';
    } else {
        calendarPanel.style.display = 'block';
        initCalendar(); // 显示时更新日历数据
    }
}