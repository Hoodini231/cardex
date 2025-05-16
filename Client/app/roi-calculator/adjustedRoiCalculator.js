function roundToTwoDP(num) {
    return Math.round(num * 100) / 100;
}


function calculateROI(ExpectedValue, price, risk, emotion, spend) {
    if (ExpectedValue === 0) {
        return [0, 0];
    }
    
    const riskFactor = risk / 10 + 0.2;
    const emotionFactor = emotion / 10;
    const spendFactor = spend / 10 + 0.15;
    const adjusted = roundToTwoDP(ExpectedValue + (emotionFactor * Math.abs(price - ExpectedValue)));

    const riskWeight = 0.4;
    const spendWeight = 0.6;
    const acceptable_loss = -1 * Math.max(price,roundToTwoDP(riskWeight * (riskFactor * price) + spendWeight * (spendFactor * price)));
    console.log('Adjusted: ' + adjusted);
    return [adjusted, acceptable_loss]
}

export { calculateROI };