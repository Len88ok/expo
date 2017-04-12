var frontIndex = {

    initJsTree: function (treeSelector) {
            treeSelector.jstree({
            "themes": {
                "theme": "default",
                "dots": true,
                "icons": true
            },
            "core": {
                'multiple': true,
                "animation": true,
                "check_callback": true,
                "themes": {"stripes": true}
            },
            "checkbox": {
                "keep_selected_style": false
            },
            "types": {
                "#": {
                    "max_depth": 5,
                    "valid_children": ["root"]
                },
                "folder": {
                    "max_depth": 5,
                    "valid_children": ["root"]

                },
                "root": {
                    "icon": "/static/3.1.1/assets/images/tree_icon.png",
                    "valid_children": ["default"]
                },
                "default": {
                    "valid_children": ["default", "file"]
                },
                "file": {
                    "icon": "glyphicon glyphicon-file",
                    "valid_children": []
                }
            },
            "plugins": ['themes', 'html_data', 'checkbox', 'types', 'wholerow', 'unique']
        });
    }
};
