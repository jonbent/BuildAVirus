module.exports = ({totalPop, infectedPop, healthyPop, deadPop, name}) => `
    <div class="world-info-item">
        <div class="world-info-name">${name}</div>
        <div class="world-info-pop-total">Total Pop: ${totalPop}</div>
        <div class="world-info-pop-now">Current Pop: ${healthyPop + infectedPop}</div>
        <div class="world-info-pop-gone">Total Infected: ${infectedPop}</div>
        <div class="world-info-pop-gone">Total Killed: ${deadPop}</div>
        <div class="world-info-pop-gone">Total Killed %: ${Math.round((deadPop / totalPop) * 100)}</div>
    </div>
    
`;