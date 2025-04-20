// 🔒 قفل رفتاری برای شرط پنجم
function lockFifthBet(currentLossStreak, votes, trend, lastDirection) {
    const hiVotes = votes.filter(v => v === 'hi').length;
    const loVotes = votes.filter(v => v === 'lo').length;

    // شرط اول: حداقل 3 رأی در یک جهت
    if (hiVotes < 3 && loVotes < 3) {
        console.warn("🚫 شرط پنجم بلوکه شد: رأی کافی وجود ندارد.");
        return null;
    }

    // شرط دوم: جلوگیری از تکرار جهت در صورت باخت‌های متوالی
    const proposedDirection = hiVotes > loVotes ? 'hi' : 'lo';
    if (proposedDirection === lastDirection && currentLossStreak >= 4) {
        console.warn("🚫 شرط پنجم بلوکه شد: جهت تکراری در باخت متوالی.");
        return null;
    }

    // شرط سوم: بررسی انطباق با روند بازار
    if (trend === 'bearish' && proposedDirection === 'hi') {
        console.warn("🚫 شرط پنجم بلوکه شد: مغایرت با روند نزولی.");
        return null;
    }
    if (trend === 'bullish' && proposedDirection === 'lo') {
        console.warn("🚫 شرط پنجم بلوکه شد: مغایرت با روند صعودی.");
        return null;
    }

    // شرط چهارم: در صورت شک (اختلاف کم در رأی)، اجرای تاخیر یا ریفرش
    const voteDiff = Math.abs(hiVotes - loVotes);
    if (voteDiff <= 1 && currentLossStreak >= 4) {
        console.warn("⏳ شرط پنجم در وضعیت مشکوک - اجرای ریفرش یا تاخیر");
        setTimeout(() => location.reload(), 1000); // ریفرش هوشمند
        return null;
    }

    console.log("✅ شرط پنجم آزاد شد:", proposedDirection);
    return proposedDirection;
}

function isAlgorithmBanned(algo) {
    const ban = bannedAlgorithms[algo];
    if (!ban) return false;

    const timePassed = (Date.now() - ban.bannedAt) / 1000;
    ban.cooldownRounds--;

    if (ban.cooldownRounds <= 0) {
        delete bannedAlgorithms[algo];
        console.log(`✅ الگوریتم ${algo} دوباره فعال شد.`);
        return false;
    }

    return true;
}



function handleAdaptiveSmartMind() {
    if (!Array.isArray(rollHistory) || rollHistory.length < 5) return;

    const lastResults = rollHistory.slice(-5).map(r => r.result).join('');
    const riskyPatterns = ['LLL', 'LLLL', 'LHLH', 'HLLH'];
    const riskDetected = riskyPatterns.some(pattern => lastResults.includes(pattern));

    const algo = currentAlgorithm;
    const stat = stats[algo] || { success: 0, attempts: 0 };
    const successRate = stat.attempts > 0 ? stat.success / stat.attempts : 0;

    // تصمیم‌گیری نهایی
    if (riskDetected && currentBet > baseBet * 1.5 && successRate < 0.4) {
        console.warn("🚨 تحلیل هوش: ریسک بالا + الگوریتم ضعیف + شرط بالا → توقف");
        alert("🧠 شرط متوقف شد به دلیل تحلیل ریسک هوش");
        return false;
    }

    if (riskDetected && successRate < 0.5) {
        console.warn("⚠️ الگوریتم ضعیف تشخیص داده شد، سوییچ به memory");
        currentAlgorithm = 'memory';
        currentBet = baseBet;
    }
}


var rollHistory = []; // تعریف اولیه ایمن برای جلوگیری از ReferenceError

function handleRiskyPrediction() {
    if (!Array.isArray(rollHistory) || rollHistory.length < 3) return false;
    const last = rollHistory.slice(-3).map(r => r.result).join('');
    const riskyPatterns = ['LLL', 'HHL', 'LHL'];

    if (riskyPatterns.includes(last)) {
        console.warn("🤖 حدسیات فعال: الگوی خطرناک تشخیص داده شد!");

        // واکنش: انتخاب الگوریتم امن‌تر و کاهش شرط به baseBet
        currentBet = baseBet;
        currentAlgorithm = 'memory'; // الگوریتم محافظه‌کار
        console.log("⚠️ تغییر الگوریتم به memory و کاهش شرط به baseBet");
    }
}



function checkSelfRegulationConditions(result, betAmount, payout) {
    if (result === 'lose') {
        lossStreakCount++;
                    updateStreakStats('lose', currentDirection);
        currentBet = currentBet * 1.8;
        console.warn(`⚠️ باخت ${lossStreakCount} - افزایش شرط به ${currentBet.toFixed(8)}`);

        if (lossStreakCount >= 5) {
            console.error("🛑 5 باخت متوالی! توقف شرط‌گذاری.");
            alert("❌ شرط متوقف شد به دلیل 5 باخت متوالی");
            return false;
        }
    } else if (result === 'win') {
        lossStreakCount = 0;
        currentBet = baseBet;
        console.log("✅ برد! بازگشت شرط به baseBet");
    }
    return true;
}


// 🧠 Self-Regulation + Dynamic Risk Management
var lossStreakCount = 0;
var winStreakCount = 0;
var baseBet = 0.00000001;
var maxAllowedLoss = -0.0002;
var currentBet = baseBet; // تعریف global شرط فعلی
var totalProfit = 0;



var currentAlgorithm = 'supersmart';


// 🔥 Dynamic Algorithm Intelligence System - نسخه قدرتمند V25.0

var algoStats = {};
var algoHistory = [];
var algoCycleIndex = 0;

// 🧠 ثبت موفقیت‌ها و شکست‌ها
function updateAlgoStats(name, result, reward = 1) {
    if (!algoStats[name]) algoStats[name] = { success: 0, fail: 0, reward: 0, attempts: 0 };
    if (result === 'win') algoStats[name].success++;
    else algoStats[name].fail++;
    algoStats[name].attempts++;
    algoStats[name].reward += result === 'win' ? reward : -0.5;
    if (algoStats[name].reward < 0) algoStats[name].reward = 0;
}

// 🧠 امتیازدهی هوشمند الگوریتم‌ها
function getTopAlgorithms(limit = 3) {
    return Object.entries(algoStats)
        .map(([name, stat]) => ({
            name,
            score: stat.attempts > 0 ? (stat.success / stat.attempts) + stat.reward * 0.05 : 0
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(e => e.name);
}

// 🔄 انتخاب الگوریتم بعدی به‌صورت چرخشی از بین بهترین‌ها
function getNextAdaptiveAlgorithm() {
    var top = getTopAlgorithms();
    if (top.length === 0) return 'random';
    if (algoCycleIndex >= top.length) algoCycleIndex = 0;
    var selected = top[algoCycleIndex];
    algoCycleIndex++;
    return selected;
}

// 📈 تحلیل و پیش‌بینی روندهای اخیر
function analyzeForecast() {
    if (!Array.isArray(history)) {
        console.warn("⚠️ history آرایه نیست یا تعریف نشده");
        return 'neutral';
    }

    var last = history.slice(-5);
    var wins = last.filter(x => x === 'win').length;
    var losses = last.filter(x => x === 'lose').length;

    if (wins >= 4) return 'bullish';
    if (losses >= 4) return 'bearish';
    return 'neutral';
}

// 📌 تصمیم نهایی با استفاده از هوش ترکیبی




// ⏳ Cooldown System - کنار گذاشتن موقت الگوریتم‌های بازنده
var stats = {};
var cooldownThreshold = 5; // چند بار باخت پشت‌سر‌هم برای قرار دادن در Cooldown
var cooldownRounds = 10; // مدت زمان استراحت الگوریتم

function updateStats(algoName, result) {
    if (!stats[algoName]) stats[algoName] = { success: 0, fail: 0, cooldown: 0 };
    if (result === 'win') {
        stats[algoName].success++;
    } else {
        stats[algoName].fail++;
        if (stats[algoName].fail >= cooldownThreshold) {
            stats[algoName].cooldown = cooldownRounds;
            console.warn(`🛑 الگوریتم ${algoName} به دلیل شکست‌های پیاپی به حالت استراحت رفت (${cooldownRounds} دور)`);
        }
    }
}

function decayCooldowns() {
    for (var algo in stats) {
        if (stats[algo].cooldown > 0) stats[algo].cooldown--;
    }
}



// 🧠 سیستم ترکیبی: باخت‌های متوالی + سود/زیان + تحلیل شب/روز

function adaptiveDecisionEngine(result, betAmount, payout) {
    var hour = new Date().getUTCHours();

    // بروزرسانی سود/زیان و شمارنده باخت
    if (result === 'win') {
        totalProfit += (payout - betAmount);
        lossStreakCount = 0;
    } else {
        totalProfit -= betAmount;
        lossStreakCount++;
                    updateStreakStats('lose', currentDirection);
    }

    // واکنش به باخت‌های پشت سر هم
    if (lossStreakCount === 3) {
        console.warn("⚠️ 3 باخت متوالی - تغییر الگوریتم به metaadaptive");
        currentAlgorithm = 'metaadaptive';
    }

    // واکنش به زیان کلی
    if (totalProfit < -0.0001) {
        console.warn("📉 ضرر بالا - فعال‌سازی حالت امن memory");
        currentAlgorithm = 'memory';
        currentBet = baseBet * 0.5;
    }

    // تحلیل زمان: انتخاب الگوریتم بر اساس شب/روز
    if (hour >= 1 && hour <= 6) {
        currentAlgorithm = 'deep';
        console.info("🌙 زمان شب - استفاده از الگوریتم deep");
    } else if (hour >= 12 && hour <= 16) {
        currentAlgorithm = 'bayesian';
        console.info("🌞 زمان ظهر - استفاده از الگوریتم bayesian");
    }
}






(async function () {
'use strict';
// ==UserScript==
// @name         BetStorm Ultimate AI v22.7 - Enhanced Analysis (RL + Candle + DeepSeek + GAN + UltraAI) (Ordered) - مارتینگل
// @namespace    http://tampermonkey.net/
// @version      23.2
// @description  Advanced AI auto betting with deep learning, reinforcement learning & GAN prediction - Ordered Strategy - PLUS Ultra-Advanced AI + مارتینگل
// @author       moviesbymr.x (modified by Gemini)
// @match        https://freebitco.in/*
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(() => {

        return [numericalHistory];
    }




        return [numericalHistory];
    }




        var sequenceLength = 20;
        var numericalHistory = history.map(function(result) { return result === 'win' ? 1 : 0; });
        if (numericalHistory.length < sequenceLength) {
            var padding = new Array(sequenceLength - numericalHistory.length).fill(0);
            numericalHistory = padding.concat(numericalHistory);
        } else if (numericalHistory.length > sequenceLength) {
            numericalHistory = numericalHistory.slice(numericalHistory.length - sequenceLength);
        }
        return [numericalHistory];

        var threshold = 0.5;
        return prediction > threshold ? 'hi' : 'lo';
    }


    (() => {
            var sequenceLength = 20;
            var numericalHistory = history.map(result => result === 'win' ? 1 : 0);
            if (numericalHistory.length < sequenceLength) {
                var padding = new Array(sequenceLength - numericalHistory.length).fill(0);
                numericalHistory = padding.concat(numericalHistory);
            } else if (numericalHistory.length > sequenceLength) {
                numericalHistory = numericalHistory.slice(numericalHistory.length - sequenceLength);
            }
            return [numericalHistory];
        }

            const threshold = 0.5;
            return prediction > threshold ? 'hi' : 'lo';
        }


        (async function startMrXBot() {
            var prepareInputData = function(history) {
                var sequenceLength = 20;
            var prepareInputData = function(history) {
                var sequenceLength = 20;
                var numericalHistory = history.map(function(result) { return result === 'win' ? 1 : 0; });
                if (numericalHistory.length < sequenceLength) {
                    var padding = new Array(sequenceLength - numericalHistory.length).fill(0);
                    numericalHistory = padding.concat(numericalHistory);
                } else if (numericalHistory.length > sequenceLength) {
                    numericalHistory = numericalHistory.slice(numericalHistory.length - sequenceLength);
                }
                return [numericalHistory];
            };
            };

            var processPrediction = function(prediction) {
                var threshold = 0.5;
                return prediction > threshold ? 'hi' : 'lo';
            };


                'use strict';
            // -------------------- شروع: تابع تبدیل تاریخچه به حالت --------------------
            function getBettingState(history) {
                if (!Array.isArray(history)) history = [];
                var recentHistory = history.slice(-5).map(result => result === 'win' ? 1 : 0).join('');
                return recentHistory || 'empty';
            }
                // -------------------- پایان: تابع تبدیل تاریخچه به حالت --------------------
            // -------------------- شروع: توابع Q-Learning --------------------
                function qLearningDecide(history) {
                    var state = getBettingState(history);
                    if (!qTable[state]) {
                        qTable[state] = { hi: 0, lo: 0 };
                    }

                    // سیاست ε-greedy برای انتخاب اقدام
                    if (Math.random() < epsilon) {
                        return Math.random() < 0.5 ? 'hi' : 'lo'; // اکتشاف
                    } else {
                        return qTable[state].hi > qTable[state].lo ? 'hi' : 'lo'; // بهره‌برداری
                    }
                }

                function updateQTable(oldState, action, reward, newState) {
                    if (!qTable[oldState]) {
                        qTable[oldState] = { hi: 0, lo: 0 };
                    }
                    if (!qTable[newState]) {
                        qTable[newState] = { hi: 0, lo: 0 };
                    }

                    var maxQNewState = Math.max(qTable[newState].hi, qTable[newState].lo);
                    qTable[oldState][action] = qTable[oldState][action] + learningRate * (reward + discountFactor * maxQNewState - qTable[oldState][action]);
                    GM_setValue('qTable', qTable);
                }
                // -------------------- پایان: توابع Q-Learning --------------------

                // -------------------- شروع: توابع SARSA --------------------
                function sarsaDecide(history) {
                    var state = getBettingState(history);
                    if (!sarsaTable[state]) {
                        sarsaTable[state] = { hi: 0, lo: 0 };
                    }
                    currentSarsaState = state;

                    // سیاست ε-greedy برای انتخاب اقدام
                    if (Math.random() < epsilon) {
                        currentSarsaAction = Math.random() < 0.5 ? 'hi' : 'lo'; // اکتشاف
                    } else {
                        currentSarsaAction = sarsaTable[state].hi > sarsaTable[state].lo ? 'hi' : 'lo'; // بهره‌برداری
                    }
                    return currentSarsaAction;
                }

                function updateSarsaTable(oldState, action, reward, newState, newAction) {
                    if (!sarsaTable[oldState]) {
                        sarsaTable[oldState] = { hi: 0, lo: 0 };
                    }
                    if (!sarsaTable[newState]) {
                        sarsaTable[newState] = { hi: 0, lo: 0 };
                    }

                    sarsaTable[oldState][action] = sarsaTable[oldState][action] + learningRate * (reward + discountFactor * sarsaTable[newState][newAction] - sarsaTable[oldState][action]);
                    GM_setValue('sarsaTable', sarsaTable);
                }
                // -------------------- پایان: توابع SARSA --------------------
                var sleep = ms => new Promise(res => setTimeout(res, ms));
                var random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

                function simulateMouseMove(element) {
                    if (!element) return;
                    var rect = element.getBoundingClientRect();
                    var x = rect.left + Math.random() * rect.width;
                    var y = rect.top + Math.random() * rect.height;
                    element.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: x, clientY: y }));
                }

                function isCaptchaActive() {
                    var captcha = document.querySelector('#captcha');
                    return captcha && captcha.style.display !== 'none';
                }

                var history = await GM_getValue('betHistory', []);
                var stats = await GM_getValue('aiMultiStats', {
                    random: { success: 0, attempts: 1, reward: 0 },
                    lossPattern: { success: 0, attempts: 1, reward: 0 },
                    streakTrend: { success: 0, attempts: 1, reward: 0 },
                    trendMemory: { success: 0, attempts: 1, reward: 0 },
                    weighted: { success: 0, attempts: 1, reward: 0 },
                    gan: { success: 0, attempts: 1, reward: 0 },
                    candle: { success: 0, attempts: 1, reward: 0 },
                    deepSeek: { success: 0, attempts: 1, reward: 0 },
                    ultra: { success: 0, attempts: 1, reward: 0 }, // Stats for the Ultra AI
                });

                var currentDirection = await GM_getValue('currentDirection', 'lo');
                var currentAlgorithm = await GM_getValue('currentAlgorithm', 'random');
                var winCount = 0, lossCount = 0, lossStreakCount = 0;
                var totalLoss = 0, initialBalance = 0.01, maxLossPercentage = 0.4;
                var ganMemory = await GM_getValue('ganMemory', []);
                var MAX_MEMORY_SIZE = 500;
                var roundCounter = await GM_getValue('roundCounter', 0);
                var MAX_LOSS_STREAK = 5;
                var bannedAlgorithms = new Set();
                var algorithmOrder = [
                    'supersmart',
                    'metaadaptive',
                    'eventbased',
                    'ensemble','human', 'historical', 'deep', 'winning', 'deceptive', 'random', 'candle', 'streak', 'sarsa' , ' qlearning']; // Add 'ultra'
                var losingAlgorithmsGroup = ['historical', 'deceptive'];
                var winningAlgorithmsGroup = ['winning', 'deep'];
                var previousAlgorithm = 'random';
                var ultraModel = null; // Change to null, load in init

            // -------------------- شروع: ساختارهای داده و پارامترهای یادگیری تقویتی --------------------
                var qTable = await GM_getValue('qTable', {});
                var learningRate = 0.1;
                var discountFactor = 0.9;
                var epsilon = 0.1; // احتمال انتخاب تصادفی برای اکتشاف

                var sarsaTable = await GM_getValue('sarsaTable', {});
                var currentSarsaState = getBettingState(history);
                var currentSarsaAction = Math.random() < 0.5 ? 'hi' : 'lo'; // انتخاب اولیه تصادفی
                // -------------------- پایان: ساختارهای داده و پارامترهای یادگیری تقویتی --------------------
                function adjustBetAmount() {
                var multiplier = 2;

                switch (currentAlgorithm) {
                    case 'memory':
                        multiplier = 1.5;
                        break;
                    case 'deep':
                        multiplier = 2.0;
                        break;
                    case 'ultra':
                        multiplier = 2.5;
                        break;
                    default:
                        multiplier = 2.0;
                }

                if (lossCount > 0) {
                    currentBet = baseBet * Math.pow(multiplier, lossCount);
                } else {
                    currentBet = baseBet;
                }

                var maxLossAllowed = initialBalance * maxLossPercentage;
                if (totalLoss + currentBet > maxLossAllowed) {
                    currentBet = maxLossAllowed - totalLoss;
                }

                document.getElementById('double_your_btc_stake').value = currentBet.toFixed(8);
            }

                var decideWithRandom = () => Math.random() > 0.5 ? 'hi' : 'lo';

                function decideWithLossPattern() {
                    var last50 = history.slice(-50);
                    var lossesLo = last50.filter((res, i) => res === 'lose' && i % 2 === 0).length;
                    var lossesHi = last50.filter((res, i) => res === 'lose' && i % 2 !== 0).length;
                    return lossesLo > lossesHi ? 'hi' : 'lo';
                }

                function decideWithStreakTrend() {
                    var recent = history.slice(-5);
                    var wins = recent.filter(r => r === 'win').length;
                    var losses = recent.filter(r => r === 'lose').length;
                    return losses > wins ? (currentDirection === 'hi' ? 'lo' : 'hi') : currentDirection;
                }

                function decideWithTrendMemory() {
                    var last10 = history.slice(-10);
                    var hiCount = 0, loCount = 0;
                    for (var i = 0; i < last10.length; i++) {
                        if (i % 2 === 0) loCount += last10[i] === 'win' ? 1 : 0;
                        else hiCount += last10[i] === 'win' ? 1 : 0;
                    }
                    return hiCount > loCount ? 'hi' : 'lo';
                }

                function decideWithWeightedLearning() {
                    var weightSum = 0;
                    var weightedDirection = 'lo';
                    for (var i = 0; i < history.length; i++) {
                        weightSum += (i + 1) * (history[i] === 'win' ? 1 : -1);
                    }
                    weightedDirection = weightSum > 0 ? 'hi' : 'lo';
                    return weightedDirection;
                }

                // 🔥 GAN-based Pattern Predictor
                function ganPatternPredictor() {
                    var generator = (noise) => {
                        var pattern = [];
                        for (var i = 0; i < 10; i++) {
                            pattern.push(noise[i] > 0.5 ? 'win' : 'lose');
                        }
                        return pattern;
                    };

                    var discriminator = (sequence) => {
                        var score = 0;
                        for (var i = 1; i < sequence.length; i++) {
                            if (sequence[i] === sequence[i - 1]) score++;
                        }
                        return score / (sequence.length - 1);
                    };

                    var realSequence = history.slice(-10);
                    var noise = Array.from({ length: 10 }, () => Math.random());
                    var generated = generator(noise);

                    var realScore = discriminator(realSequence);
                    var generatedScore = discriminator(generated);

                    console.log("🧪 GAN Real Score:", realScore.toFixed(2), "| Fake Score:", generatedScore.toFixed(2));

                    return generatedScore > realScore ? 'hi' : 'lo';
                }

                // 📈 Virtual Candle Analysis
                function analyzeVirtualCandle() {
                    if (history.length < 10) return 'lo';

                    var profitSeries = history.slice(-10).map((r, i) => r === 'win' ? 1 : -1);
                    var open = profitSeries[0];
                    var close = profitSeries.length > 0 ? profitSeries[profitSeries.length - 1] : 0;
                    var high = Math.max(...profitSeries);
                    var low = Math.min(...profitSeries);

                    var candleType = 'neutral';
                    if (close > open) candleType = 'bullish';
                    else if (close < open) candleType = 'bearish';

                    var pattern = 'none';
                    if (candleType === 'doji' && Math.abs(open - close) < 0.1) pattern = 'doji';
                    else if (candleType === 'bullish' && close - open > 0.5 && high - close < 0.2) pattern = 'hammer';

                    // Technical Indicators (Simplified)
                    var sum = profitSeries.reduce((a, b) => a + b, 0);
                    var avgGain = profitSeries.filter(x => x > 0).reduce((a, b) => a + b, 0) / (profitSeries.filter(x => x > 0).length || 1);
                    var avgLoss = Math.abs(profitSeries.filter(x => x < 0).reduce((a, b) => a + b, 0)) / (profitSeries.filter(x => x < 0).length || 1);

                    var rs = avgGain / avgLoss;
                    var rsi = 100 - (100 / (1 + rs));
                    var macd = sum / profitSeries.length;

                    console.log(`Candle: ${candleType}, Pattern: ${pattern}, RSI: ${rsi.toFixed(2)}, MACD: ${macd.toFixed(2)}`);

                    if (pattern === 'hammer' || (candleType === 'bullish' && rsi < 30)) return 'hi';
                    else if (pattern === 'doji' && Math.abs(rsi - 50) < 10) return Math.random() > 0.5 ? 'hi' : 'lo';
                    else if (candleType === 'bearish' && rsi > 70) return 'lo';
                    else return 'lo';
                }

                // 🔮 DeepSeek Algorithm
                function deepSeekAlgorithm() {
                    if (history.length < 30) return 'lo';

                    var recentHistory = history.slice(-30);
                    var winStreak = 0;
                    var lossStreak = 0;

                    // Calculate current streaks
                    for (var i = recentHistory.length - 1; i >= 0; i--) {
                        if (recentHistory[i] === 'win') {
                            winStreak++;
                        } else {
                            break;
                        }
                    }
                    for (var i = recentHistory.length - 1; i >= 0; i--) {
                        if (recentHistory[i] === 'lose') {
                            lossStreak++;
                        } else {
                            break;
                        }
                    }

                    // Trend analysis
                    var trend = 0;
                    for (var i = 0; i < recentHistory.length - 1; i++) {
                        if (recentHistory[i] === recentHistory[i + 1]) {
                            trend++;
                        }
                    }
                    var trendPercentage = trend / (recentHistory.length - 1);

                    // Volatility check
                    var volatility = 0;
                    for (var i = 0; i < recentHistory.length - 1; i++) {
                        if (recentHistory[i] !== recentHistory[i + 1]) {
                            volatility++;
                        }
                    }
                    var volatilityPercentage = volatility / (recentHistory.length - 1);

                    console.log(`DeepSeek: Win Streak: ${winStreak}, Loss Streak: ${lossStreak}, Trend: ${trendPercentage.toFixed(2)}, Volatility: ${volatilityPercentage.toFixed(2)}`);

                    // Make decision
                    if (lossStreak >= 3) {
                        return 'hi';
                    }
                    if (winStreak >= 2 && trendPercentage > 0.6) {
                        return 'hi';
                    }
                    if (volatilityPercentage > 0.5) {
                        return Math.random() > 0.5 ? 'hi' : 'lo';
                    }
                    return 'lo';
                }

                // ===== GAN Neural Models - Generator & Discriminator =====
                function generatorNeuralModel(noise) {
                    var sum = noise.reduce((acc, n) => acc + n, 0);
                    var avg = sum / noise.length;
                    return avg > 0.5 ? 'hi' : 'lo';
                }

                function discriminatorNeuralModel(inputDirection, realOutcome) {
                    // نگهداری رکورد و یادگیری تدریجی
                    ganMemory.push({ input: inputDirection, result: realOutcome });
                    if (ganMemory.length > MAX_MEMORY_SIZE) ganMemory.shift();

                    var trueHi = ganMemory.filter(x => x.input === 'hi' && x.result === 'win').length;
                    var trueLo = ganMemory.filter(x => x.input === 'lo' && x.result === 'win').length;

                    return trueHi > trueLo ? 'hi' : 'lo';
                }

                function decideWithGAN() {
                    var noise = Array.from({ length: 5 }, () => Math.random());
                    var genOutput = generatorNeuralModel(noise);
                    var discOutput = discriminatorNeuralModel(genOutput, history.at(-1));
                    console.log(`🧬 GAN Decision: G=${genOutput} | D Evaluated=${discOutput}`);
                    return discOutput;
                }



            // 🧠 Multi-Agent Decision Making
            function multiAgentDecide() {
                var votes = { hi: 0, lo: 0 };
                var agents = ['qlearning', 'sarsa', 'deep', 'ultra']; // Agents to include

                agents.forEach(agent => {
                    if (algorithms[agent]) {
                        var result = algorithms[agent](history);
                        if (result instanceof Promise) {
                            result.then(res => {
                                votes[res] += 1;
                            });
                        } else {
                            votes[result] += 1;
                        }
                    }
                });

                // Return decision after short delay to collect votes from async agents
                return new Promise(resolve => {
                    setTimeout(() => {
                        var finalDecision = votes.hi >= votes.lo ? 'hi' : 'lo';
                        console.log("🤖 Multi-Agent Vote:", votes, "| Final:", finalDecision);
                        resolve(finalDecision);
                    }, 1000);
                });
            }



            // 🧠 Self-Supervised Learning - Pattern Encoder
            function decideWithSelfSupervisedLearning() {
                var sequenceLength = 6;
                var patterns = {};

                if (history.length < sequenceLength + 1) return 'lo';

                for (var i = 0; i < history.length - sequenceLength; i++) {
                    var pattern = history.slice(i, i + sequenceLength).join(',');
                    var next = history[i + sequenceLength];
                    if (!patterns[pattern]) patterns[pattern] = { hi: 0, lo: 0 };
                    var index = (i + sequenceLength) % 2 === 0 ? 'lo' : 'hi';
                    if (next === 'win') patterns[pattern][index]++;
                }

                var recentPattern = history.slice(-sequenceLength).join(',');
                var prediction = patterns[recentPattern];

                if (prediction) {
                    console.log("🔍 Self-Supervised Pattern:", recentPattern, "=>", prediction);
                    return prediction.hi >= prediction.lo ? 'hi' : 'lo';
                } else {
                    return Math.random() > 0.5 ? 'hi' : 'lo'; // fallback
                }
            }


            // 🧠 Ensemble Learning - Combining Multiple Strategies
            function decideWithEnsembleLearning() {
                var votes = { hi: 0, lo: 0 };
                var voters = [
                    qLearningDecide,
                    sarsaDecide,
                    deepSeekAlgorithm,
                    decideWithGAN,
                    decideWithUltraAI,
                    decideWithMemoryBasedLearning,
                    decideWithBayesianLearning
                ];

                return new Promise(async (resolve) => {
                    for (var decide of voters) {
                        try {
                            var result = decide(history);
                            if (result instanceof Promise) result = await result;
                            votes[result]++;
                        } catch (err) {
                            console.warn("❌ Ensemble voter failed:", err);
                        }
                    }
                    var decision = votes.hi >= votes.lo ? 'hi' : 'lo';
                    console.log("🧠 Ensemble Voting:", votes, "| Final:", decision);
                    resolve(decision);
                });
            }



            // ⚡ Event-Based Learning
            function decideWithEventBasedLearning() {
                var recent = history.slice(-10);
                var events = { reversals: 0, spikes: 0, trends: 0 };

                for (var i = 2; i < recent.length; i++) {
                    if (recent[i] !== recent[i - 1] && recent[i - 1] !== recent[i - 2]) {
                        events.reversals++;
                    }
                    if (recent[i] === 'win' && recent[i - 1] === 'win' && recent[i - 2] === 'lose') {
                        events.trends++;
                    }
                }

                if (events.reversals >= 2) return 'hi';
                if (events.trends >= 2) return 'lo';
                return Math.random() > 0.5 ? 'hi' : 'lo';
            }



            // 🧠 Meta-Adaptive Voting Strategy
            function decideWithMetaAdaptiveLearning() {
                var strategies = [
                    'qlearning', 'sarsa', 'deep', 'ultra', 'gan', 'memory', 'bayesian', 'selfsupervised', 'eventbased', 'candle', 'random'
                ];
                var votes = { hi: 0, lo: 0 };
                var weights = {};

                // محاسبه وزن هر الگوریتم بر اساس موفقیت گذشته
                strategies.forEach(name => {
                    var stat = stats[name];
                    if (!stat || stat.attempts === 0) {
                        weights[name] = 1;
                    } else {
                        var successRate = stat.success / stat.attempts;
                        weights[name] = 1 + successRate * 4; // افزایش وزن الگوریتم‌های موفق‌تر
                    }
                });

                return new Promise(async (resolve) => {
                    for (var name of strategies) {
                        var fn = algorithms[name];
                        if (!fn) continue;
                        try {
                            var result = fn(history);
                            if (result instanceof Promise) result = await result;
                            votes[result] += weights[name];
                        } catch (err) {
                            console.warn("MetaAdaptive Error for", name, ":", err);
                        }
                    }

                    var decision = votes.hi >= votes.lo ? 'hi' : 'lo';
                    console.log("🧠 Meta-Adaptive Votes:", votes, "| Final:", decision);
                    resolve(decision);
                });
            }


            // Add to algorithm list


            // Register the new multi-agent algorithm



            // 🌟 Ultra-Advanced AI Model 🌟
                    if (!ultraModel) {
                        console.warn("%c⚠️  Ultra AI Model Not Loaded!  Using Random Choice Instead.  You MUST replace this with real model loading. ", "color: red; font-weight: bold;");
                        await sleep(2000); // Simulate model loading delay
                        return Math.random() > 0.5 ? 'hi' : 'lo'; // Fallback to random
                    }

                    // Prepare input data
                    var modelInput = prepareInputData(history); // Use the new function

                    try {
                        // Make the prediction
                        var prediction = await ultraModel.predict(modelInput);
                        var processedPrediction = processPrediction(prediction); // Use the new function
                        console.log("%c✨ Ultra AI Prediction:", "color: Gold;", processedPrediction);
                        return processedPrediction;

                    } catch (error) {
                        console.error("%c🚨 Ultra AI Prediction Error:", "color: DarkRed;", error);
                        return Math.random() > 0.5 ? 'hi' : 'lo'; // Fallback
                    }
                }

                /**
                 * Prepares the input data for the Ultra AI model.
                 * This function is crucial and must be adapted to your model's specific input requirements.
                 *
                 * @param {string[]} history - The history of game results ('win' or 'lose').
                 * @returns {any} - The processed input data, ready for the model.
                 */
                    // Example: Convert history to a numerical sequence, padding if necessary
                    var sequenceLength = 20; // Example sequence length, adjust as needed for your model
                    var numericalHistory = history.map(result => result === 'win' ? 1 : 0); // 1 for win, 0 for lose

                    // Pad or truncate the history to match the expected sequence length
                    if (numericalHistory.length < sequenceLength) {
                        var padding = new Array(sequenceLength - numericalHistory.length).fill(0); // Pad with zeros
                        numericalHistory = padding.concat(numericalHistory);
                    } else if (numericalHistory.length > sequenceLength) {
                        numericalHistory = numericalHistory.slice(numericalHistory.length - sequenceLength); // Truncate
                    }

                    //  IMPORTANT:  Adapt this function to match *EXACTLY* what your model expects.
                    //  This is the most common source of errors.  If your model expects a 3D tensor,
                    //  or a different data type, or a different normalization, you *MUST* handle
                    //  that here.

                    // Convert to a tensor (if using TensorFlow.js) or array (for other libraries)
                    // Example using TensorFlow.js:
                    // return tf.tensor([numericalHistory], [1, sequenceLength]);
                    //
                    // Example using a simple array:
                    return [numericalHistory]; // Wrap in an array if your model expects a batch dimension.
                }

                /**
                 * Processes the raw output of the Ultra AI model into a betting decision ('hi' or 'lo').
                 * This function is also crucial and must be adapted to your model's output.
                 *
                 * @param {any} prediction - The raw prediction output from the model.
                 * @returns {string} - The betting decision ('hi' or 'lo').
                 */
                    // Example:  If the model outputs a probability of winning, compare to a threshold
                    // if (prediction[0] > 0.5) { //  Example for TensorFlow.js
                    //   return 'hi';
                    // } else {
                    //   return 'lo';
                    // }
                    //
                    // Example:  If the model outputs a class index (0 or 1), map it to 'hi' or 'lo'
                    // if (prediction === 0) {
                    //   return 'lo';
                    // } else if (prediction === 1) {
                    //   return 'hi';
                    // }
                    //
                    //  Example for a simple array output
                    if (prediction[0] > 0.6) {  // Adjust threshold as needed
                        return 'hi';
                    } else {
                        return 'lo';
                    }

                    // IMPORTANT:  Adapt this function to match *EXACTLY* the format of your model's
                    // output.  If your model outputs a vector of probabilities, or log-odds,
                    // or a class index, you *MUST* handle that here.  The string "hi" and "lo"
                    // *MUST* be returned.
                }



                function decideWithMemoryBasedLearning() {
                    var memorySize = 20;
                    var recent = history.slice(-memorySize);
                    var patternScores = { hi: 0, lo: 0 };

                    for (var i = 0; i < recent.length - 5; i++) {
                        var pattern = recent.slice(i, i + 5).join(',');
                        var nextOutcome = recent[i + 5];

                        if (nextOutcome === 'win') {
                            if (i % 2 === 0) {
                                patternScores.lo++;
                            } else {
                                patternScores.hi++;
                            }
                        }
                    }

                    console.log("🧠 Memory-Based Pattern Scores:", patternScores);
                    return patternScores.hi >= patternScores.lo ? 'hi' : 'lo';
                }



                function decideWithBayesianLearning() {
                    var prior = { hi: 0.5, lo: 0.5 }; // فرض اولیه: احتمال برابر
                    var likelihood = { hi: 1, lo: 1 };
                    var recent = history.slice(-20);

                    recent.forEach((result, index) => {
                        if (result === 'win') {
                            if (index % 2 === 0) {
                                likelihood.lo *= 1.2; // اگر برد در lo بوده
                                likelihood.hi *= 0.9;
                            } else {
                                likelihood.hi *= 1.2;
                                likelihood.lo *= 0.9;
                            }
                        } else {
                            if (index % 2 === 0) {
                                likelihood.lo *= 0.9;
                                likelihood.hi *= 1.1;
                            } else {
                                likelihood.hi *= 0.9;
                                likelihood.lo *= 1.1;
                            }
                        }
                    });

                    var evidence = (likelihood.hi * prior.hi) + (likelihood.lo * prior.lo);
                    var posteriorHi = (likelihood.hi * prior.hi) / evidence;
                    var posteriorLo = (likelihood.lo * prior.lo) / evidence;

                    console.log("📊 Bayesian Posterior: HI =", posteriorHi.toFixed(4), "| LO =", posteriorLo.toFixed(4));
                    return posteriorHi > posteriorLo ? 'hi' : 'lo';
                }



                function decideWithTransferLearning() {
                    var baseKnowledge = { hi: 0.5, lo: 0.5 }; // Prior from pre-trained knowledge
                    var recent = history.slice(-15);
                    var adjustFactor = { hi: 1, lo: 1 };

                    recent.forEach((result, index) => {
                        if (result === 'win') {
                            if (index % 2 === 0) {
                                adjustFactor.lo += 0.1;
                            } else {
                                adjustFactor.hi += 0.1;
                            }
                        } else {
                            if (index % 2 === 0) {
                                adjustFactor.lo -= 0.1;
                            } else {
                                adjustFactor.hi -= 0.1;
                            }
                        }
                    });

                    var scoreHi = baseKnowledge.hi * adjustFactor.hi;
                    var scoreLo = baseKnowledge.lo * adjustFactor.lo;

                    console.log("🔄 Transfer Learning Adjusted Scores:", { hi: scoreHi, lo: scoreLo });

                    return scoreHi > scoreLo ? 'hi' : 'lo';
                }




            // 🧠 Self-Supervised Learning - Pattern Encoder



            var algorithms = {
                    supersmart: decideWithSuperSmartAI,
                    metaadaptive: decideWithMetaAdaptiveLearning,
                    eventbased: decideWithEventBasedLearning,
                    ensemble: decideWithEnsembleLearning,
                    selfsupervised: decideWithSelfSupervisedLearning,
                    human: decideWithTrendMemory, // Human-like: Trend Memory
                    historical: decideWithLossPattern, // Historical: Loss Pattern
                    deep: deepSeekAlgorithm, // Deep Analysis: DeepSeek
                    winning: decideWithWeightedLearning, // High Win Rate: Weighted Learning
                    deceptive: ganPatternPredictor, // Deceptive: GAN
                    random: decideWithRandom,
                    candle: analyzeVirtualCandle,
                    streak: decideWithStreakTrend,
                    ultra: decideWithUltraAI,
            memory: decideWithMemoryBasedLearning,
            bayesian: decideWithBayesianLearning,
            transfer: decideWithTransferLearning, // Ultra AI
            qlearning: qLearningDecide,
                    sarsa: sarsaDecide,
                };


            // ✅ تابع نهایی هوشمند - در جای درست بعد از algorithms
            function decideWithSuperSmartAI() {
                var trend = analyzeForecast();
                var adaptiveAlgo = getNextAdaptiveAlgorithm();

                // ذخیره آرای الگوریتم‌ها
                var votesArray = [];
                votesArray.push(adaptiveAlgo);


                if (trend === 'bullish') {
                    console.log("📈 روند صعودی - استفاده از الگوریتم ultra");
                    return algorithms.ultra(history);
                }
                if (trend === 'bearish') {
                    console.log("📉 روند نزولی - استفاده از الگوریتم memory");
                    return algorithms.memory(history);
                }

                console.log("🧠 تصمیم بر اساس الگوریتم تطبیقی:", adaptiveAlgo);
                return algorithms[adaptiveAlgo](history);
            }



            algorithms['multi'] = multiAgentDecide;

            (function () {
              'use strict';
            // -------------------- شروع: تابع تبدیل تاریخچه به حالت --------------------
                function getBettingState(history) {
                    var recentHistory = history.slice(-5).map(result => result === 'win' ? 1 : 0).join('');
                    return recentHistory || 'empty';
                }
                // -------------------- پایان: تابع تبدیل تاریخچه به حالت --------------------
              var maxHistory = 100;

              var getHistory = () => GM_getValue('rollHistory', []);
              var saveHistory = (data) => GM_setValue('rollHistory', data);

              var saveRoll = (roll) => {
                var history = getHistory();
                if (!Array.isArray(history)) history = [];
                history.push({
                  time: Date.now(),
                  roll: roll,
                });
                if (history.length > maxHistory) history.shift();
                saveHistory(history);
              };

              // 📈 تابع بررسی روند (trend direction)
              var getTrendScore = (history) => {
                var up = 0, down = 0;
                for (var i = 1; i < history.length; i++) {
                  if (history[i].roll > history[i - 1].roll) up++;
                  else if (history[i].roll < history[i - 1].roll) down++;
                }
                return Math.abs(up - down) / history.length; // هرچه به صفر نزدیک‌تر، نوسان طبیعی‌تر
              };

              // 🔍 بررسی نوسانات ناگهانی
              var detectSpikes = (history) => {
                var spikes = [];
                for (var i = 2; i < history.length; i++) {
                  var diff1 = Math.abs(history[i].roll - history[i - 1].roll);
                  var diff2 = Math.abs(history[i - 1].roll - history[i - 2].roll);
                  if (diff1 > 6000 && diff2 > 6000) spikes.push(i);
                }
                return spikes.length;
              };

              // 🧮 وزن‌دهی به داده‌های جدیدتر
              var getWeightedAverage = (history) => {
                var total = 0;
                var weightSum = 0;
                for (var i = 0; i < history.length; i++) {
                  var weight = i + 1; // وزن بیشتر به داده‌های جدید
                  total += history[i].roll * weight;
                  weightSum += weight;
                }
                return total / weightSum;
              };

              // 📊 تحلیل پیش‌بینی پذیری و ریسک
              var assessRisk = (history) => {
                var avg = getWeightedAverage(history);
                var trendScore = getTrendScore(history);
                var spikes = detectSpikes(history);

                var riskScore = 0;

                if (avg > 9000 || avg < 1000) riskScore += 1; // میانگین خطرناک
                if (trendScore < 0.2) riskScore += 1; // روند یکنواخت = مصنوعی
                if (spikes > 3) riskScore += 1; // نوسانات شدید

                return riskScore;
              };

              // تصمیم‌گیری نهایی
              var makeSmartDecision = () => {
                var history = getHistory();
                if (history.length < 10) return false;

                var riskScore = assessRisk(history);
                var confidence = Math.max(0, 1 - riskScore / 3); // از 0 تا 1

                console.log(`[AI] Risk Score: ${riskScore} | Confidence: ${confidence}`);

                return confidence > 0.7;
              };

              var extractRollResult = () => {
                var rollText = document.querySelector('#result')?.innerText;
                var rollNumber = parseInt(rollText);
                if (!isNaN(rollNumber)) {
                  saveRoll(rollNumber);
                }
              };

              var main = async () => {
                var shouldBet = makeSmartDecision();
                if (shouldBet) {
                  var btn = document.querySelector('#free_play_form_button');
                  if (btn) btn.click();
                } else {
                  console.warn('[AI] شرط لغو شد: اعتماد پایین');
                }
              };

              // نظارت بر نتایج و ذخیره‌سازی
              var observer = new MutationObserver(() => {
                if (document.querySelector('#result')) {
                  extractRollResult();
                }
              });

              observer.observe(document.body, { childList: true, subtree: true });

              // اجرای تحلیل هر 3 دقیقه
              setInterval(main, 180000);

                function chooseBestAlgorithm() {
                    var chosenAlgorithm = algorithmOrder[roundCounter % algorithmOrder.length];
                    console.log(`⚖️  Chosen Algorithm: ${chosenAlgorithm}`);
                    return chosenAlgorithm;
                }

                function updateStats(alg, success, profit) {
                    if (stats[alg]) {
                        stats[alg].attempts++;
                        if (success) {
                            stats[alg].success++;
                            stats[alg].reward += (profit / baseBet);
                        } else {
                            stats[alg].reward -= (Math.abs(profit) / baseBet) * 2;
                        }
                        GM_setValue('aiMultiStats', stats);
                    } else {
                        console.warn(`Algorithm "${alg}" not found in stats.  Skipping updateStats.`);
                    }
                }

                function areButtonsReady() {
                    var loBtn = document.querySelector('[id^="double_your_btc_bet_lo_button"]');
                    var hiBtn = document.querySelector('[id^="double_your_btc_bet_hi_button"]');
                    return loBtn && hiBtn && !isCaptchaActive() && !loBtn.disabled && !hiBtn.disabled;
                }

                function goToMultiplyBTC() {
                    var btn = Array.from(document.querySelectorAll('a')).find(el => el.innerText === "MULTIPLY BTC");
                    if (btn) {
                        simulateMouseMove(btn);
                        btn.click();
                        console.log("🔁 Clicking MULTIPLY BTC...");
                    }
                }

                    var links = document.querySelectorAll('a');
                    if (links.length) simulateMouseMove(links[random(0, links.length - 1)]);
                    window.scrollTo(0, random(100, 500));
                    await sleep(random(800, 1800));
                }

                function motivationalLoop() {
                    console.warn("❌ باخت یعنی مرگگ! نابودی! ❌");
                    console.warn("⚠️ نباید اشتباهات قبلی تکرار شوند. از هر باخت باید درس بگیری.");
                    console.warn("🎯 با دقت شرط ببند. تو حق باخت نداری. فقط پیروزی.");
                    setTimeout(motivationalLoop, 30000);
                }

                    // --- Load Ultra Model ---
                    try {
                        //  IMPORTANT:  Replace this with your actual model loading code.
                        //  This is just an example using a hypothetical function.
                        //  The key is that this function *must* be async, and it *must*
                        //  assign the loaded model to the 'ultraModel' variable.
                        //
                        // Example (TensorFlow.js -  LOAD FROM A URL):
                        // ultraModel = await tf.loadGraphModel('https://your-server.com/model/model.json');
                        //
                        // Example (TensorFlow.js - LOAD FROM LOCAL FILES -  Webpack/Parcel needed):
                        // ultraModel = await tf.loadGraphModel('/local_model/model.json');
                        //
                        // Example (PyTorch - Requires a server, and a different loading method)
                        // ultraModel = await loadPyTorchModel('https://your-pytorch-server.com/api/predict');
                        //
                        //  Replace with a *REAL* loading mechanism for your model type.
                        ultraModel = await loadModel(); // <--- REPLACE THIS LINE
                        console.log("%c✨ Ultra AI Model Loaded!", "color: Green;");
                    } catch (error) {
                        console.error("%c🚨 Failed to load Ultra AI Model:", "color: DarkRed;", error);
                        ultraModel = null; // Set to null to prevent errors later.  IMPORTANT.
                    }


                    history = await GM_getValue('betHistory', []);
                    stats = await GM_getValue('aiMultiStats', {
                        random: { success: 0, attempts: 1, reward: 0 },
                        lossPattern: { success: 0, attempts: 1, reward: 0 },
                        streakTrend: { success: 0, attempts: 1, reward: 0 },
                        trendMemory: { success: 0, attempts: 1, reward: 0 },
                        weighted: { success: 0, attempts: 1, reward: 0 },
                        gan: { success: 0, attempts: 1, reward: 0 },
                        candle: { success: 0, attempts: 1, reward: 0 },
                        deepSeek: { success: 0, attempts: 1, reward: 0 },
                        ultra: { success: 0, attempts: 1, reward: 0 }, // Stats for the Ultra AI
                    });

                    currentDirection = await GM_getValue('currentDirection', 'lo');
                    currentAlgorithm = await GM_getValue('currentAlgorithm', 'random');
                    ganMemory = await GM_getValue('ganMemory', []);
                    roundCounter = await GM_getValue('roundCounter', 0);

                    if (!stats.gan) {
                        stats.gan = { success: 0, attempts: 1, reward: 0 };
                    }
                    if (!stats.candle) {
                        stats.candle = { success: 0, attempts: 1, reward: 0 };
                    }
                    if (!stats.deepSeek) {
                        stats.deepSeek = { success: 0, attempts: 1, reward: 0 };
                    }
                    if (!stats.ultra) {
                        stats.ultra = { success: 0, attempts: 1, reward: 0 };
                    }
                    await GM_setValue('aiMultiStats', stats);
                    await GM_setValue('currentDirection', currentDirection);
                    await GM_setValue('currentAlgorithm', currentAlgorithm);
                    await GM_setValue('roundCounter', roundCounter);
                }




                    await initialize(); // Wait for initialization, including model loading


            epsilon = Math.max(0.01, epsilon * 0.995); // کاهش تدریجی epsilon
                        await fakeHumanActivity();
                        setTimeout(playNow, random(800, 1400));
                    }



            // 🧠 تعریف ایمن متغیرها برای Self-Regulation
            var lastResult = 'win';
            var lastBet = baseBet;
            var lastPayout = baseBet * 2;
            async 
            let forceFirstBet = true; // allow one-time forced execution

            function playNow() {
                if (forceFirstBet) {
                    console.warn("⚠️ Forcing first real bet to collect data...");
                    // Assuming there's a core function that actually performs the bet
                    placeRealBet(currentDirection, currentBetAmount); // hypothetical core betting function
                    forceFirstBet = false;
                    return;
                }

                if (!checkSelfRegulationConditions(lastResult, lastBet, lastPayout)) return;
                if (isCaptchaActive()) return setTimeout(playNow, 10000);
                if (!areButtonsReady()) return setTimeout(playNow, 800);

                // Main betting logic call here
                startBettingRoutine(); // assuming this exists to proceed with AI logic
            }
             {
                const stop = handleAdaptiveSmartMind(); if (stop === false) return;
                handleRiskyPrediction();
                if (!checkSelfRegulationConditions(lastResult, lastBet, lastPayout)) return;
                        if (isCaptchaActive()) return setTimeout(playNow, 10000);
                        if (!areButtonsReady()) return setTimeout(playNow, 800);

                        if (lossStreakCount >= MAX_LOSS_STREAK) {
                            console.warn(`🚨 توقف: ${MAX_LOSS_STREAK} باخت متوالی. منتظر بررسی دستی...`);
                            alert(`🚨 ${MAX_LOSS_STREAK} باخت متوالی! لطفاً ادامه شرط را دستی بررسی کنید.`);
                            return;
                        }

                        currentAlgorithm = chooseBestAlgorithm();
                        var expectedDirection;
                        if (algorithms[currentAlgorithm]) {
                            expectedDirection = await algorithms[currentAlgorithm](); // Await here, important for UltraAI
                        } else {
                            expectedDirection = 'lo';
                            console.warn(`Algorithm "${currentAlgorithm}" not found, defaulting to lo.`);
                        }
                        currentDirection = expectedDirection;

                        // Calculate expected win rate
                        var expectedWinRate = history.filter(r => r === 'win').length / (history.length || 1);
                        if (currentAlgorithm === 'random') {
                            expectedWinRate = 0.5;
                        }

                        if (expectedWinRate < 0.35) {
                            console.log("⏸️ Skip this round (low win prob)");
                            setTimeout(startCycle, random(2000, 4000));
                            return;
                        }

                        var btn = document.querySelector(`[id^="double_your_btc_bet_${currentDirection}_button"]`);simulateMouseMove(btn);
                        btn.click();
                        console.log(`🎯 BET on ${currentDirection.toUpperCase()} | ALGO: ${currentAlgorithm}`);
                        setTimeout(checkResult, random(2000, 3500));
                    }


            var hiLossStreak = 0, loLossStreak = 0;
            var maxHiLossStreak = 0, maxLoLossStreak = 0;
            var maxWinStreak = 0, currentWinStreak = 0;
            var lastDirection = '';
            var maxWinStreakSide = '';
            var maxLossStreakSide = '';

            function updateStreakStats(result, direction) {
                if (result === 'win') {
                    currentWinStreak++;
                    if (currentWinStreak > maxWinStreak) {
                        maxWinStreak = currentWinStreak;
                        maxWinStreakSide = direction;
                    }
                    if (direction === 'hi') hiLossStreak = 0;
                    if (direction === 'lo') loLossStreak = 0;
                } else {
                    currentWinStreak = 0;
                    if (direction === 'hi') {
                        hiLossStreak++;
                        if (hiLossStreak > maxHiLossStreak) {
                            maxHiLossStreak = hiLossStreak;
                        }
                    } else {
                        loLossStreak++;
                        if (loLossStreak > maxLoLossStreak) {
                            maxLoLossStreak = loLossStreak;
                        }
                    }
                }

                // گزارش
                maxLossStreakSide = maxHiLossStreak > maxLoLossStreak ? 'hi' : 'lo';
                console.log("📉 Max HI Loss Streak:", maxHiLossStreak);
                console.log("📉 Max LO Loss Streak:", maxLoLossStreak);
                console.log("🏆 Max WIN Streak:", maxWinStreak, "on", maxWinStreakSide);
                console.log("❗️ Most losses happened with:", maxLossStreakSide);
            }


                        if (isCaptchaActive())return setTimeout(checkResult, 10000);
                        var winText = document.getElementById('double_your_btc_bet_win')?.innerText.trim() || '';
                        var loseText = document.getElementById('double_your_btc_bet_lose')?.innerText.trim() || '';
                        var isWin = winText.match(/\d+\.\d+/);
                        var isLose = loseText.match(/\d+\.\d+/);

                        if ((isWin || isLose) && areButtonsReady()) {
                            var oldState = getBettingState(history);
                            var action = currentDirection;
                            var reward = isWin ? 1 : -1;
                            history.push(isWin ? 'win' : 'lose');
                            var newState = getBettingState(history);
                            var newSarsaAction = sarsaDecide(history); // برای SARSA

                            if (currentAlgorithm === 'qlearning') {
                                updateQTable(oldState, action, reward, newState);
                            } else if (currentAlgorithm === 'sarsa') {
                                updateSarsaTable(oldState, action, reward, newState, newSarsaAction);
                            }

                            if (isWin) {
                                console.log(`✅ WIN (${currentAlgorithm})`);
                                winCount++;
                                lossCount = 0;
                            updateStreakStats('win', currentDirection);
                                lossStreakCount = 0;
                                var profit = currentBet;
                                totalLoss -= currentBet;
                                updateStats(currentAlgorithm, true, profit);
                                await GM_setValue('betHistory', history);
                                setTimeout(() => {
                                    roundCounter = (roundCounter + 1) % algorithmOrder.length;
                                    GM_setValue('roundCounter', roundCounter);
                                    location.reload(); // Add refresh here
                                }, 2000);
                            } else {
                                console.log(`❌ LOSS (${currentAlgorithm})`);
                                lossCount++;
                                lossStreakCount++;
                                updateStreakStats('lose', currentDirection);
                                var loss = currentBet;
                                totalLoss += currentBet;
                                updateStats(currentAlgorithm, false, -loss);
                                await GM_setValue('betHistory', history);
                                await GM_setValue('ganMemory', ganMemory);
                                adjustBetAmount(); // Apply مارتینگل
                                motivationalLoop();
                                setTimeout(startCycle, 1000);
                            }
                        }
                    }

                    goToMultiplyBTC();
                    startCycle();
                }



                // --------------------  MODEL LOADING FUNCTION ----------------------
                /**
                 * Loads the Ultra AI model.  This is a placeholder function that YOU MUST REPLACE.
                 * It is made 'async' to support modern loading techniques (like fetch or tf.loadGraphModel).
                 *
                 * @returns {Promise<any>}  A Promise that resolves to the loaded model.  The
                 * type 'any' is a placeholder.  Replace it with the actual
                 * type of your model object (e.g., tf.LayersModel,
                 * a PyTorch model object, etc.).
                 */
                    //  REPLACE THIS ENTIRE FUNCTION WITH YOUR ACTUAL MODEL LOADING CODE.
                    //  This is just a placeholder example.  The specific code here will depend
                    //  entirely on:
                    //
                    //  1.  What library you are using (TensorFlow.js, PyTorch, ONNX, etc.)
                    //  2.  Where your model is located (a local file, a remote server, etc.)
                    //  3.  The format of your model (JSON, binary, etc.)
                    //
                    //  Here are a few examples, but you will need to adapt them:
                    //
                    //  Example 1: TensorFlow.js (loading from a URL)
                    //  -------------------------------------------------------------
                    //  return await tf.loadGraphModel('https://your-server.com/model/model.json');
                    //
                    //  Example 2: TensorFlow.js (loading from local files - requires a bundler like Webpack)
                    //  -------------------------------------------------------------
                    //  return await tf.loadGraphModel('/local_model/model.json');
                    //
                    //  Example 3: PyTorch (loading from a server - requires a custom function)
                    //  -------------------------------------------------------------
                    //    var response = await fetch(url, { method: 'POST' , body: JSON.stringify({}), headers: {'Content-Type': 'application/json'}});
                    //    var modelData = await response.json();
                    //    //  Adapt this part to process the modelData as needed by your PyTorch setup
                    //    return modelData; //  Placeholder
                    //  }
                    //  return await loadPyTorchModel('https://your-pytorch-server.com/api/predict');
                    //
                    //  Example 4: ONNX (using onnxruntime-web -  More complex, requires setup)
                    //  ----------------------------------------------------------------------
                    //  var session = await ort.InferenceSession.create('/model.onnx');
                    //  return session;
                    //
                    //
                    //  IMPORTANT:
                    //  -  This function *MUST* be async.
                    //  -  It *MUST* return the loaded model.
                    //  -  The model object should be ready to make predictions.
                    //  -  Handle any errors (e.g., network errors, file not found).
                    //  -  The 'ultraModel' variable at the top of the script should
                    //     be assigned the value returned by this function.
                    //
                    //  Placeholder:  Simulate a delay and return a dummy object.
                    await sleep(3000);
                    console.log("LOAD MODEL PLACEHOLDER")
                    return { predict: (input) => { console.log("PLACEHOLDER PREDICT", input); return [0.6]; } }; // Dummy model
                }



                // Initialize and start
                initialize().then(() => {
                    startBettingScript();
                });




            // ✅ تابع نهایی هوشمند - در جای درست بعد از algorithms
        })();
    })();
})();