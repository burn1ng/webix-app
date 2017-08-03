define([
    'models/records'
], (records) => {
    let ui = {
        view: 'datatable', autoConfig: true
    };

    return {
        $ui: ui,
        $oninit(view, $scope) {
            let popup = $scope.ui({
                view: 'popup',
                position: 'center',
                body: 'Data is updated'
            });

            $scope.on(records.data, 'onDataUpdate', () => {
                popup.show();
            });

            view.parse(records.data);
        }
    };
});
