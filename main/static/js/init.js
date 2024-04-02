
/*
 * Copyright (c) 2023 Frenify
 * Author: Frenify
 * This file is made for CURRENT TEMPLATE
*/


$.fn.frenifyMoveCursorToEnd = function () {
	"use strict";
	this.focus();
	var $thisVal = this.val();
	this.val('').val($thisVal);
	return this;
};
var FrenifyTechWaveTime = new Date();
var isPaused = false;
var new_chat = true;
(function ($) {
	"use strict";

	var TechwaveSelectedCount = 0;

	var TechwaveFeedFilterLoading = false;
	var TechwaveModelFilterLoading = false;

	var TechwaveInputText = '';
	var TechwaveUserQuestion = '';

	var TechwaveUserMessageCount = 0;

	var FrenifyTechWave = {
		indexValue: '',
		collectionValue: '',
		modelValue: '',
		tempValue: 5,
		nov: 4,
		promptValue: '',
		showFlag: false,
		init: function () {
			this.marquee();
			this.tooltip();
			this.fontDialog();
			this.modelTabs();
			this.bookmark();
			this.contactForm();
			this.negativePrompt();
			this.imageGenerationSidebar();
			this.rangeSlider();
			this.quantity();
			this.selectModel();
			this.anchor();
			this.aiChatBot__chat();
			this.aiChatBotOptions();
			this.aiChatBotTextareaHeight();
			this.billingProgress();
			this.inputFileOnChange();
			this.optionsList();
			this.pricingTab();
			this.feedFilters();
			this.report();
			this.follow();
			this.copyLink();
			this.galleryIsotope();
			this.imageLightbox();
			this.like();
			this.accordion();
			this.search();
			this.animatedText();
			this.movingSubMenuForLeftPanel();
			this.panelResize();
			this.navBarItems();
			this.redetectFullScreen();
			this.fullSCreen();
			this.navSubMenu();
			this.imgToSVG();
			this.BgImg();
			this.popupMobile();
			//
			this.chatConfig();
			this.documentFilters();
			this.indexSidebar();
			this.addCollectionButtonEvent();
			this.addDocumentUploadEvent();
			this.accountManager();
			this.modalclose();
			this.openindexmodal();
			this.permission();
		},

		permission: function () {
			$("#permission_userSelect").on("change", function (e) {
				var user_name = $("#permission_userSelect").val();
				var csrfToken = $('input[name="csrfmiddlewaretoken"]').val();

				var sendData = {
					"user_name": user_name,
				};
				$.ajax({
					url: '/getpermissioninfo',
					method: 'POST',
					headers: { 'X-CSRFToken': csrfToken },
					data: sendData,
					success: function (result) {
						var llm_data = result['llm_data'];
						var index_data = result['index_data'];
						var prompt_data = result['prompt_data'];
						var vector = result['vector'];

						console.log(index_data);
						// llm replace
						$("#llm_permission_bar").html("");
						for (var llm in llm_data) {
							var status = llm_data[llm];
							var status_str = "";
							if (status)
								status_str = "checked";
							var model_content = "<label class='fn__toggle' style='padding: 25px'>" + llm + "<span class='t_in'><input type='checkbox'" + status_str + " onchange='llm_permission(this.name)' name='" + llm + "'><span class='t_slider'></span><span class='t_content'></span></span></label>";

							$("#llm_permission_bar").append(model_content);
						}

						// index replace
						$("#index_permission_bar").html("");
						for (var index in index_data) {
							var index_status_str = "";
							if (index_data[index]['total_status'])
								index_status_str = "checked";

							var index_content = "<div class='header'><label class='fn__toggle'>" + index + "<span class='t_in'><input type='checkbox' " + index_status_str + " name='" + index + "' onchange='index_permission(this.name)'><span class='t_slider'></span><span class='t_content'></span></span></label>";

							var collection_label_content = "";
							for (var collection in index_data[index]['collections']) {
								var collection_status_str = "";

								if (index_data[index]['collections'][collection])
									collection_status_str = "checked";

								collection_label_content += "<label class='fn__toggle' style='padding: 25px'>" + collection + "<span class='t_in'><input type='checkbox' " + collection_status_str + " name='" + collection + "' onchange='collection_permission(this.name, this.id)' id='" + index + "' class='" + index + "'><span class='t_slider'></span><span class='t_content'></span></span></label>";
							}

							var content = "<div class='divider'>" + index_content + "<div class='content'>" + collection_label_content + "</div>" + "</div>";

							$("#index_permission_bar").append(content);
						}

						// permission replace
						$("#prompt_permission_bar").html("");
						console.log(prompt_data);
						for (var prompt in prompt_data) {
							var status = prompt_data[prompt];
							var status_str = "";
							if (status)
								status_str = "checked";
							var model_content = "<label class='fn__toggle' style='padding: 25px'>" + prompt + "<span class='t_in'><input type='checkbox'" + status_str + " onchange='prompt_permission(this.name)' name='" + prompt + "'><span class='t_slider'></span><span class='t_content'></span></span></label>";

							$("#prompt_permission_bar").append(model_content);
						}

						// vector replace
						$("#vector_permission_bar").html("");
						var content = "<input type='number' value='" + vector + "' id='vector_input'><button class='fn_save_but' onclick='vector_permission()'>Save</button >";
						$("#vector_permission_bar").append(content);


					},
					error: function (xhr, status, error) {
						console.error('Error occurred: ', error);
					}
				});
			});



		},
		openindexmodal: function () {
			$(".techwave_create_index_but").click(function () {
				$("#techwave_index_modal").css("display", "block");
			});

			$(".fn__delete_but").click(function () {
				$("#techwave_delIndex_modal").css("display", "block");
			});

			$("#create_index_but").click(function () {
				var index_name = $("#create_index_name_value").val();
				var model = $("#create_index_model_value").val();

				if (index_name != "") {
					var csrfToken = $('input[name="csrfmiddlewaretoken"]').val();

					var sendData = {
						"index_name": index_name,
						"model": model,
					};
					$(".techwave_fn_preloader").css("display", "flex");

					$.ajax({
						url: '/createIndex',
						method: 'POST',
						headers: { 'X-CSRFToken': csrfToken },
						data: sendData,
						success: function (result) {
							location.reload();
						},
						error: function (xhr, status, error) {
							// console.error('Error occurred: ', error);
							// alert("Error occurred!");
							location.reload();
						}
					});


				}
			});

			$("#delete_index_but").click(function () {
				var index_name = $("#delete_index_value").val();

				if (index_name != "") {
					var csrfToken = $('input[name="csrfmiddlewaretoken"]').val();

					var sendData = {
						"index_name": index_name,
					};

					$(".techwave_fn_preloader").css("display", "flex");

					$.ajax({
						url: '/deleteIndex',
						method: 'POST',
						headers: { 'X-CSRFToken': csrfToken },
						data: sendData,
						success: function (result) {
							location.reload();
						},
						error: function (xhr, status, error) {
							// console.error('Error occurred: ', error);
							// alert("Error occurred!");
							location.reload();
						}
					});


				}
			});



			$(".techwave_refresh_but").click(function () {
				new_chat = true
				$('.fn__chatbot .chat__item.active').html('');
			});

			$(".techwave_pause_but").click(function () {
				isPaused = true;
				console.log("Hello");
			});
		},

		modalclose: function () {
			$(".techwave_modal_close").click(function () {
				$("#techwave_index_modal").css("display", "none");
				$("#techwave_collection_modal").css("display", "none");
				$("#techwave_delIndex_modal").css("display", "none");
			});
		},
		// changeindex: function () {
		// 	$("[id=index_tab]").click(function () {
		// 		var index_name = $(this).attr("name");
		// 		var csrfToken = $('input[name="csrfmiddlewaretoken"]').val();

		// 		var sendData = {
		// 			"index_name": index_name,
		// 		};

		// 		$.ajax({
		// 			url: '/getindexinfo',
		// 			method: 'POST',
		// 			headers: { 'X-CSRFToken': csrfToken },
		// 			data: sendData,
		// 			success: function (result) {
		// 				console.log(result.collections);
		// 			},
		// 			error: function (xhr, status, error) {
		// 				console.error('Error occurred: ', error);
		// 				alert("Error occurred!")
		// 			}
		// 		});


		// 	});
		// },

		accountManager: function () {
			$(".account__management__table input[type=checkbox]").change(function () {
				var checkCell = $(this);
				var checkFlag = checkCell.is(':checked');
				var userId = checkCell.attr('userId');

				var sendData = {
					"status": checkFlag,
					"id": userId,
				};

				var csrfToken = $('input[name="csrfmiddlewaretoken"]').val();

				$.ajax({
					url: '/changeUserAuth',
					method: 'POST',
					headers: { 'X-CSRFToken': csrfToken },
					data: sendData,
					success: function (result) {
					},
					error: function (xhr, status, error) {
						console.error('Error occurred: ', error);
						alert("Error occurred!")
					}
				});
			});
		},
		marquee: function () {
			$(".TickerNews .marquee").each(function () {
				var e = $(this);
				if (!e.hasClass('ready')) {
					e.addClass('ready').marquee({
						duplicated: true,
						duration: parseInt(e.data('speed')) * 1000,
						delayBeforeStart: 0,
						direction: 'left',
						//						pauseOnHover: true,
						startVisible: true
					});
				}
			});
		},

		popupMobile: function () {
			if (window.matchMedia('(max-width: 767px)').matches) {
				var wrapperW = $('.techwave_fn_wrapper').width();
				var padding = 10;
				var maxWidth = 300;
				$('.item__popup,.fn__nav_bar .item_popup').each(function () {
					var element = $(this);
					var parent = element.parent();
					var width = wrapperW - 2 * padding;
					var normal = Math.min(width, maxWidth);
					var leftOffset = parent.offset().left;
					var left = padding - leftOffset + (width - normal) / 2;

					var right = 'auto';

					if (element.data('position') === 'right') {
						if (leftOffset + parent.width() > normal) {
							left = 'auto';
							right = 0;
						}
					} else {
						if ((leftOffset + normal) < width) {
							left = 0;
						}
					}

					element.css({ maxWidth: normal, width: normal, left: left, right: right });
				});
			} else {
				$('.fn__nav_bar .item_popup,.item__popup').attr('style', '');
			}
		},

		tooltip: function () {
			$('body').on('mouseover mouseenter', '.fn__tooltip', function () {
				var element = $(this);
				var position = element.attr('data-position');
				if (typeof position === 'undefined' || position === true) {
					position = ['top', 'bottom', 'right', 'left'];
				}
				var options = {
					contentAsHTML: 'true',
					maxWidth: 300,
					animationDuration: 0,
					animation: 'fade', // 'fade', 'grow', 'swing', 'slide', 'fall'
					delay: 0,
					theme: 'tooltipster-techwave',
					side: position
				};
				if (element.hasClass('menu__item')) {
					if (!$('html').hasClass('panel-opened')) {
						element.tooltipster(options).tooltipster('hide');
						return;
					}
				}
				element.tooltipster(options);
				element.tooltipster('show');
			});
			//			$( ".fn__tooltip" ).each(function(){
			//				$(this).tooltipster({
			//					theme: 'tooltipster-techwave',
			//					animation: 'fade', // 'fade', 'grow', 'swing', 'slide', 'fall'
			//					side: 'bottom',
			//					maxWidth: 300,
			//					animationDuration: 0,
			//					delay: 0,
			//					trigger: 'click'
			//				});	
			//			});

		},

		fontDialog: function () {
			var dialog = $('.techwave_fn_font');
			$('.font__trigger').off().on('click', function () {
				dialog.addClass('opened');
				return false;
			});


			dialog.find('.font__closer').off().on('click', function () {
				dialog.removeClass('opened');
				return false;
			});
			dialog.find('.font__closer_link').off().on('click', function () {
				dialog.removeClass('opened');
				return false;
			});
			dialog.find('.apply').off().on('click', function () {
				$('.fn__chat_font_size_style').remove();
				$('body').append('<style type="text/css" class="fn__chat_font_size_style">frenify_typing h3,.fn__chatbot .chat{font-size: ' + $('#font_size').find(":selected").val() + 'px;}</style>');
				dialog.removeClass('opened');
				return false;
			});
		},

		modelTabs: function () {
			// tab filter
			$('.techwave_fn_models .fn__tabs a').off().on('click', function () {
				var element = $(this);
				if (!element.hasClass('active') && !TechwaveModelFilterLoading) {
					TechwaveModelFilterLoading = true;
					element.siblings().removeClass('active');
					element.addClass('active');
					var parent = element.closest('.techwave_fn_models');
					parent.find('.models__results').addClass('loading');

					// do your ajax here
					var sendData = {
						index: element.attr('name'),
					};

					// console.log(sendData);

					var csrfToken = $('input[name="csrfmiddlewaretoken"]').val();
					$.ajax({
						url: '/getDocuments',
						method: 'POST',
						headers: { 'X-CSRFToken': csrfToken },
						data: sendData,
						success: function (result) {
							if (result.success === "ok") {

								console.log(result.data);
								// documents reloading
								var docUl = parent.find(".fn__model_items");

								console.log(docUl.html())
								docUl.empty();

								// console.log("clear")

								$.each(result.data.documents, function (index, document) {
									console.log(document.collection);
									docUl.append(`<li class="fn__model_item">
													<div class="item" id="${document.id}">
														<div class="img">
															<img src="/static/img/models/1.jpg" alt="">
														</div>
														<div class="fn__selectable_item">
															<span class="icon">
															<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 408.8 294.1" style="enable-background:new 0 0 408.8 294.1;" xml:space="preserve" class="fn__svg replaced-svg">
																<g>
																	<path d="M408.8,36.8c-2,10.1-8.3,17.4-15.4,24.5C319.6,135,245.8,208.8,172.1,282.6c-10,10-21.5,14.3-35.1,9.5   c-5-1.7-9.9-4.9-13.6-8.6C85.6,246.1,48.1,208.6,10.6,171c-15.1-15.2-13.9-37,2.6-49.9c12.8-10,30.9-8.2,43.7,4.6   c28.9,28.9,57.8,57.8,86.6,86.7c1.1,1.1,1.8,2.6,3.4,4.9c1.7-2.3,2.4-3.6,3.4-4.6c67.1-67.1,134.2-134.2,201.2-201.3   c9.7-9.7,21-13.8,34.5-9.6c11.8,3.7,18.8,12,21.9,23.8c0.2,0.9,0.5,1.7,0.8,2.6C408.8,31,408.8,33.9,408.8,36.8z"></path>
																</g>
															</svg>
															</span>
														</div>
														<div class="item__info">
															<h3 class="title">${document.name}</h3>
															<p class="desc">
																Vector size: ${document.size} <br>
																created: ${document.created_at} <br>
															</p>
														</div>
														<div class="item__collection">
															${document.collection}
														</div>
													</div>
												</li>`);
								});

								// select/deselect items
								$('.fn__selectable_item').off().on('click', function () {
									var element = $(this),
										page = element.closest('.techwave_fn_models_page'),
										items = page.find('.fn__model_items .fn__model_item .item');
									if (element.hasClass('selected')) {
										element.removeClass('selected');
										TechwaveSelectedCount--;
									} else {
										element.addClass('selected');
										TechwaveSelectedCount++;
									}
									page.find('.fn__selection_box .count').text(TechwaveSelectedCount);
									return false;
								});

								// collection reloading
								var collectionList = $(".techwave_fn_accordion.collection__list");
								collectionList.empty();

								$.each(result.data.collections, function (index, collection) {
									collectionList.append(`
									<div class="acc__item" id="${collection.id}">
										<div class="acc__header">
											<h6 class="acc__title">${collection.name}</h6>
											<input class="collectionTitleEditor" type="text" id="${collection.id}" value="${collection.name}" style="display: none;" />
											<div class="acc__icon"></div>
										</div>
										<div class="acc__content">
											
											<!-- Upload Shortcode -->
											<label class="fn__upload">
												<a href="#" class="fn__closer fn__icon_button">
													<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 383.3 383.3" style="enable-background:new 0 0 383.3 383.3;" xml:space="preserve" class="fn__svg replaced-svg">
														<g>
															<path d="M15,383.3c-1.1-0.5-2.2-1-3.3-1.4C0.2,377.1-3.6,362.9,4,353.1c1.1-1.5,2.5-2.8,3.8-4.1c51.3-51.3,102.7-102.7,154-154   c1-1,2.4-1.7,3.9-2.7c-1.8-1.9-2.8-3-3.8-4C110.1,136.6,58.5,84.9,6.8,33.3c-5.2-5.2-7.9-11.2-6.3-18.5C3.7,0.7,20.2-4.7,31.1,4.7   c1.2,1.1,2.3,2.2,3.5,3.4C85.7,59.3,136.9,110.4,188,161.6c1.1,1.1,2,2.3,3.2,3.8c1.4-1.3,2.5-2.3,3.5-3.3   C246.4,110.3,298.1,58.7,349.8,7c6-6,12.7-8.6,21-5.8c6.7,2.2,10.2,7.5,12.5,13.9c0,2.5,0,5,0,7.5c-1.8,5.6-5.6,9.8-9.7,13.8   C322.8,87,272.1,137.7,221.3,188.4c-1,1-2,2.1-3.4,3.5c1.4,1.2,2.6,2.1,3.7,3.2c50.5,50.5,101.1,101.1,151.7,151.6   c4.2,4.2,8.1,8.4,10,14.1c0,2.5,0,5,0,7.5c-2.4,7.6-7.4,12.6-15,15c-2.5,0-5,0-7.5,0c-5.6-1.8-9.7-5.7-13.8-9.7   c-50.7-50.8-101.4-101.5-152.1-152.2c-1-1-2.1-2-3.7-3.5c-1.2,1.5-2,2.8-3,3.8C137.5,272.2,86.9,322.9,36.3,373.5   c-4.1,4.1-8.2,7.9-13.8,9.7C20,383.3,17.5,383.3,15,383.3z"></path>
														</g>
													</svg>
												</a>
												<span class="upload_content">
													<span class="title">Drag & Drop a PDF</span>
													<span class="desc">Supports PDF</span>
												</span>											
												<input type="file" accept=".pdf" multiple>
											</label>
											<div style="flex-wrap: wrap;">
											<a href="#" class="filter__new disabled techwave_fn_button has__icon small__border documentUploadBtn" style="margin-top: 10px; display: inline-block;">				
												<span>Upload</span>
											</a>
											<a href="#" class="filter__new disabled techwave_fn_button has__icon small__border collectionDelBtn" style="margin-top: 10px; display: inline-block;">				
												<span>Delete</span>
											</a>
										</div>
											<!-- !Upload Shortcode -->
											<div class="metas"  style="display: none;">
												<div class="meta">
													<input class="document_key" type="text" placeholder="Key*" style="margin-top: 10px; display: inline-block; width: 110px; min-width: 100px;"/>
													<input class="document_value" type="text" placeholder="Value*" style="margin-top: 10px;display: inline-block; width: 120px;  min-width: 100px;" />
												</div>
											</div>
										</div>
									</div>`);
								});
								FrenifyTechWave.accordion();
								// FrenifyTechWave.addCollectionButtonEvent();
								FrenifyTechWave.addDocumentUploadEvent();
								FrenifyTechWave.inputFileOnChange();

								parent.find('.models__results').removeClass('loading');
								// parent.find('.tab__item.active').removeClass('active');
								// $(element.attr('href')).addClass('active');
								TechwaveModelFilterLoading = false;
							}
							else {
								alert("Failed!");
							}
						},
						error: function (xhr, status, error) {
							console.error('Error occurred: ', error);
							alert("Error occurred!")
						}
					});
					// after ajax ends remove setTimeout (it was added just for HTML)

				}
				return false;
			});
		},

		contactForm: function () {
			$("#send_message").on('click', function () {
				var name = $(".fn_contact_form #name").val();
				var email = $(".fn_contact_form #email").val();
				var tel = $(".fn_contact_form #tel").val();
				var message = $(".fn_contact_form #message").val();
				var success = $(".fn_contact_form .returnmessage").data('success');

				$(".fn_contact_form .returnmessage").empty(); //To empty previous error/success message.
				//checking for blank fields	
				if (name === '' || email === '' || message === '') {
					$('.fn_contact_form .empty_notice').slideDown(500).delay(2000).slideUp(500);
				}
				else {
					// Returns successful data submission message when the entered information is stored in database.
					$.post("modal/contact.php", { ajax_name: name, ajax_email: email, ajax_message: message, ajax_tel: tel }, function (data) {

						$(".fn_contact_form .returnmessage").append(data);//Append returned message to message paragraph


						if ($(".fn_contact_form .returnmessage span.contact_error").length) {
							$(".fn_contact_form .returnmessage").slideDown(500).delay(2000).slideUp(500);
						} else {
							$(".fn_contact_form .returnmessage").append("<span class='contact_success'>" + success + "</span>");
							$(".fn_contact_form .returnmessage").slideDown(500).delay(4000).slideUp(500);
						}

						if (data === "") {
							$("#fn_contact_form")[0].reset();//To reset form fields on success
						}

					});
				}
				return false;
			});
		},

		negativePrompt: function () {
			$('#negative_prompt').on('change', function () {
				if (this.checked) {
					$('.techwave_fn_image_generation_page .exclude_area').slideDown(200);
				} else {
					$('.techwave_fn_image_generation_page .exclude_area').slideUp(200);
				}
			});
		},

		imageGenerationSidebar: function () {
			$('.techwave_fn_image_generation_page .sidebar__trigger').off().on('click', function () {
				$('.techwave_fn_wrapper').toggleClass('fn__has_sidebar');
				return false;
			});
		},
		indexSidebar: function () {
			$('.techwave_fn_image_generation_page .indexSidebar-trigger').off().on('click', function () {
				$('.techwave_fn_wrapper').toggleClass('fn__has_sidebar');
				return false;
			});
		},

		rangeSlider: function () {
			$('.fn__range').each(function () {
				var element = $(this),
					input = element.find('input'),
					val = input.val(),
					output = element.find('.value'),
					min = input.attr('min'),
					max = input.attr('max'),
					slider = element.find('.slider');
				slider.css({ width: (val * 100 / max) + '%' });
				input.on('input', function () {
					val = $(this).val();
					output.text(val);
					slider.css({ width: (val * 100 / max) + '%' });
				});
			});
		},

		quantity: function () {
			$('.fn__quantity .increase').off().on('click', function () {
				var parent = $(this).closest('.fn__quantity');
				var input = parent.find('input');
				var max = parseInt(input.attr('max'), 10);
				var value = parseInt(input.val(), 10);
				value = isNaN(value) ? 0 : value;
				if (max === value) {
					return false;
				}
				value++;
				input.val(value);
				return false;
			});
			$('.fn__quantity .decrease').off().on('click', function () {
				var parent = $(this).closest('.fn__quantity');
				var input = parent.find('input');
				var value = parseInt(input.val(), 10);
				var min = parseInt(input.attr('min'), 10);
				value = isNaN(value) ? 0 : value;
				if (min === value) {
					return false;
				}
				value--;
				input.val(value);

				return false;
			});
		},

		selectModel: function () {
			$('.fn__select_model .model_open').off().on('click', function () {
				$(this).closest('.fn__select_model').toggleClass('opened');
				return false;
			});

			$(window).on('click', function () {
				$('.fn__select_model').removeClass('opened');
			});

			$('.fn__select_model .all_models').on('click', function (e) {
				e.stopPropagation();
			});
		},

		anchor: function () {
			$('.techwave_fn_doc_page .docsidebar li.menu-item-has-children > a').off().on('click', function () {
				$(this).siblings('ul').slideToggle();
				return false;
			});
			if ($().onePageNav) {
				$('.techwave_fn_doc_page .docsidebar > ul').onePageNav();
			}
		},

		aiChatBot__chat: function () {
			if ($('#fn__chat_textarea').length && !$('.techwave_fn_intro').length) {
				$("#fn__chat_textarea").focus();
			}
			$("#fn__chat_textarea").keypress(function (e) {
				var code = (e.keyCode ? e.keyCode : e.which);
				if (code === 13 && e.shiftKey) {

				} else if (code === 13) {
					$('.fn__chat_comment button').trigger('click');
					return false;
				}
			});
			$('.fn__chat_comment button').off().on('click', function () {
				var button = $(this);
				var textarea = $('#fn__chat_textarea');
				var text = textarea.val();
				if (text === '' || button.hasClass('disabled')) {
					return;
				} else {
					text = text.replace(/\n\r?/g, '<br />');
					TechwaveUserQuestion = text;
					var activeChatItem = $('.fn__chatbot .chat__item.active');
					var newText = '<div class="chat__box your__chat"><div class="author"><span>You</span></div><div class="chat"><p>' + text + '</p></div></div>';
					$('.fn__chat_comment').removeClass('neww');
					if (activeChatItem.attr('id') === 'chat0') {
						activeChatItem.removeClass('active');
						$('.fn__new_chat_link').removeClass('active');
						var id = $('.fn__chatbot .chat__item').length;
						$('.fn__chatbot .chat__list').append('<div class="chat__item active" id="chat' + id + '">' + newText + '</div>');
						var newChatToRightPanel = '<li class="group__item"><div class="fn__chat_link active" href="#chat' + id + '"><span class="text">New Chat</span><input type="text" value="New Chat"><span class="options"><button class="trigger"><span></span></button><span class="options__popup"><span class="options__list"><button class="edit">Edit</button><button class="delete">Delete</button></span></span></span><span class="save_options"><button class="save"><img src="svg/check.svg" alt="" class="fn__svg"></button><button class="cancel"><img src="svg/close.svg" alt="" class="fn__svg"></button></span></div></li>';
						if ($('.fn__chatbot .chat__group.new').length) {
							$('.fn__chatbot .chat__group.new ul').append(newChatToRightPanel);
						} else {
							$('.fn__chatbot .sidebar_content').prepend('<div class="chat__group"><h2 class="group__title">Today</h2><ul class="group__list">' + newChatToRightPanel + '</ul></div>');
						}
						FrenifyTechWave.imgToSVG();
						FrenifyTechWave.aiChatBotOptions();
					} else {
						activeChatItem.append(newText);
					}
					textarea.val('');
					textarea.siblings('.fn__hidden_textarea').val('');
					FrenifyTechWave.aiChatBotTextareaHeight();

					if ($('.techwave_fn_intro').length) {
						$("html, body").animate({ scrollTop: textarea.offset().top - $(window).height() + 100 });
					} else {
						$("html, body").animate({ scrollTop: $(document).height() - $(window).height() });
					}
					textarea.frenifyMoveCursorToEnd();
				}

				// you can remove cognitista chat bot here
				FrenifyTechWave.cognitistaChat(text);

				// don't remove this
				return false;
			});
		},
		cognitistaChat: function (text) {
			var botText = '';
			var infoText = '';
			var append = true;
			var option_select = false
			TechwaveUserMessageCount = $('.fn__chatbot .chat__item.active .chat__box').length;

			// welcome text (first message of the bot)
			var confirmConfig = 'Please select the options.';

			// answer
			FrenifyTechWave.indexValue = $("#indexSelect").val();
			FrenifyTechWave.collectionValue = $("#collectionSelect").val();
			FrenifyTechWave.modelValue = $("#modelSelect").val();
			FrenifyTechWave.promptValue = $("#promptSelect").val();

			if (FrenifyTechWave.indexValue == null) FrenifyTechWave.indexValue = "";
			if (FrenifyTechWave.collectionValue == null) FrenifyTechWave.collectionValue = "";
			if (FrenifyTechWave.modelValue == null) FrenifyTechWave.modelValue = "";
			if (FrenifyTechWave.promptValue == null) FrenifyTechWave.promptValue = "";


			if (FrenifyTechWave.indexValue.trim() == "" || FrenifyTechWave.collectionValue.trim() == "" || FrenifyTechWave.modelValue.trim() == "" || FrenifyTechWave.promptValue.trim() == "") {
				option_select = true
				if (FrenifyTechWave.indexValue.trim() == "") botText = "Please select the index.";
				else if (FrenifyTechWave.collectionValue.trim() == "") botText = "Please select the collection.";
				else if (FrenifyTechWave.modelValue.trim() == "") botText = "Please select the model.";
				else if (FrenifyTechWave.promptValue.trim() == "") botText = "Please select the prompt.";
			}
			else {
				// send message to the bot

				var csrfToken = $('input[name="csrfmiddlewaretoken"]').val();
				var sendData = {
					index: FrenifyTechWave.indexValue,
					collection: FrenifyTechWave.collectionValue,
					model: FrenifyTechWave.modelValue,
					temperature: FrenifyTechWave.tempValue,
					nov: FrenifyTechWave.nov,
					prompt: FrenifyTechWave.promptValue,
					message: text,
					new_chat: new_chat,
				};

				$.ajax({
					url: '/query',
					method: 'POST',
					headers: { 'X-CSRFToken': csrfToken },
					data: sendData,
					xhrFields: {
						onprogress: function (e) {
							// console.log(e.currentTarget.response);
							var substr = e.currentTarget.response;
							const regex = {
								"bold_italic": /\*\*\*(.*?)\*\*\*/g,
								"bold": /\*\*(.*?)\*\*/g,
								"italic": /\*(.*?)\*/g,
								"monospace": /\`(.*?)\`/g,
								"strike": /\~\~(.*?)\~\~/g
							}
							for (let key in regex) {
								substr = substr.replace(regex[key], (match, group) => {
									if (key == "bold") return "<span class='bold'>" + group + "</span>";
									else if (key == "italic") return "<span class='italic'>" + group + "</span>";
									else if (key == "bold_italic") return "<span class='bold italic'>" + group + "</span>";
									else if (key == "monospace") return "<span class='monospace'>" + group + "</span>";
									else if (key == "strike") return "<span class='strike'>" + group + "</span>";

								})
							}
							// const regexs = /(?:https?|ftp):\/\/[\n\S]+/gi;
							const regexs = /(?:https?|ftp):\/\/[^\s\n,]+/gi;
							substr = substr.replace(regexs, (url) => `<a href="${url}" target="_blank">${url}</a>`);

							console.log(substr);
							$('.fn__chatbot .chat__item.active .chat__box.bot__chat:last-child .chat').html(substr);
						}
					},
					success: function (result) {
						$('.fn__chat_comment button').removeClass('disabled');
						if ($('.techwave_fn_intro').length) {
							$("html, body").animate({ scrollTop: $('#fn__chat_textarea').offset().top - $(window).height() + 100 });
						} else {
							$("html, body").animate({ scrollTop: $(document).height() - $(window).height() });
						}


						new_chat = false;
						// if (result.success === "ok") {
						// 	isPaused = false;
						// 	botText = result.response;
						// 	infoText = result.info;





						// 	// setTimeout(function () {

						// 	// 	// $('.fn__chatbot .chat__item.active .chat__box.bot__chat:last-child .chat').html(botText);
						// 	// 	var i = 0;
						// 	// 	var interval = setInterval(function () {
						// 	// 		if (i < botText.length) {
						// 	// 			if (i != 0)
						// 	// 				$('.fn__chatbot .chat__item.active .chat__box.bot__chat:last-child .chat').append(botText.charAt(i));
						// 	// 			else
						// 	// 				$('.fn__chatbot .chat__item.active .chat__box.bot__chat:last-child .chat').html(botText.charAt(i));
						// 	// 			i++;
						// 	// 		} else {
						// 	// 			clearInterval(interval);
						// 	// 		}
						// 	// 	}, 10);


						// 	// 	$('.fn__chat_comment button').removeClass('disabled');
						// 	// 	if ($('.techwave_fn_intro').length) {
						// 	// 		$("html, body").animate({ scrollTop: $('#fn__chat_textarea').offset().top - $(window).height() + 100 });
						// 	// 	} else {
						// 	// 		$("html, body").animate({ scrollTop: $(document).height() - $(window).height() });
						// 	// 	}
						// 	// }, 2000);



						// 	// $('.fn__chatbot .chat__item.active .chat__box.bot__chat:last-child .chat').html(botText);
						// 	// var i = 0;

						// 	// function timer() {
						// 	// 	if (i < botText.length && isPaused == false) {
						// 	// 		if (i != 0) {
						// 	// 			var substr = botText.substring(0, i + 1);
						// 	// 			for (let key in regex) {
						// 	// 				substr = substr.replace(regex[key], (match, group) => {
						// 	// 					if (key == "bold") return "<span class='bold'>" + group + "</span>";
						// 	// 					else if (key == "italic") return "<span class='italic'>" + group + "</span>";
						// 	// 					else if (key == "bold_italic") return "<span class='bold italic'>" + group + "</span>";
						// 	// 					else if (key == "monospace") return "<span class='monospace'>" + group + "</span>";
						// 	// 					else if (key == "strike") return "<span class='strike'>" + group + "</span>";

						// 	// 				})
						// 	// 			}
						// 	// 			$('.fn__chatbot .chat__item.active .chat__box.bot__chat:last-child .chat').html(substr);
						// 	// 		}

						// 	// 		else
						// 	// 			$('.fn__chatbot .chat__item.active .chat__box.bot__chat:last-child .chat').html(botText.charAt(i));

						// 	// 		i++;

						// 	// 		setTimeout(timer, 10);
						// 	// 	}
						// 	// 	else if (i == botText.length) {

						// 	// 		console.log(infoText);
						// 	// 		botText = botText + "\n" + "<span style='font-size: 14px'>" + infoText + "</span>";
						// 	// 		$('.fn__chatbot .chat__item.active .chat__box.bot__chat:last-child .chat').html(botText);
						// 	// 		// $('.fn__chatbot .chat__item.active .chat__box.bot__chat:last-child .chat').append(info_text);

						// 	// 	}
						// 	// }

						// 	// timer()


						// }
						// else console.error("Found an error in messaging...");
					},
					error: function (xhr, status, error) {
						console.error('Error occurred: ', error);
						alert("Message Error occurred!")
					}
				});
			}

			// answer to question
			if (append) {
				$('.fn__chat_comment button').addClass('disabled');

				setTimeout(function () {
					var load_text = "";
					if (option_select) load_text = "<span class='load'>" + botText + "</span>";
					else load_text = "<span class='think'>" + "Thinking..." + "</span>";

					$('.fn__chatbot .chat__item.active').append('<div class="chat__box bot__chat"><div class="author"><span>Cognitista AI</span></div><div class="chat"><frenify_typing><h3>' + load_text + '</h3></frenify></div></div>');

					if ($('.techwave_fn_intro').length) {
						$("html, body").animate({ scrollTop: $('#fn__chat_textarea').offset().top - $(window).height() + 100 });
					} else {
						$("html, body").animate({ scrollTop: $(document).height() - $(window).height() });
					}

					if (option_select) $('.fn__chat_comment button').removeClass('disabled');

				}, 200);



			}
		},

		shuffleArray: function (array) {
			var currentIndex = array.length, randomIndex;
			while (currentIndex !== 0) {
				randomIndex = Math.floor(Math.random() * currentIndex);
				currentIndex--;
				[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
			}

			return array;
		},

		escapeHTML: function (string) {
			var entityMap = {
				'&': '&amp;',
				'<': '&lt;',
				'>': '&gt;',
				'"': '&quot;',
				"'": '&#39;',
				'/': '&#x2F;',
				'`': '&#x60;',
				'=': '&#x3D;'
			};
			return String(string).replace(/[&<>"'`=\/]/g, function (s) {
				return entityMap[s];
			});
		},

		aiChatBotOptions: function () {
			$('.fn__chat_link').off().on('click', function () {
				var element = $(this);
				if (!element.hasClass('active')) {
					$('.fn__chat_link.active').removeClass('active');
					$('.fn__chatbot .chat__item.active').removeClass('active');
					element.addClass('active');
					$(element.attr('href')).addClass('active');
					TechwaveUserMessageCount = $(element.attr('href')).find('.chat__box').length;
					$('.fn__new_chat_link').removeClass('active');
					$('.fn__chat_comment').removeClass('neww');
					$('.fn__chatbot .fn__title_holder .title').text(element.find('.text').text());
					if ($(element.attr('href')).html() === '') {
						$('.fn__chat_comment').addClass('neww');
					}
				}
				$('#fn__chat_textarea').frenifyMoveCursorToEnd();
				return false;
			});
			$('.fn__new_chat_link').off().on('click', function () {
				var element = $(this);
				if (!element.hasClass('active')) {
					$('.fn__chat_link.active').removeClass('active');
					$('.fn__chatbot .chat__item.active').removeClass('active');
					element.addClass('active');
					$(element.attr('href')).addClass('active');
					TechwaveUserMessageCount = 0;
					$('.fn__chatbot .fn__title_holder .title').text('New Chat');
				}
				$('.fn__chat_comment').addClass('neww');
				$('#fn__chat_textarea').frenifyMoveCursorToEnd();
				return false;
			});
			$('.fn__chat_link input').off().on('click', function (e) {
				e.stopPropagation();
			});
			$('.fn__chat_link .trigger').off().on('click', function () {
				var element = $(this),
					parent = element.closest('.fn__chat_link');
				if (parent.hasClass('opened')) {
					parent.removeClass('opened');
				} else {
					parent.addClass('opened');
				}
				return false;
			});

			$('.fn__chat_link .edit').off().on('click', function () {
				var element = $(this),
					parent = element.closest('.fn__chat_link'),
					input = parent.find('input');
				parent.addClass('live_edit').removeClass('opened');
				TechwaveInputText = input.val();
				setTimeout(function () {
					input.frenifyMoveCursorToEnd();
				}, 100);
				return false;
			});

			$('.fn__chat_link .cancel').off().on('click', function () {
				var e = $(this),
					parent = e.closest('.fn__chat_link'),
					input = parent.find('input');
				parent.removeClass('live_edit');
				input.val(TechwaveInputText);
				return false;
			});

			$('.fn__chat_link .save').off().on('click', function () {
				var e = $(this),
					parent = e.closest('.fn__chat_link'),
					input = parent.find('input');
				// do your ajax here
				parent.removeClass('live_edit');
				TechwaveInputText = input.val();
				parent.find('.text').text(TechwaveInputText);
				return false;
			});

			$(window).on('click', function () {
				$('.fn__chat_link').removeClass('opened');
			});

			$('.fn__chat_link .options__popup').on('click', function (e) {
				e.stopPropagation();
			});
		},

		aiChatBotTextareaHeight: function () {
			$('#fn__chat_textarea').on('mouseup keyup', function () {
				var e = $(this);
				var val = e.val();
				var padding = 34; // top 18 and bottom 16
				var border = 4; // top 2 and bottom 2
				var taLineHeight = 22; // This should match the line-height in the CSS
				var e2 = e.siblings('.fn__hidden_textarea');
				e2.val(val);
				var taHeight2 = e2[0].scrollHeight - padding; // Get the scroll height of the textarea
				var numberOfLines2 = Math.floor(taHeight2 / taLineHeight);
				e.css({ height: numberOfLines2 * taLineHeight + padding + border });
				if (numberOfLines2 > 6) {
					e.css({ overflowY: 'auto' });
				} else {
					e.css({ overflowY: 'hidden' });
				}
			});
			$('#fn__include_textarea').on('mouseup keyup', function () {
				var e = $(this);
				var val = e.val();
				var padding = 34; // top 18 and bottom 16
				var border = 4; // top 2 and bottom 2
				var taLineHeight = 22; // This should match the line-height in the CSS
				var e2 = e.siblings('.fn__hidden_textarea');
				e2.val(val);
				var taHeight2 = e2[0].scrollHeight - padding; // Get the scroll height of the textarea
				var numberOfLines2 = Math.floor(taHeight2 / taLineHeight);
				e.css({ height: numberOfLines2 * taLineHeight + padding + border });
				if (numberOfLines2 > 6) {
					e.css({ overflowY: 'auto' });
				} else {
					e.css({ overflowY: 'hidden' });
				}
			});
			$('#fn__exclude_textarea').on('mouseup keyup', function () {
				var e = $(this);
				var val = e.val();
				var padding = 34; // top 18 and bottom 16
				var border = 4; // top 2 and bottom 2
				var taLineHeight = 22; // This should match the line-height in the CSS
				var e2 = e.siblings('.fn__hidden_textarea');
				e2.val(val);
				var taHeight2 = e2[0].scrollHeight - padding; // Get the scroll height of the textarea
				var numberOfLines2 = Math.floor(taHeight2 / taLineHeight);
				e.css({ height: numberOfLines2 * taLineHeight + padding + border });
				if (numberOfLines2 > 6) {
					e.css({ overflowY: 'auto' });
				} else {
					e.css({ overflowY: 'hidden' });
				}
			});
		},

		billingProgress: function () {
			$('.techwave_fn_user_billing .progress').each(function () {
				var element = $(this);
				element.waypoint({
					handler: function () {
						if (!element.hasClass('active')) {
							setTimeout(function () {
								element.css('--frenify-progress', element.data('percentage'));
								element.addClass('active');
							}, 500);

						}
					},
					offset: '90%'
				});
			});
		},
		addCollectionButtonEvent: function () {
			$("#create_collection_but").click(function () {
				// var element = $(this);
				// var code = (e.keyCode ? e.keyCode : e.which);
				// if (code === 13) {
				// 	var index = $(".techwave_fn_models .fn__tabs a.active").attr("id");
				var index_name = $("#create_collection_index_value").val();
				var collection = $("#create_collection_collection_value").val();
				var chunk = $("#create_collection_chunk_value").val();
				var overlap = $("#create_collection_overlap_value").val();

				if (index_name != "" && collection != "") {
					var sendData = {
						index_name: index_name,
						collection: collection,
						chunk: chunk,
						overlap: overlap,
					};

					$(".techwave_fn_preloader").css("display", "flex");
					var csrfToken = $('input[name="csrfmiddlewaretoken"]').val();

					$.ajax({
						url: '/updateCollection',
						method: 'POST',
						headers: { 'X-CSRFToken': csrfToken },
						data: sendData,
						success: function (result) {
							// if (result.success === "ok") {
							// 	var titleObj = element.closest(".acc__header").find(".acc__title");
							// 	titleObj.html(element.val());
							// 	element.hide(true);
							// 	titleObj.show(true);
							// }
							// else {
							// 	alert("failed to change!");
							// }

							location.reload();
						},
						error: function (xhr, status, error) {
							console.error('Error occurred: ', error);
							alert("Error occurred!");
							location.reload();

						}
					});
				}



			});

			$(".collectionEditBtn").off().on('click', function () {
				var element = $(this);
				var acc_item = element.closest('.acc__item');
				var titleInput = acc_item.find('input[type="text"]');
				acc_item.find(".acc__title").hide();
				titleInput.show(true);
				titleInput.focus();
			});
		},
		addDocumentUploadEvent: function () {
			$("#addCollectionBtn").off().on('click', function () {

				$("#techwave_collection_modal").css("display", "block");
				// var element = $(this);
				// collection reloading
				// var collectionList = $(".techwave_fn_accordion.collection__list");

				// var csrfToken = $('input[name="csrfmiddlewaretoken"]').val();

				// $.ajax({
				// 	url: '/addCollection',
				// 	method: 'POST',
				// 	headers: { 'X-CSRFToken': csrfToken },
				// 	success: function (result) {
				// 		if (result.success === "ok") {
				// 			var data = result.data;
				// 			collectionList.prepend(`
				// 				<div class="acc__item" id="${data.id}">
				// 					<div class="acc__header">
				// 						<h6 class="acc__title">${data.name}</h6>
				// 						<input class="collectionTitleEditor" type="text" id="${data.id}" value="${data.name}" style="display: none;" />
				// 						<div class="acc__icon"></div>
				// 					</div>
				// 					<div class="acc__content">
				// 						<div style="flex-wrap: wrap;">
				// 						<a href="#" class="filter__new disabled techwave_fn_button has__icon small__border collectionEditBtn" style="margin-bottom: 10px; display: inline-block;">				
				// 							<span>Edit</span>
				// 						</a>
				// 						<a href="#" class="filter__new disabled techwave_fn_button has__icon small__border collectionDelBtn" style="margin-bottom: 10px; display: inline-block;">				
				// 								<span>Delete</span>
				// 						</a>
				// 					</div>
				// 						<!-- Upload Shortcode -->
				// 						<label class="fn__upload">
				// 							<a href="#" class="fn__closer fn__icon_button">
				// 								<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 383.3 383.3" style="enable-background:new 0 0 383.3 383.3;" xml:space="preserve" class="fn__svg replaced-svg">
				// 									<g>
				// 										<path d="M15,383.3c-1.1-0.5-2.2-1-3.3-1.4C0.2,377.1-3.6,362.9,4,353.1c1.1-1.5,2.5-2.8,3.8-4.1c51.3-51.3,102.7-102.7,154-154   c1-1,2.4-1.7,3.9-2.7c-1.8-1.9-2.8-3-3.8-4C110.1,136.6,58.5,84.9,6.8,33.3c-5.2-5.2-7.9-11.2-6.3-18.5C3.7,0.7,20.2-4.7,31.1,4.7   c1.2,1.1,2.3,2.2,3.5,3.4C85.7,59.3,136.9,110.4,188,161.6c1.1,1.1,2,2.3,3.2,3.8c1.4-1.3,2.5-2.3,3.5-3.3   C246.4,110.3,298.1,58.7,349.8,7c6-6,12.7-8.6,21-5.8c6.7,2.2,10.2,7.5,12.5,13.9c0,2.5,0,5,0,7.5c-1.8,5.6-5.6,9.8-9.7,13.8   C322.8,87,272.1,137.7,221.3,188.4c-1,1-2,2.1-3.4,3.5c1.4,1.2,2.6,2.1,3.7,3.2c50.5,50.5,101.1,101.1,151.7,151.6   c4.2,4.2,8.1,8.4,10,14.1c0,2.5,0,5,0,7.5c-2.4,7.6-7.4,12.6-15,15c-2.5,0-5,0-7.5,0c-5.6-1.8-9.7-5.7-13.8-9.7   c-50.7-50.8-101.4-101.5-152.1-152.2c-1-1-2.1-2-3.7-3.5c-1.2,1.5-2,2.8-3,3.8C137.5,272.2,86.9,322.9,36.3,373.5   c-4.1,4.1-8.2,7.9-13.8,9.7C20,383.3,17.5,383.3,15,383.3z"></path>
				// 									</g>
				// 								</svg>
				// 							</a>
				// 							<span class="upload_content">
				// 								<span class="title">Drag & Drop a PDF</span>
				// 								<span class="desc">Supports PDF</span>
				// 							</span>											
				// 							<input type="file" accept=".pdf" multiple>
				// 						</label>
				// 						<a href="#" class="filter__new disabled techwave_fn_button has__icon small__border documentUploadBtn" style="margin-top: 10px; display: inline-block;">				
				// 								<span>Upload</span>
				// 						</a>
				// 						<!-- !Upload Shortcode -->
				// 						<div class="metas"  style="display: none;">
				// 							<div class="meta">
				// 								<input class="document_key" type="text" placeholder="Key*" style="margin-top: 10px; display: inline-block; width: 110px; min-width: 100px;"/>
				// 								<input class="document_value" type="text" placeholder="Value*" style="margin-top: 10px;display: inline-block; width: 120px;  min-width: 100px;" />
				// 							</div>
				// 						</div>
				// 					</div>
				// 				</div>`);
				// 			FrenifyTechWave.accordion();
				// 			FrenifyTechWave.addCollectionButtonEvent();
				// 			FrenifyTechWave.addDocumentUploadEvent();
				// 			FrenifyTechWave.inputFileOnChange();
				// 		}
				// 		else console.error("An error occurred...");
				// 	},
				// 	error: function (xhr, status, error) {
				// 		console.error('Error occurred: ', error);
				// 		alert("Error occurred!")
				// 	}
				// });
			});

			$(".documentUploadBtn").off().on('click', function () {
				var element = $(this);
				var acc_item = element.closest('.acc__item');
				var fileInput = acc_item.find('input[type="file"]');
				var index = $(".techwave_fn_models .fn__tabs a.active").attr("name");
				var files = fileInput[0].files;
				var collection = acc_item.attr("id");
				var metas = $(".acc__item.opened .metas .meta");

				var metaData = [];
				metas.each(function (index, element) {
					// Select the input fields within the current meta element
					var key = $(element).find('.document_key').val();
					var value = $(element).find('.document_value').val();
					metaData.push({ key: key, value: value });
				});

				var fileData = new FormData();
				// Add each file to the FormData object
				for (var i = 0; i < files.length; i++) {
					fileData.append('files[]', files[i]);
				}

				fileData.append('index', index);
				fileData.append('collection', collection);
				if (files.length == 1) fileData.append('metas', JSON.stringify(metaData));

				$(".techwave_fn_preloader").css("display", "flex");

				var csrfToken = $('input[name="csrfmiddlewaretoken"]').val();


				$.ajax({
					url: `/uploadDocuments`,
					method: 'POST',
					headers: { 'X-CSRFToken': csrfToken },
					data: fileData,
					processData: false,
					contentType: false,
					success: function (result) {
						if (result.success === "ok") {
							$("#upload_content").empty();
							$("#upload_content").append('<span class="title">Drag & Drop a PDF</span><span class="desc">Supports PDF</span>');
							$(".fn__upload").removeClass("has_file");
							var activeTab = $(".techwave_fn_models .fn__tabs a.active");
							activeTab.removeClass("active");
							activeTab.trigger("click");
						}
						else console.error("An error occurred...");

						$(".techwave_fn_preloader").css("display", "none");

					},
					error: function (xhr, status, error) {
						console.error('Error occurred: ', error);
						alert("Error occurred!");
						$(".techwave_fn_preloader").css("display", "none");
					}
				});


			});

			$(".collectionDelBtn").off().on("click", function () {
				var element = $(this);
				var acc_item = element.closest('.acc__item');
				var csrfToken = $('input[name="csrfmiddlewaretoken"]').val();

				var index = $(".techwave_fn_models .fn__tabs a.active").attr("name");
				var sendData = {
					id: acc_item.attr("id"),
					index: index,
				};

				console.log(sendData);
				$.ajax({
					url: '/deleteCollection',
					method: 'POST',
					headers: { 'X-CSRFToken': csrfToken },
					data: sendData,
					success: function (result) {
						if (result.success === "ok") {
							var activeTab = $(".techwave_fn_models .fn__tabs a.active");
							activeTab.removeClass("active");
							activeTab.trigger("click");
						}
						else console.error("An error occurred...");
					},
					error: function (xhr, status, error) {
						console.error('Error occurred: ', error);
						alert("Error occurred!")
					}
				});
			});

			$(".document_key, .document_value").off().on("keydown", function (e) {

				var code = (e.keyCode ? e.keyCode : e.which);
				if (code === 13) {
					var metasContainer = $(this).closest(".metas");
					var dom = `<div class="meta">
									<input class="document_key" type="text" placeholder="Key*" style="margin-top: 10px; display: inline-block; width: 110px; min-width: 100px;"/>
									<input class="document_value" type="text" placeholder="Value*" style="margin-top: 10px;display: inline-block; width: 120px;  min-width: 100px;" />
								</div>`;

					metasContainer.append(dom);
					FrenifyTechWave.init();
					return false;
				}
			});
		},
		inputFileOnChange: function () {
			$('.fn__upload').on("change", function (event) {
				var element = $(this);
				var files = event.target.files;
				if (files.length > 0) {

					var uploader = element.find(".upload_content");
					uploader.empty();
					var metasObj = element.closest(".acc__item").find(".metas");

					if (files.length == 1) {
						metasObj.show(true);
					}
					else {
						metasObj.hide(true);
					}

					for (var i = 0; i < files.length; i++) {
						uploader.append(`<p>${i + 1}. ${files[i].name}</p>`);
					};

					element.addClass("has_file");

				}
			});
		},

		optionsList: function () {
			$('.fn__options_list a').off().on('click', function () {
				var e = $(this);
				if (e.hasClass('enabled')) {
					e.removeClass('enabled').addClass('disabled');
				} else {
					e.removeClass('disabled').addClass('enabled');
				}

				// do your ajax here
				// ....
				// ....

				return false;
			});
		},

		pricingTab: function () {
			$('.techwave_fn_pricing .toggle_in').each(function () {
				var element = $(this),
					active = element.find('.active');
				var offset = active.offset().left - element.offset().left;
				element.find('.bg').css({ left: offset, width: active.outerWidth(true, true) });
			});
			$('.techwave_fn_pricing .toggle_in a').off().on('click', function () {
				var element = $(this);
				if (!element.hasClass('active')) {
					var parent = element.closest('.toggle_in');
					var pricing = element.closest('.techwave_fn_pricing');
					var offset = element.offset().left - parent.offset().left;
					pricing.find('.pricing__tab.active').removeClass('active');
					$(element.attr('href')).addClass('active');
					element.siblings().removeClass('active');
					element.addClass('active');
					parent.find('.bg').css({ left: offset, width: element.outerWidth(true, true) });
				}
				return false;
			});
		},

		feedFilters: function () {

			// Enable/disable selecting items
			$('.techwave_fn_feed .filter__select input[type="checkbox"]').change(function () {
				var element = $(this);
				var checked = element.is(':checked');
				var feed = element.closest('.techwave_fn_feed');
				var items = feed.find('.fn__gallery_items .item');
				if (checked) {
					items.addClass('select__ready');
					feed.find('.fn__selection_box').slideDown(200);
				} else {
					items.removeClass('select__ready');
					feed.find('.fn__selection_box').slideUp(200);
				}
			});

			// select/deselect items
			$('.fn__selectable_item').off().on('click', function () {
				var element = $(this),
					page = element.closest('.techwave_fn_community_page'),
					items = page.find('.fn__gallery_items .item');
				if (element.hasClass('selected')) {
					element.removeClass('selected');
					TechwaveSelectedCount--;
				} else {
					element.addClass('selected');
					TechwaveSelectedCount++;
				}
				page.find('.fn__selection_box .count').text(TechwaveSelectedCount);
				return false;
			});


			// tab filter
			$('.techwave_fn_feed .fn__tabs a').on('click', function () {
				var element = $(this);
				if (!element.hasClass('active') && !TechwaveFeedFilterLoading) {
					TechwaveFeedFilterLoading = true;
					element.siblings().removeClass('active');
					element.addClass('active');
					var feed = element.closest('.techwave_fn_feed');
					feed.find('.feed__results').addClass('loading');

					// do your ajax here
					// you have to get new feeds with filter (if you want to change also filter) of selected tab via ajax
					// ....
					// ....
					// after ajax ends remove setTimeout (it was added just for HTML)

					setTimeout(function () {
						// here you have to insert your feeds into the filter's content and feed content
						feed.find('.feed__results').removeClass('loading');
						TechwaveFeedFilterLoading = false;
						FrenifyTechWave.galleryIsotope();
					}, 1500);

				}
				return false;
			});

			// Trending&New Filter
			$('.techwave_fn_feed .filter__sorting a').on('click', function () {
				var element = $(this);
				if (!element.hasClass('enabled') && !TechwaveFeedFilterLoading) {
					TechwaveFeedFilterLoading = true;
					element.siblings().removeClass('enabled').addClass('disabled');
					element.removeClass('disabled').addClass('enabled');
					var feed = element.closest('.techwave_fn_feed');
					feed.find('.feed__results').addClass('loading');

					// do your ajax here
					// you have to get new feeds by trending or new (selected) via ajax
					// ....
					// ....
					// after ajax ends remove setTimeout (it was added just for HTML)

					setTimeout(function () {
						// here you have to insert new feeds into the results' content
						feed.find('.feed__results').removeClass('loading');
						TechwaveFeedFilterLoading = false;
					}, 1500);
				}


				return false;
			});


			// Upscaled Filter
			$('.techwave_fn_feed .filter__upscaled input[type="checkbox"]').change(function () {
				var element = $(this);
				var checked = element.is(':checked');
				var feed = element.closest('.techwave_fn_feed');
				feed.find('.feed__results').addClass('loading');


				// do your ajax here
				// you have to get new feeds by checked value via ajax
				// ....
				// ....
				// after ajax ends remove setTimeout (it was added just for HTML)


				setTimeout(function () {
					// here you have to insert new feeds into the results' content
					feed.find('.feed__results').removeClass('loading');
				}, 1500);
			});

			// search filter
			$('.techwave_fn_feed .filter__search a').on('click', function () {
				if (!TechwaveFeedFilterLoading) {
					var feed = $(this).closest('.techwave_fn_feed');
					feed.find('.feed__results').addClass('loading');

					// do your ajax here
					// you have to get new feeds by search word via ajax
					// ....
					// ....
					// after ajax ends remove setTimeout (it was added just for HTML)

					setTimeout(function () {
						// here you have to insert new feeds into the results' content
						feed.find('.feed__results').removeClass('loading');
						TechwaveFeedFilterLoading = false;
					}, 1500);
				}

				return false;
			});

		},

		documentFilters: function () {

			// Enable/disable selecting items
			$('.techwave_fn_models .filter__select input[type="checkbox"]').change(function () {
				var element = $(this);
				var checked = element.is(':checked');
				var documents = element.closest('.techwave_fn_models');
				var items = documents.find('.fn__model_items .fn__model_item .item');
				if (checked) {
					items.addClass('select__ready');
					documents.find('.fn__selection_box').slideDown(200);
				} else {
					items.removeClass('select__ready');
					documents.find('.fn__selection_box').slideUp(200);
				}
			});

			// select/deselect items
			$('.fn__selectable_item').off().on('click', function () {
				var element = $(this),
					page = element.closest('.techwave_fn_models_page'),
					items = page.find('.fn__model_items .fn__model_item .item');
				if (element.hasClass('selected')) {
					element.removeClass('selected');
					TechwaveSelectedCount--;
				} else {
					element.addClass('selected');
					TechwaveSelectedCount++;
				}
				page.find('.fn__selection_box .count').text(TechwaveSelectedCount);
				return false;
			});

			// delete documents
			$(".selection_in a.filter__delete").off().on('click', function () {
				var selectedDocs = $(".tab__item.active").find(".fn__selectable_item.selected");
				var ids = [];

				if (selectedDocs.length === 0) return;

				for (var i = 0; i < selectedDocs.length; i++) {
					ids.push(selectedDocs[i].closest(".item").id);
				}

				var csrfToken = $('input[name="csrfmiddlewaretoken"]').val();

				$.ajax({
					url: '/deleteDocuments',
					method: 'POST',
					headers: { 'X-CSRFToken': csrfToken },
					data: { ids: JSON.stringify(ids) },
					success: function (result) {
						if (result.success === "ok") {
							var checkbox = $('.techwave_fn_models .filter__select input[type="checkbox"]');
							checkbox.prop("checked", false);
							checkbox.trigger("change");
							var activeTab = $(".techwave_fn_models .fn__tabs a.active");
							activeTab.removeClass("active");
							activeTab.trigger("click");
							FrenifyTechWave.documentFilters();
						}
						else console.error("An error occurred...");
					},
					error: function (xhr, status, error) {
						console.error('Error occurred: ', error);
						alert("Error occurred!")
					}
				});
			});
		},

		report: function () {
			var reportbox = $('.techwave_fn_report');
			$('.fn__report').off().on('click', function () {
				var e = $(this),
					id = e.data('id');

				if (reportbox.hasClass('opened')) {
					reportbox.removeClass('opened');
				} else {
					reportbox.addClass('opened');
				}
				return false;
			});


			reportbox.find('.cancel').off().on('click', function () {
				reportbox.removeClass('opened');
				return false;
			});
			reportbox.find('.fn__closer').off().on('click', function () {
				reportbox.removeClass('opened');
				return false;
			});
			reportbox.find('.report__closer').off().on('click', function () {
				reportbox.removeClass('opened');
				return false;
			});
		},

		follow: function () {
			$('.fn__follow').off().on('click', function () {
				var e = $(this),
					text = e.find('.text'),
					id = e.data('id');
				if (e.hasClass('has__follow')) {
					e.removeClass('has__follow');
					text.text(e.data('follow-text'));
				} else {
					e.addClass('has__follow');
					text.text(e.data('unfollow-text'));
				}
				return false;
			});
		},

		copyLink: function () {
			$(".fn__copy").off().on("click", function () {
				var e = $(this);
				var text = e.text();
				var copied = e.data("copied");
				var copy2 = e.attr("data-text");
				var copy = e.attr("href");
				if (typeof copy2 !== 'undefined' && copy2 !== false) {
					copy = copy2;
				}
				var temp = $("<input>");
				$("body").append(temp);
				temp.val(copy).select();
				document.execCommand("copy");
				temp.remove();
				e.text(copied).delay(1000).queue(function (nxt) {
					e.text(text);
					nxt();
				});
				return false;
			});
		},

		galleryIsotope: function () {

			var masonry = $('.fn__gallery_items');
			if ($().isotope) {
				masonry.each(function () {
					$(this).isotope({
						percentPosition: true,
						itemSelector: '.fn__gallery_item',
						masonry: {}
					});
				});
			}
		},

		imageLightbox: function () {
			var body = $('body');
			var scrollY = 0;
			$('.fn__gallery_items .item').off().on('click', function () {
				var element = $(this),
					id = element.data('id');
				if (!element.hasClass('select__ready')) {
					lightbox.scrollTop(0);
					// with this id you can create ajax to call this image into the lightbox
					scrollY = document.documentElement.style.getPropertyValue('--techwave-scroll-y');
					body.css({ position: 'fixed', top: scrollY });

					body.addClass('fn__lightbox_mode');
					lightbox.addClass('opened');
				}



				return false;
			});
			var lightbox = $('.techwave_fn_img_lightbox');

			lightbox.find('.fn__closer').off().on('click', function () {
				body.removeClass('fn__lightbox_mode');
				lightbox.removeClass('opened');
				body.css({ position: 'relative', top: '' });
				setTimeout(function () {
					window.scrollTo({ top: 300, left: 0, behavior: "instant" });
					FrenifyTechWave.galleryIsotope();
				}, 1);
			});
		},

		bookmark: function () {
			$('.fn__bookmark').off().on('click', function () {
				var e = $(this);
				if (e.hasClass('has__bookmark')) {
					e.removeClass('has__bookmark');
				} else {
					e.addClass('has__bookmark');
				}
				// do your ajax here
				return false;
			});
		},

		like: function () {
			$('.fn__like').off().on('click', function () {
				var e = $(this),
					countbox = e.find('.count'),
					id = e.data('id');
				if (e.hasClass('has__like')) {
					e.removeClass('has__like');
					countbox.text(parseInt(countbox.text()) - 1);
				} else {
					e.addClass('has__like');
					countbox.text(parseInt(countbox.text()) + 1);
				}
				// do your ajax here
				return false;
			});
		},

		accordion: function () {
			$('.techwave_fn_accordion').each(function () {
				$(this).find('.opened .acc__content').slideDown(300);
			});
			$('.techwave_fn_accordion .acc__header').off().on('click', function () {
				var element = $(this),
					parent = element.closest('.acc__item'),
					accordion = element.closest('.techwave_fn_accordion'),
					content = parent.find('.acc__content'),
					type = accordion.data('type');
				if (parent.hasClass('opened')) {
					parent.removeClass('opened');
					content.slideUp(300);
				} else {
					if (type === 'accordion') {
						accordion.find('.acc__item').removeClass('opened');
						accordion.find('.acc__content').slideUp(300);
					}
					parent.addClass('opened');
					content.slideDown(300);
				}
			});
		},

		search: function () {
			var searchBar = $('.techwave_fn_searchbar');
			var input = searchBar.find('.search__input');
			var resultsBar = searchBar.find('.search__results');
			var searchOpener = $('.fn__nav_bar .bar__item_search .item_opener');

			// open searchbar
			searchOpener.on('click', function () {
				searchBar.addClass('opened');
				setTimeout(function () {
					input[0].focus();
				}, 100);

				return false;
			});

			// close searchbar
			searchBar.find('.search__closer').on('click', function () {
				input.val('');
				resultsBar.removeClass('opened');
				searchBar.removeClass('opened');
				return false;
			});


			// search something
			var timeout = null;
			input.on('keyup', function () {
				var field = $(this);
				var text = field.val();

				clearTimeout(timeout);

				timeout = setTimeout(function () {
					if (text === '') {
						resultsBar.removeClass('opened');
					} else {
						resultsBar.addClass('opened');
						// add your ajax code here
					}
				}, 700);
			});
		},

		animatedText: function () {
			$('.fn__animated_text').each(function () {
				var element = $(this);
				var text = element.text();
				var letters = text.split('');
				var time = element.data('wait');
				if (!time) { time = 0; }
				var speed = element.data('speed');
				if (!speed) { speed = 4; }
				speed = speed / 100;
				element.html('<em>321...</em>').addClass('ready');

				element.waypoint({
					handler: function () {
						if (!element.hasClass('stop')) {
							element.addClass('stop');
							setTimeout(function () {
								element.text('');
								$.each(letters, function (e, i) {
									var span = document.createElement("span");
									span.textContent = i;
									span.style.animationDelay = e * speed + 's';
									element.append(span);
								});
							}, time);
						}
					},
					offset: '90%'
				});

			});
		},

		movingSubMenuForLeftPanel: function () {
			var fixedsub = $('.techwave_fn_fixedsub');
			var li = $('.techwave_fn_leftpanel .group__list > li');
			var rightpart = $('.techwave_fn_content');



			li.on('mouseenter', function () {
				var parentLi = $(this);
				var subMenu = parentLi.children('ul.sub-menu');
				var subMenuHtml = subMenu.html();
				//parentLi;
				if (subMenu.length) {
					li.removeClass('hovered');
					parentLi.addClass('hovered').parent().addClass('hovered');
					fixedsub.removeClass('opened').children('ul').html('').html(subMenuHtml);
					fixedsub.addClass('opened');
				} else {
					li.removeClass('hovered');
					fixedsub.removeClass('opened');
					parentLi.removeClass('hovered').parent().removeClass('hovered');
				}
				var topOffSet = parentLi.offset().top;
				var menuBar = $('.techwave_fn_leftpanel .leftpanel_content');
				var menuBarOffSet = menuBar.offset().top;
				var asd = topOffSet - menuBarOffSet;

				fixedsub.css({ top: asd });
				abc();
			});
			function abc() {
				rightpart.on('mouseenter', function () {
					fixedsub.removeClass('opened');
					li.removeClass('hovered').parent().removeClass('hovered');
				});
			}
			abc();
		},

		panelResize: function () {
			var wrapper = $('html');
			$('.techwave_fn_leftpanel .desktop_closer').off().on('click', function () {
				if (wrapper.hasClass('panel-opened')) {
					wrapper.removeClass('panel-opened');
					localStorage.frenify_panel = '';
				} else {
					wrapper.addClass('panel-opened');
					localStorage.frenify_panel = 'panel-opened';
				}
				return false;
			});
			$('.techwave_fn_leftpanel .mobile_closer').off().on('click', function () {
				if (wrapper.hasClass('mobile-panel-opened')) {
					wrapper.removeClass('mobile-panel-opened');
				} else {
					wrapper.addClass('mobile-panel-opened');
				}
				return false;
			});
		},

		navBarItems: function () {

			// user details
			var userItem = $('.fn__nav_bar .bar__item_user');
			userItem.find('.user_opener').on('click', function (e) {
				e.stopPropagation();
				if (userItem.hasClass('opened')) {
					userItem.removeClass('opened');
				} else {
					userItem.addClass('opened');
				}
				// close lightboxes
				$('.bar__item_language,.bar__item_notification').removeClass('opened');
				return false;
			});

			userItem.on('click', function (e) {
				e.stopPropagation();
			});

			$(window).on('click', function () {
				userItem.removeClass('opened');
			});

			// light and dark mode
			var darklightSwitcher = $('.fn__nav_bar .bar__item_skin .item_opener');
			darklightSwitcher.off().on('click', function () {
				if ($('html').attr('data-techwave-skin') === 'light') {
					$('html').attr('data-techwave-skin', 'dark');
					localStorage.frenify_skin = 'dark';
				} else {
					$('html').attr('data-techwave-skin', 'light');
					localStorage.frenify_skin = 'light';
				}

				// close lightboxes
				$('.bar__item_user,.bar__item_language,.bar__item_notification').removeClass('opened');
				return false;
			});

			// language
			var languageItem = $('.fn__nav_bar .bar__item_language');
			languageItem.find('.item_opener').on('click', function (e) {
				e.stopPropagation();
				if (languageItem.hasClass('opened')) {
					languageItem.removeClass('opened');
				} else {
					languageItem.addClass('opened');
				}
				// close lightboxes
				$('.bar__item_user,.bar__item_notification').removeClass('opened');
				return false;
			});

			languageItem.on('click', function (e) {
				e.stopPropagation();
			});

			$(window).on('click', function () {
				languageItem.removeClass('opened');
			});

			// notifications
			var notificationItem = $('.fn__nav_bar .bar__item_notification');
			notificationItem.find('.item_opener').on('click', function (e) {
				e.stopPropagation();
				if (notificationItem.hasClass('opened')) {
					notificationItem.removeClass('opened');
				} else {
					notificationItem.addClass('opened');
				}
				// close lightboxes
				$('.bar__item_user,.bar__item_language').removeClass('opened');
				return false;
			});

			notificationItem.on('click', function (e) {
				e.stopPropagation();
			});

			$(window).on('click', function () {
				notificationItem.removeClass('opened');
			});
		},

		redetectFullScreen: function () {
			var fbtn = $('.fn__nav_bar .bar__item_fullscreen a');
			if (window.innerHeight === screen.height) {
				fbtn.addClass('full_screen');
			} else {
				fbtn.removeClass('full_screen');
			}
		},

		fullSCreen: function () {
			var fbtn = $('.fn__nav_bar .bar__item_fullscreen a');

			fbtn.off().on('click', function () {
				if (fbtn.hasClass('full_screen')) {
					fbtn.removeClass('full_screen');
					if (document.exitFullscreen) {
						document.exitFullscreen();
					} else if (document.msExitFullscreen) {
						document.msExitFullscreen();
					} else if (document.mozCancelFullScreen) {
						document.mozCancelFullScreen();
					} else if (document.webkitExitFullscreen) {
						document.webkitExitFullscreen();
					}
				} else {
					fbtn.addClass('full_screen');
					if (document.documentElement.requestFullscreen) {
						document.documentElement.requestFullscreen();
					} else if (document.documentElement.msRequestFullscreen) {
						document.documentElement.msRequestFullscreen();
					} else if (document.documentElement.mozRequestFullScreen) {
						document.documentElement.mozRequestFullScreen();
					} else if (document.documentElement.webkitRequestFullscreen) {
						document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
					}
				}
				return false;
			});
		},

		navSubMenu: function () {
			$('.techwave_fn_leftpanel .menu-item-has-children > a').off().on('click', function () {
				var e = $(this),
					li = e.closest('li');
				if (li.hasClass('closed')) {
					li.removeClass('closed');
					li.children('ul').slideDown(200);
				} else {
					li.addClass('closed');
					li.children('ul').slideUp(200);
				}
				return false;
			});
		},

		// preloader: function () {
		// 	var preloader = $('.techwave_fn_preloader');

		// 	var date2 = new Date();
		// 	var difference = date2 - FrenifyTechWaveTime;
		// 	var waitTime = 4000;
		// 	if (difference < waitTime) {
		// 		waitTime -= difference;
		// 	} else {
		// 		waitTime = 0;
		// 	}
		// 	if (!preloader.hasClass('wait_for_full_preloading_animation')) {
		// 		waitTime = 0;
		// 	}
		// 	setTimeout(function () {
		// 		preloader.addClass('fn_ready');
		// 	}, waitTime);
		// 	setTimeout(function () {
		// 		preloader.remove();
		// 	}, waitTime + 2000);
		// },

		imgToSVG: function () {
			$('img.fn__svg').each(function () {
				var img = $(this);
				var imgClass = img.attr('class');
				var imgURL = img.attr('src');

				$.get(imgURL, function (data) {
					var svg = $(data).find('svg');
					if (typeof imgClass !== 'undefined') {
						svg = svg.attr('class', imgClass + ' replaced-svg');
					}
					img.replaceWith(svg);

				}, 'xml');

			});
		},

		BgImg: function () {
			var div = $('*[data-bg-img]');
			div.each(function () {
				var element = $(this);
				var attrBg = element.attr('data-bg-img');
				var dataBg = element.data('bg-img');
				if (typeof (attrBg) !== 'undefined') {
					element.css({ backgroundImage: 'url(' + dataBg + ')' });
				}
			});
		},

		chatConfig: function () {
			// Index Id
			$("#indexSelect").on("change", function (e) {
				FrenifyTechWave.indexValue = $(this).val();
				console.log(FrenifyTechWave.indexValue);
				if (FrenifyTechWave.indexValue == "") return;
				var csrfToken = $('input[name="csrfmiddlewaretoken"]').val();
				var sendData = {
					id: FrenifyTechWave.indexValue,
				};

				$.ajax({
					url: '/getCollectionList',
					method: 'POST',
					headers: { 'X-CSRFToken': csrfToken },
					data: sendData,
					success: function (result) {
						if (result.success === "ok") {
							var select = $('#collectionSelect');

							// Clear any existing options
							select.empty();

							// Add options based on the JSON data
							if (result.show_collection_select) {
								select.append($('<option selected disabled></option>').attr('value', "").text("Select a Collection"));
								$.each(result.data, function (index, option) {
									select.append($('<option></option>').attr('value', option.name).text(option.name));
								});
							}
							else {
								$.each(result.data, function (index, option) {
									select.append($('<option></option>').attr('value', option.name).text(option.name));
								});


							}

							FrenifyTechWave.collectionValue = "";
						}

						else console.error("An error occurred...");
					},
					error: function (xhr, status, error) {
						console.error('Error occurred: ', error);
						alert("Error occurred!")
					}
				});
			});

			// collection Id
			$("#collectionSelect").on("change", function (e) {
				FrenifyTechWave.collectionValue = $(this).val();
			});

			// model Id
			$("#modelSelect").on("change", function (e) {
				FrenifyTechWave.modelValue = $(this).val();
			});

			// temp Value
			$('#tempInput').on('change', function () {
				FrenifyTechWave.tempValue = $(this).val();
			});

			// Number of Vector Value
			$('#novInput').change(function () {
				FrenifyTechWave.nov = $(this).val();
			});

			// -, + operation
			$(".fn__quantity .decrease").on("click", function (e) {
				FrenifyTechWave.nov = $("#novInput").val();
			});

			$(".fn__quantity .increase").on("click", function (e) {
				FrenifyTechWave.nov = $("#novInput").val();
			});

			// prompt Id
			$("#promptSelect").on("change", function (e) {
				FrenifyTechWave.promptValue = $(this).val();
				var selectedOption = $(this).find(`option[value="${FrenifyTechWave.promptValue}"]`);
				$("#propmt_preview").text(selectedOption.attr("content"));
			});

			// flag Value
			$('#show_switcher').change(function () {

				FrenifyTechWave.showFlag = $(this).is(':checked');
				if (FrenifyTechWave.showFlag) $("#propmt_preview").show(true);
				else $("#propmt_preview").hide(true);
			});
		}

	};


	// READY Functions
	$(document).ready(function () {
		FrenifyTechWave.init();
		$(':root').css('--techwave-scroll-y', (window.scrollY * (-1)) + 'px');
		setTimeout(function () {
			FrenifyTechWave.galleryIsotope();
		}, 500);
	});




	// RESIZE Functions
	$(window).on('resize', function () {
		FrenifyTechWave.popupMobile();
		FrenifyTechWave.redetectFullScreen();
		FrenifyTechWave.galleryIsotope();
	});

	//	$(window).load( function(){
	//		FrenifyTechWave.preloader();
	//		FrenifyTechWave.galleryIsotope();
	//		setTimeout(function(){
	//			FrenifyTechWave.galleryIsotope();
	//		},1000);
	//	});

	// LOAD Functions
	$(window).on('load', function () {
		FrenifyTechWave.preloader();
		FrenifyTechWave.galleryIsotope();
		setTimeout(function () {
			FrenifyTechWave.galleryIsotope();
		}, 1000);
	});

	$(window).on('scroll', function () {
		$(':root').css('--techwave-scroll-y', (window.scrollY * (-1)) + 'px');
	});

})(jQuery);


