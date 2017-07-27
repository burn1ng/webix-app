define([], function (formData) {
  var ui = {
    rows: [
    { template: 'Welcome to English App!', type: 'header' },
    {},
      {cols: [
      {},
        {
          view: 'form',
          maxWidth: 300,
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
                    { view: 'button', value: 'Login', type: 'form', id: 'loginButton' },
                    { view: 'button', value: 'Cancel' }
              ]
            }
          ],
          rules: {
            'email': webix.rules.isEmail,
            'login': webix.rules.isNotEmpty
          }
        },
      {}
      ]},
    {}
    ]
  }

  return {
    $ui: ui,
    $oninit: function (view, $scope) {
      var myForm = $$('log_form')

      $$('loginButton').attachEvent('onItemClick', function () {
        // webix.ajax().post('/login', values, function (text, data, xhr) {
        //   console.log('text: ' + text)
        //   console.log('data: ' + data.toString())
        //   console.log('xhr: ' + xhr.toString())
        // })
        webix.send('/login', myForm.getValues())
      })

      myForm.elements['email'].attachEvent('onChange', function (newv, oldv) {
        webix.message('Value changed from: ' + oldv + ' to: ' + newv)
      })
    }
  }
})
