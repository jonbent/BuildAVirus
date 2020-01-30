module.exports = ({populationTotal, populationNow, name}) => `
    <div class="world-info-item">
        <div class="world-info-name">${name}</div>
        <div class="world-info-pop-total">Total Pop: ${populationTotal}</div>
        <div class="world-info-pop-now">Current Pop: ${populationNow}</div>
        <div class="world-info-pop-gone">Total Killed: ${populationTotal - populationNow}</div>
    </div>
    
`;