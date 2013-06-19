
( function($) {

		$.fn.stcddl = function(customData, customOptions) {
			/*** private member ***/
			var s = {
				c : this,
				s : null,
				l : {
					parent : this,
					c : null,
					i : null,
					a : null
				}
			};

			var inputFocus = false;
			var currShow = null;
			var options = null;
			var data = null;
			var $this = this;
			switch(arguments.length) {
				case 1:
					if ( typeof arguments[0] === 'object') {
						data = customData;
						if (data.length > 0) {
							options = {
								"selectedId" : data[0].id,
								"label" : null,
								"style" : "ddl-style1",
								"dropPos" : "middle",
								"count" : false,
								"change" : null,
								"addForm" : false,
								"addFormContent" : null,
								"formAction" : "",
								"add" : null
							};
							run();
						}
						return;
					} else
						return;
					break;
				case 2:
					if ( typeof arguments[0] === 'object') {
						data = customData;
						options = arrayMerge({
							"selectedId" : data[0].id,
							"label" : null,
							"style" : "ddl-style1",
							"dropPos" : "middle",
							"count" : false,
							"change" : null,
							"addForm" : false,
							"addFormContent" : null,
							"formAction" : "",
							"add" : null
						}, customOptions);
						run();
					} else if ( typeof arguments[0] === 'string') {
						data = get("data");
						return get(arguments[1]);
					} else {
						return;
					}
					break;
				case 3:
					options = get("options");
					data = get("data");
					setSelector();
					set(arguments[1], arguments[2]);
					break;
				default:
					return;
					break;
			}

			/*** private method ***/
			function get(member) {
				switch(member) {
					case "selectedItem":
						return s.c.data("selectedItem");
						break;
					case "selectedId":
						return s.c.data("selectedId");
						break;
					case "data":
						return s.c.data("data");
					case "options":
						return s.c.data("options");
					default:
						$.error('Thuộc tính "' + member + '" không tồn tại!');
						break;
				}
			}

			function set(member, value) {
				switch(member) {
					case "selectedItem":
						$.error('"' + member + '" là thuộc tính chỉ đọc!');
						break;
					case "selectedId":
						item = itemById(s.c.data('data'), value);
						s.c.data("selectedId", value);
						s.c.data("selectedItem", item);
						changeSelectedItem(value);
						if (options.change)
							options.change.call(item)
						break;
					case "addItem":
						addItem(value);
						break;
					case "editItemName":
						editItemName(value);
						break;
					case "editItemCount":
						editItemCount(value);
						break;
					case "deleteItem":
						deleteItem(value);
						break;
					default:
						$.error('Thuộc tính "' + member + '" không tồn tại!');
						break;
				}
			}

			function changeSelectedItem(itemId) {
				s.l.i.children(".ddl-item").each(function() {
					var $value = $(this).children(".ddl-item-value");
					var id = $value.attr("value"), name = $value.text();
					if (id == itemId) {
						s.s.attr("value", id);
						s.s.text(name);
						return;
					}
				});
			}
			
			function editItemName(item){
				s.l.i.children(".ddl-item").each(function() {
					var $value = $(this).children(".ddl-item-value");
					var id = $value.attr("value");
					if (id == item.id) {
						var thisItem = indexOfId(data,item.id);
						thisItem.name = item.name;
						$value.text(item.name);
						
						if (get("selectedId") == item.id) {
							s.s.text(item.name);
						}
					}
				});
			}
			
			function editItemCount(item){
				if(!options.count) return;
				s.l.i.children(".ddl-item").each(function() {
					var $count = $(this).children(".ddl-item-count");
					var id = $count.attr("value");
					if (id == item.id) {
						var thisItem = indexOfId(data,item.id);
						thisItem.count = item.count;
						$count.text(item.count);
						return;
					}
				});
			}

			function deleteItem(itemId) {
				s.l.i.children(".ddl-item").each(function() {
					var $value = $(this).children(".ddl-item-value");
					var id = $value.attr("value"), name = $value.text();
					if (id == itemId) {
						$(this).remove();
						var index = indexOfId(data,itemId);
						if(index > 0 )
							data.splice(index, 1);
						if (get("selectedId") == itemId) {
							set("selectedId", data[0].id)
						}
						return;
					}
				});
			}

			function addItem(item) {
				var itemDom = createItemDom(item);
				s.l.i.append(itemDom);
				data.push(item);
				s.l.i.children(".ddl-item").click(function() {
					var $value = $(this).children(".ddl-item-value");
					var id = $value.attr("value"), name = $value.text();
					s.s.attr("value", id);
					s.s.text(name);
					var selItem = itemById(data, id);
					s.c.data("selectedItem", selItem);
					s.c.data("selectedId", selItem.id);
					if (options.change && typeof options.change == 'function') {
						options.change.call(selItem);
					}
				});
			}

			function setSelector() {
				s.s = s.c.children(".ddl-selected").children().children(".ddl-selected-item");
				s.l.c = s.c.children(".ddl-list");
				s.l.i = s.l.c.children(".ddl-items");
				s.l.a = s.l.c.children(".ddl-addform");
			}
			
			function setupItemsDom(){
				
			}

			function setup() {
				setSelector();
				s.c.data("data", data);
				s.c.data("options", options);
				var d = document;
				$(d).click(function(e) {
					if (!inputFocus)
						s.l.c.fadeOut("slow");
				});
				s.c.click(function(e) {
					e.stopPropagation();
					if (currShow != null) {
						if (!inputFocus)
							currShow.fadeOut();
					}
					if (s.l.c.is(':visible')) {
						if (!inputFocus)
							s.l.c.hide();
					} else {
						switch(options.dropPos){
							case "top-left":
								var h1, h2;
								h1 = $(this).height();
								h2 = s.l.c.height();
								s.l.c.css("top", (h1 - h2) + "px");
								s.l.c.css("left", "-" + $(this).width() + "px");
								break;
							case "top":
								var h1, h2;
								h1 = $(this).height();
								h2 = s.l.c.height();
								s.l.c.css("top", (h1 - h2) + "px");
								break;
							case "middle":
								var h1, h2;
								h1 = $(this).height();
								h2 = s.l.c.height();
								s.l.c.css("top", (h1 - h2) / 2 + "px");
								break;
							case "bottom":
								s.l.c.css("top", "23px");
								break;
						}
						s.l.c.fadeIn("slow");
						currShow = s.l.c;
					}
				});

				s.l.i.children(".ddl-item").click(function() {
					var $value = $(this).children(".ddl-item-value");
					var id = $value.attr("value"), name = $value.text();
					s.s.attr("value", id);
					s.s.text(name);
					var selItem = itemById(data, id);
					s.c.data("selectedItem", selItem);
					s.c.data("selectedId", selItem.id);
					if (options.change && typeof options.change == 'function') {
						options.change.call(selItem);
					}
				});

				if (options.addForm) {
					s.l.a.hover(function() {
						inputFocus = true;
					}, function() {
						inputFocus = false;
					});
					var $input = s.l.a.find("input"),
						$button = s.l.a.find("button");
					disabled="disabled"
					$button.click(function(e) {
						e.preventDefault();
						if (jQuery.trim($input.val()) == "") {
							$input.focus();
							return;
						}
						if(options.addFormContent != null){
							if(options.add && typeof options.add == "function")
								options.add.call($input);
							return;
						}
						var data, url;
						url = options.formAction;
						data = {
							name : $input.val()
						};
						$button.attr("disabled","disabled");
						$.post(url, data, function(response) {
							if (response <= 0)
								return;
							var newItem = {
								id : response,
								name : $input.val(),
								count: 0
							};
							addItem(newItem);
							$input.val("");
							$button.removeAttr("disabled");
							if(options.add && typeof options.add == 'function'){
								options.add.call(newItem);
							}
						});
					});
				}
			}

			/*** private ui helper function ***/
			// Create Item Dom
			function createItemDom(item) {
				var html = '';
				html += '<div class="ddl-item" data-index="0">';
				html += '<span class="ddl-item-value" value="' + item.id + '">' + item.name + '</span>';
				if (options.count) {
					var count = item.count == undefined ? 0 : item.count;
					html += '<span class="ddl-item-count" value="' + item.id + '">' + count + '</span>';
				}
				html += '</div>';
				return html;
			}

			// Create Items Dom
			function createItemsDom(items) {
				var html = '';
				html += '<div class="ddl-items">';
				for (var i = 0; i < items.length; i++) {
					html += createItemDom(items[i]);
				}
				html += '</div>';
				return html;
			}

			// Create Add Form Dom
			function createAddFormDom() {
				var ddlAddForm = document.createElement("div");
				$(ddlAddForm).addClass("ddl-addform");
				if(options.addFormContent != null){
					$(ddlAddForm).append(options.addFormContent);
					return ddlAddForm;
				}
				
				var html = '';
				html += '<form action="' + options.formAction + '">';
				html += '<input type="text" class="text"><button>Thêm</button>';
				html += '</form>';
				$(ddlAddForm).append(html);
				return ddlAddForm;
			}

			// Create List Dom
			function createListDom() {
				var ddlList = document.createElement("div");
				$(ddlList).addClass("ddl-list");
				$(ddlList).append(createItemsDom(data));
				if (options.addForm) {
					$(ddlList).append(createAddFormDom());
				}
				/*var html = '';
				html += '<div class="ddl-list">';
				html += createItemsDom(data);
				if (options.addForm) {
					html += createAddFormDom();
				}
				html += '</div>';
				return html;*/
				return ddlList;
			}

			// Create Selected Dom
			function createSelectedDom() {
				var item, html = '';
				if(options.label == null){
					item = itemById(data, options.selectedId);
					if(item == null) {
						return "";
					}
				}
				else{
					item = {
						id : "-1",
						name : options.label
					};
				}
				s.c.data("selectedItem",item);
				s.c.data("selectedId",item.id);
				html += '<div class="ddl-selected">';
				html += '<div style="display: table-row">';
				html += '<div class="ddl-selected-item" value="' + item.id + '">' + item.name + '</div>';
				html += '<div class="ddl-icon"></div>';
				html += '</div>';
				html += '</div>';
				return html;
			}

			// Create DDL Dom
			function createDDLDom() {
				var style = "ddl ";
				style += options.style;
				s.c.addClass(style);
				s.c.append(createSelectedDom());
				s.c.append(createListDom());
			}

			/*** Helper functions ***/
			function indexOfId(data, id) {
				for (var i = 0; i < data.length; i++) {
					if (data[i].id == id) {
						return i;
					}
				};
				return -1;
			}
			
			function uiItemById(id){
				var item = null;
				s.l.i.each(function(){
					var item = $(this).children(".ddl-item-value");
					if(item.attr("value") == id)
						return this;
				});
				return null;
			}

			function itemById(data, id) {
				var index = indexOfId(data, id);
				if(index < 0) return null;
				return data[index];
			}

			function arrayMerge(a, b) {
				if (a) {
					if (b)
						for (var i in b)
						a[i] = b[i];
					return a;
				} else {
					return b;
				}
			};

			function autoId() {
				var len = $.fn.stcddl.ddls.length;
				return "stcddl" + len;
			};

			/*** RUN ***/
			function run() {
				createDDLDom();
				setup();
				return;
			}

		};

	}(jQuery));

