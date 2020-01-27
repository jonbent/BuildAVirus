
document.addEventListener('DOMContentLoaded', () => {
    const map = new Datamap({
        element: document.getElementById('world-map'),
        scope: 'world',
        height: null, // If not null, datamaps will grab the height of 'element'
        width: null, // If not null, datamaps will grab the width of 'element',
        fills: {
            defaultFill: 'red' // Any hex, color name or rgb/rgba value
        }
    });
})