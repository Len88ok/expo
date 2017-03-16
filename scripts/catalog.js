$(function() {
    var bookMark = {

        addUrl: '/add-bookmark',
        removeUrl: '/remove-bookmark',

        add: function(element) {
            $.post(this.addUrl, { element: element.attr('id'), type: element.data('type') })
                .done(function(data) {
                    if(!data.error) {
                        element.addClass('active');
                    }
                });
        },

        remove: function(element){
            $.post(this.removeUrl, { element: element.attr('id'), type: element.data('type') })
                .done(function(data) {
                    if(!data.error) {
                        element.removeClass('active');
                    }
                });
        }
    };

    $(document).ready(function() {

        $('body').on('click', '.bookmark', function(e) {
            e.preventDefault();

            if($(this).hasClass('active')) {
                bookMark.remove($(this));
            } else {
                bookMark.add($(this));
            }
        });

        function initFB(type, height, width) {

            return {
                closeBtn: true,
                ajax: {
                    type: 'POST',
                    cache: false
                },
                overlayShow: false,
                padding: '0px',
                beforeShow: function () {
                    $('.saveNote').attr('data-type', type);

                    if(window.screen.width < 1600) {
                        h = '500';
                        w = '490';
                    }

                    this.width = width;
                    this.height = height;
                    $('.fancybox-wrap').addClass('bookmark-notes-popup-outer');

                }
            };
        }

        $('.note_catalog').fancybox(initFB('catalog', '638', '490'));
        $('.note_stand').fancybox(initFB('stand', '638', '490'));

        $('body').on('click', '.saveNote', function(e) {
            e.preventDefault();

            var that = $(this);
            var comment  = $('.comment_' + that.data('item-id'));
            var type = that.data('type');
            var catalogItemId = that.data('catalog-item-id');

            $.ajax({
                url: that.attr('href'),
                method: 'POST',
                data: {
                    Id: that.data('item-id'),
                    comment: comment.val(),
                    type: type
                },
                success: function(data) {
                    if(!data.error) {
                        if(data.itemId != undefined) {
                            var noteTitleSelector = $('#' + data.itemId).find('span.link');
                            if(data.isCommentFieldEmpty) {
                                noteTitleSelector.removeClass('content-bookmark');
                                noteTitleSelector.prev().removeClass('selected');
                            } else {
                                noteTitleSelector.addClass('content-bookmark');
                                noteTitleSelector.prev().addClass('selected');
                            }
                        }
                        $.fancybox.close();
                    }
                }
            });
        });

        $('body').on('click', '.remove', function() {

            if(xhr) {
                xhr.abort();
            }

            var that = $(this);
            var data = {
                element: $(this).data('id'),
                type: $(this).data('type')
            };

            xhr = $.ajax({
                url: $(this).data('url'),
                method: 'POST',
                data: data,
                success: function(data) {
                    that.closest('li').addClass('removed-item');
                    setTimeout(function() {
                        that.closest('li').remove();
                    }, 500);

                    xhr = false;
                },
                fail: function() {}
            });
        });

    });
});
$(function() {

    Array.prototype.in_array = function(p_val) {
        for(var i = 0, l = this.length; i < l; i++)  {
            if(this[i] == p_val) {
                return true;
            }
        }
        return false;
    };

    var xhr = false;
    var ITEMS_AMOUNT = 10;
    var itemsCounter = 1;
    var standId = $('#stand').val();
    var allItemsAmount = $('#itemsAmount').val();

    var jstree = $('#jstree');
    jstree.jstree({
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

    jstree.jstree(true).settings.checkbox.cascade = "down";

    var itemsFilter = $('#itemsFilter');
    var itemsContainer = $('.catalog-items-list-outer');
        itemsContainer.scroll(getScrollerEndPoint);
    var params = getQueryParams();

    if (params.item != undefined && params.lvl != undefined) {
        var rootItem = params.item;
        var level = params.lvl;

        jstree.on('ready.jstree', function (env, data) {
            if(level != '-1') {
                var separator = ['m', 'f', 's'];
                var idToSelect = '#' + separator[level] + '_' + rootItem;
            } else {
                var idToSelect = '#' + rootItem;
            }

            $(this).jstree('open_all');
            $(this).jstree().show_dots();
            $(this).jstree("check_node", idToSelect);
        });

        filterItems(itemsFilter.val(), getCheckedCatalogNodes());

    } else {

        jstree.on('ready.jstree', function (env, data) {
            $(this).jstree('close_all');
            $(this).jstree().deselect_all(true);
            $(this).jstree().show_dots();
        });
    }

    jstree.on('deselect_node.jstree', function (env, data) {

        if(data.node.type == 'file') {
            var parentNodes = data.node.parents;

            for (var i = 0; i < parentNodes.length; i++) {
                if(parentNodes[i] != '#') {
                    var parentNode = jstree.jstree('get_node', '#' + parentNodes[i]);
                    var childNodes = parentNode.children;
                    var selectedNodes = $('#jstree').jstree('get_selected');
                    var isOneIfAChildrenIsSelected = false;

                    for(var j = 0; j < childNodes.length; j++) {
                        isOneIfAChildrenIsSelected = selectedNodes.in_array(parentNode.children[j]);

                        if(isOneIfAChildrenIsSelected) {
                            break;
                        }
                    }

                    if(!isOneIfAChildrenIsSelected) {
                        var deselectNodeId = $('#jstree').jstree('get_node', '#' + parentNodes[i]);
                        $('#jstree').jstree('deselect_node', deselectNodeId);
                    }

                }
            }
        }
    });

    if(!$('#jstree').find('li').length) {
        $('.uploadCatalog-popup').addClass('inactiveLink');
    }

    $('body').on('click', '.uploadCatalog-popup', function(e) {
        e.preventDefault();
        $.fancybox.open('#download-catalog', {
            beforeShow: function() {
                if($('#jstree').find('li').length) {
                    if(!$('#jstree').jstree().get_checked(true).length && itemsFilter.val() == "") {
                        $('.uploadCatalog').eq(0).addClass('inactiveLink');
                    }
                    $('.fancybox-overlay').addClass('catalog-item-upload-popup');
                } else {
                    $('.uploadCatalog').addClass('inactiveLink');
                }
            },
            afterClose: function() {
                if($('#jstree').find('li').length) {
                    if($('.uploadCatalog').eq(0).hasClass('inactiveLink')) {
                        $('.uploadCatalog').eq(0).removeClass('inactiveLink');
                    }
                }
            }
        });
    });

    $('body').on('click', '.uploadCatalog', function (e) {
        e.preventDefault();

        var data = {};
        data.stand = standId;

        var isCustomisedCatalog = $(this).data('type');
        var url = $(this).attr("href");
        var selectedFileElements = [];
        var checkedItems = jstree.jstree().get_checked(true);

        if (isCustomisedCatalog && itemsFilter != undefined && itemsFilter.val() == '' && checkedItems.length) {
            var x = {};

            $.each(checkedItems, function (key, data) {
                var parentKey = data.parent.split('_')[1];
                selectedFileElements.push({id: data.id, parent: parentKey + '_item'});
            });

            for (var k in selectedFileElements) {
                if (x[selectedFileElements[k]['parent']] == undefined)
                    x[selectedFileElements[k]['parent']] = [];
                x[selectedFileElements[k]['parent']].push({id: selectedFileElements[k]['id']});
            }

            data.items = JSON.stringify(x);

        } else if (isCustomisedCatalog && itemsFilter.val() != '') {
            data.filterText = itemsFilter.val();
        } else if (isCustomisedCatalog && itemsFilter.val() == '' && !checkedItems.length) {
            data.isFull = 1;
        }

        downloadCatalog(url, data);
    });

    itemsFilter.on('keyup', function () {
        itemsCounter = 1;
        filterItems($(this).val(), getCheckedCatalogNodes());
    });

    jstree.on('changed.jstree', function (e, data) {
        itemsFilter.val('');
        itemsCounter = 1;
        itemsContainer.scrollTop(0);

        if (data.node != undefined) {
            filterItems(itemsFilter.val(), getCheckedCatalogNodes());
        }
    });

    function filterItems(filterText, nodes) {

        var data = {};
        data.filterText = filterText;
        data.standId = standId;
        data.itemsAmount = 1;

        if (nodes != undefined && nodes.parents != undefined && nodes.parents != false) {
            data.parents = JSON.stringify(nodes.parents);
        }

        if (nodes != undefined && nodes.childs != undefined && nodes.childs != false) {
            data.childs = JSON.stringify(nodes.childs);
        }

        if (filterText != undefined) {
            setTimeout(function () {
                itemsLoader(data);
            }, 1000);
        } else {
            itemsLoader(data);
        }
    }

    function itemsLoader(data) {

        if (xhr) {
            xhr.abort();
        }

        data.meetingroom = 0;

        xhr = $.ajax({
            url: "/stand-search-catalog-items",
            method: 'POST',
            data: data,
            success: function (data) {
                if (!data.error) {
                    $('#item_container').html(data.data);
                } else {
                    alert(data.message);
                }
                xhr = false;
            }
        });
    }

    function getCheckedCatalogNodes() {

        var checkedIds = [];
        var checkedChildIds = [];
        var checkedElemets = jstree.jstree("get_checked", true);
        var regEs = /^[m|f|s]/;

        if (checkedElemets.length) {

            for (var i = 0; i < checkedElemets.length; i++) {
                var id = checkedElemets[i].id.split('_')[1];
                if (regEs.test(checkedElemets[i].id)) {
                    checkedIds.push(id);
                }
            }

            for (var j = 0; j < checkedElemets.length; j++) {
                if(!regEs.test(checkedElemets[j].id)) {
                    var parentsOfElement = checkedElemets[j].parents;
                    var firstElementParent = jstree.jstree(true).get_node('#' + parentsOfElement[0]);

                    if(!firstElementParent.state.selected) {
                        checkedChildIds.push(checkedElemets[j].id);
                    } else {
                        $.each(parentsOfElement, function(index, value) {
                            var parentElementObj = jstree.jstree(true).get_node('#' + value);

                            if(
                                parentElementObj.state.selected &&
                                value.split('_')[1] != undefined &&
                                checkedIds.indexOf(value.split('_')[1]) == -1 &&
                                checkedChildIds.indexOf(checkedElemets[j].id) == -1
                            ) {
                                checkedChildIds.push(checkedElemets[j].id);
                            }
                        });
                    }
                }
            }
        }

        return {
            parents: checkedIds,
            childs: checkedChildIds
        };
    }

    function getScrollerEndPoint() {

        var scrollHeight = itemsContainer.prop('scrollHeight');
        var divHeight = itemsContainer.height();
        var scrollerEndPoint = scrollHeight - divHeight;
        var divScrollerTop = itemsContainer.scrollTop() + 5;

        if (divScrollerTop === scrollerEndPoint) {
            itemsCounter++;
            loadMoreCatalogItems(itemsFilter.val(), getCheckedCatalogNodes());
        }
    }

    function loadMoreCatalogItems(filterText, nodes) {

        var data = {};
        data.itemsAmount = itemsCounter;
        data.filterText = filterText;

        if (nodes != undefined && nodes.parents != undefined && nodes.parents != false) {
            data.parents = JSON.stringify(nodes.parents);
        }

        if (nodes != undefined && nodes.childs != undefined && nodes.childs != false) {
            data.childs = JSON.stringify(nodes.childs);
        }

        data.standId = standId;
        xhr = itemsLoader(data);

    }

    function downloadCatalog(url, data) {

        $.fileDownload(url, {
            httpMethod: "POST",
            data: data
        });
    }

    function getQueryParams() {
        var qs = document.location.search.split('+').join(' ');

        var params = {},
            tokens,
            re = /[?&]?([^=]+)=([^&]*)/g;

        while (tokens = re.exec(qs)) {
            params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
        }

        return params;
    }
});