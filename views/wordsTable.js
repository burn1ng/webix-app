define([
    'views/grid/gridTopToolbar',
    'views/grid/grid',
    'views/grid/gridBottomToolbar'
], (gridTopToolbar, grid, gridBottomToolbar, _) => {
    let ui = {
        view: 'layout',
        id: 'wordsTable',
        rows: [
            grid
            // etc
        ]
    };

    return {
        $ui: ui
    };
});
