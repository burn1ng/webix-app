define([], () => {
    let multiviewCells = [
        {id: 'dashboard', template: 'Content of item1'},
        {id: 'dashboard1', template: 'subContent of item1'},
        {id: 'dashboard2', template: 'subContent of item1'},
        {id: 'layout', template: 'Content of item1'},
        {id: 'layout1', template: 'subContent of item1'},
        {id: 'layout2', template: 'subContent of item1'}
    ];

    return {
        data: multiviewCells
    };
});
