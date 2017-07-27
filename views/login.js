define([
  'models/formData'
], function (formData) {
  var ui = {
    rows: [
    { template: 'Hello to XB Software!', type: 'header' },
    {},
      {cols: [
      {},
        {
          view: 'form',
          id: 'log_form',
          elements: [
            { view: 'fieldset',
              label: 'Please, sign in',
              body: {
                rows: [
                  { view: 'text', label: 'Email', name: 'email', placeholder: 'E-mail' },
                  { view: 'text', type: 'password', label: 'Password', name: 'password', placeholder: 'Password' }
                ]
              }},
            {
              margin: 5,
              cols: [
                    { view: 'button', value: 'Login', type: 'form' },
                    { view: 'button', value: 'Cancel' }
              ]
            }
          ]
        },
      {}
      ]},
    {}
    ]
  }
  return {
    $ui: ui,
    $oninit: function (view, $scope) {
      var popup = $scope.ui({
        view: 'popup',
        position: 'center',
        body: 'Welcome to dashboard'
      })

      $scope.on(formData.data, 'onDataUpdate', function () {
        popup.show()
      })

      view.parse(formData.data)
    }
  }
})
