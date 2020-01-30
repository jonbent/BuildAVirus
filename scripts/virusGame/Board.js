module.exports = class Board {
    constructor({map, game}) {
        this.map = map;
        this.game = game;
        this.bubbles = [];
        this.selectedEvent = false;

    }
    generateBubble({event, location}){
        const newEvent = document.createElement(`div`);
        newEvent.classList.add("side-bar-listing");
        newEvent.innerHTML = event.title;
        document.getElementById('map-side-bar').prepend(newEvent);
        if (!this.selectedEvent) document.getElementById(`side-bar-footer`).innerHTML = `${event.description} in ${location.properties.name}`;
        this.bubbles[location.id] = {
            name: event.title,
            significance: event.description,
            centered: location.id,
            location: location.properties.name,
            radius: 30
        };
        this.map.bubbles(Object.values(this.bubbles));
        const removeTimeout = setTimeout(() => {newEvent.remove(); delete this.bubbles[location.id]; this.map.bubbles(Object.values(this.bubbles));}, 13000);
        console.log(this.bubbles)
        this.game.map.svg.selectAll(".datamaps-bubble").on('click', (bubble) => {
            delete this.bubbles[bubble.centered];
            this.map.bubbles(Object.values(this.bubbles));
            clearTimeout(removeTimeout);
            this.game.numBubblesClicked += 1;
            setTimeout(() => newEvent.remove(), 13000);

        });
        setTimeout(() => {newEvent.style.opacity = '0'}, 10000);
    }
}