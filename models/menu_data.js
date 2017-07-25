define([], function() {

    var menu_data = [
		{id: "dashboard", icon: "dashboard", value: "Dashboards",  data:[
			{ id: "dashboard1", value: "Dashboard 1"},
			{ id: "dashboard2", value: "Dashboard 2"}
		]},
		{id: "layouts", icon: "columns", value:"Layouts", data:[
			{ id: "accrodions", value: "Accordions"},
			{ id: "portlets", value: "Portlets"}
		]}		
	];	

    return {
        data: menu_data      
    };
});