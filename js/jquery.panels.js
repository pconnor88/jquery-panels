;(function ( $, window, document, undefined ) {

    // Default settings
    var pluginName = "panels",
        defaults = {
			panel: '',
			animation: 'fade',
            speed: 2000,
			wait: 6000,
			start: 0,
			resumeOnClick: true,
			autoScroll: true,
			infinite: false,
			panelsPerScreen: 1,
			panelsToMove: 1,
			vertical: false,
			responsive: false,	
			showArrows: false,
			hideArrowsAtEnd: false,
			leftArrowClass: 'arrowLeft',
			leftArrowImage: '',
			rightArrowClass: 'arrowRight',
			rightArrowImage: '',
			showMarkers: false,
			markerHolderClass: '',
			markerClass: '',
			markerPosition: 'sw',
			showMarkerNumbers: false,
			onSetupComplete: function(element, slide) { },
			onSlideChange: function(element, slide) { }
        };

    // Constructor
    function Panels( element, options ) {
        
		this.element = element;

        this.options = $.extend( {}, defaults, options );
			
        this._defaults = defaults;
        this._name = pluginName;
		
		this.elements = $(this.element).find(this.options.panel).size();
			
		///Recalculate number of elements based on perScreen and step settings
		
		
		var elementsTemp = 0;
		for(var i=0; i<this.elements; i+= this.options.panelsToMove) {
			if((i + this.options.panelsPerScreen) < this.elements) {
				elementsTemp++;
			}
		}
		
		//if((this.elements % this.options.panelsPerScreen) != 0) {
			elementsTemp++;
		//}
		
		this.moveElements = elementsTemp;
		
		if(this.options.infinite) {
			this.moveElements = this.elements;	
		}
		
		this.panelWidth = $(this.element).find(this.options.panel).outerWidth(true);
		this.panelHeight = $(this.element).find(this.options.panel).outerHeight(true);
		
		this.sizeRatio = this.panelHeight/this.panelWidth;
		
		//Add event listener to resize on window resize
		if(this.options.responsive) {
			$(this.element).width("100%");
			this.resize();
			var panel = this;
			
			$(window).resize(function(e) {
				panel.resize();
            });
		}
		
		this.currentPosition = this.options.start;
		this.timerval = null;
        this.init();
		
    }

    Panels.prototype = {

        init: function() {
				
			var plugin = this;
			
			if((this.currentPosition >= this.elements) || (this.currentPosition < 0)) {
				this.currentPosition = 0;	
			}
			
			$(this.element).css({
				"position": "relative"
			});
			
			switch(this.options.animation)
			{
				case "slide":				
					
					//Insert the mask element
					if(this.options.vertical) {
						
						$(this.element).children(this.options.panel).wrapAll("<div class=\"mask\" style=\"position:relative; overflow:hidden; width: " + this.panelWidth + "px; height: " + (this.panelHeight * this.options.panelsPerScreen) + "px;\"><div class=\"scroller\" style=\"position:absolute; zoom:1; width: " + this.panelWidth + "px; height: " + ((this.panelHeight*this.elements)+20) + "px;\"></div></div>");
						$(this.element).find(".scroller").css("top", (this.panelHeight*this.currentPosition*-1) + "px");
						$(this.element).find(this.options.panel).css({
							position: 'relative'
						});
						$(this.element).css({
							"height": (this.panelHeight * this.options.panelsPerScreen),
							"width": this.panelWidth
						});
					} else {
						$(this.element).children(this.options.panel).wrapAll("<div class=\"mask\" style=\"position:relative; overflow:hidden; width: " + (this.panelWidth * this.options.panelsPerScreen) + "px; height: " + this.panelHeight + "px;\"><div class=\"scroller\" style=\"position:absolute; zoom:1; width: " + ((this.panelWidth*this.elements)+20) + "px; height: " + this.panelHeight + "px;\"></div></div>");
						$(this.element).find(".scroller").css("left", (this.panelWidth*this.currentPosition*-1) + "px");
						$(this.element).find(this.options.panel).css({
							position: 'relative',
							float: 'left'
						});
						$(this.element).css({
							"width": (this.panelWidth * this.options.panelsPerScreen),
							"height": this.panelHeight
						});
					}
					
					//If infinite then we need to make a custom slider..
					if(this.options.infinite) {
						$(this.element).find(this.options.panel).addClass("hidden").hide();
						//Create the container, which is what will be sliding.
						$(this.element).find(this.options.panel).eq(this.currentPosition).clone().width("100%").insertBefore($(this.element).find(this.options.panel + ":first")).removeClass("hidden").addClass("infinite").empty().show();
						
						//Load the slider with all the elements needed.
												
						for(var s = 0; s < this.options.panelsPerScreen; s++) {
						
							var sc = this.options.start + s;
						
							if(sc >= this.elements) {
								sc = sc % this.elements;	
							}
						
							$(this.element).find(".scroller").children(this.options.panel + ":not(.infinite)").eq(sc).clone().removeClass("hidden").show().appendTo($(this.element).find(".infinite"));
							
						}
						
						$(this.element).find(".scroller").css("left", "0px");
						
						
						
					}
									
					
					break;
				
				default:
					
					$(this.element).css({
						"width": this.panelWidth,
						"height": this.panelHeight
					}).children(this.options.panel).css({
						"position": "absolute",
						"top": "0px",
						"left": "0px"
					}).not(":eq(" + this.currentPosition + ")").hide();	
					
			}
			
			
			
			
			
			if(this.options.showArrows) {
				
				// Only add arrows if there is more than 1 slide
				if(this.moveElements > 1) {
			
					// Inject the arrows
					var arrowHTMLImageLeft = "";
					var arrowHTMLImageRight = "";
					
					if (this.options.leftArrowImage.length > 0) { arrowHTMLImageLeft = "<img src=\"" + this.options.leftArrowImage + "\" alt=\"Previous slide\" />" }
					if (this.options.rightArrowImage.length > 0) { arrowHTMLImageRight = "<img src=\"" + this.options.rightArrowImage + "\" alt=\"Next slide\" />" }
					
					var arrowHTML = "<a class=\"pnl-arrow-left " + this.options.leftArrowClass + "\" href=\"#\">" + arrowHTMLImageLeft + "</a><a class=\"pnl-arrow-right " + this.options.rightArrowClass + "\" href=\"#\">" + arrowHTMLImageRight + "</a>";
					$(this.element).append(arrowHTML);
					
					//Setup listeners
					$(this.element).children(".pnl-arrow-left").click(function() {
						plugin.currentPosition = plugin.movePanel(plugin.element, plugin.options, -1, true, -1);
						return false;
					});
					
					$(this.element).children(".pnl-arrow-right").click(function() {
						plugin.currentPosition = plugin.movePanel(plugin.element, plugin.options, 1, true, -1);
						return false;
					});
					
					if((this.options.hideArrowsAtEnd) && (!this.options.infinite)) {
																										
						//Hide the arrow if at the start
						if(this.currentPosition == 0) {
							$(this.element).children(".pnl-arrow-left").hide();
						} else {
							$(this.element).children(".pnl-arrow-left").show();
						}
						
						//Hide the arrow if at the end
						if(this.currentPosition == (this.moveElements -1)) {
							$(this.element).children(".pnl-arrow-right").hide();
						} else {
							$(this.element).children(".pnl-arrow-right").show();
						}
						
					}
					
				}
			}
			
			if(this.options.showMarkers) {
					
					if (this.moveElements > 1) {
		
						var ButtonHTML = "<ul class=\"pnl-markers" + this.options.markerHolderClass + "\" style=\"padding:0px; list-style:none;\">";
						
						for(i = 0; i < this.moveElements; i++) {
							ButtonHTML += "<li style=\"float:left\"><a href=\"#\" class=\"" + this.options.markerClass + "\">";
							
							if(this.options.showMarkerNumbers) {
								ButtonHTML += (i+1);
							}
							
							ButtonHTML += "</a></li>";
						}
						
						ButtonHTML += "</ul>";
														
						$(this.element).append(ButtonHTML);
						
						var bulletWidth = $(this.element).children(".pnl-markers").children("li").outerWidth(true);
						var bulletHeight = $(this.element).children(".pnl-markers").children("li").outerHeight(true);
												
						switch(this.options.markerPosition)
						{
							case "n":
								$(this.element).children(".pnl-markers").css({
									"position": "absolute",
									"top": "0px",
									"left": "50%",
									"marginLeft": ((bulletWidth * this.moveElements)/2) * -1
								});
								break;
								
							case "ne":
								$(this.element).children(".pnl-markers").css({
									"position": "absolute",
									"top": "0px",
									"right": "0px"
								});
								break;
								
							case "e":
								$(this.element).children(".pnl-markers").css({
									"position": "absolute",
									"right": "0px",
									"top": "50%",
									"marginTop": (bulletHeight/2) * -1
								});
								break;
								
							case "se":
								$(this.element).children(".pnl-markers").css({
									"position": "absolute",
									"bottom": "0px",
									"right": "0px"
								});
								break;
								
							case "s":
								$(this.element).children(".pnl-markers").css({
									"position": "absolute",
									"bottom": "0px",
									"left": "50%",
									"marginLeft": ((bulletWidth * this.moveElements)/2) * -1
								});
								break;
								
							case "w":
								$(this.element).children(".pnl-markers").css({
									"position": "absolute",
									"left": "0px",
									"top": "50%",
									"marginTop": (bulletHeight/2) * -1
								});
								break;
								
							case "nw":
								$(this.element).children(".pnl-markers").css({
									"position": "absolute",
									"top": "0px",
									"left": "0px"
								});
								break;
							
							default:
								$(this.element).children(".pnl-markers").css({
									"position": "absolute",
									"bottom": "0px",
									"left": "0px"
								});
								
						} 
						
						this.options.markerHolderClass = "." + this.options.markerHolderClass;
						$(this.element).children(".pnl-markers").children("li:eq(" + this.currentPosition + ")").addClass("active");
						
						var plugin = this;
						
						//Setup listeners
						$(this.element).children(".pnl-markers").children("li").children("a").click(function() {
							
							var listing = $(this).parent("li");	
							var newIndex = $(plugin.element).children(".pnl-markers").children("li").index(listing);
							
							var moveDirection = 1;
							
							if(newIndex < plugin.currentPosition) 
							{
								moveDirection = -1;
							}
														
							plugin.currentPosition = plugin.movePanel(plugin.element, plugin.options, moveDirection, true, newIndex);
							return false;
							
						});
					}
			}
			
						
			//Setup swipe gestures for mobile devices
			var touchStartX, touchStartY, touchEndX, touchEndY, touchDiff;
			
			if (this.element.addEventListener) { 
			
				this.element.addEventListener('touchstart', function (e) {
					
					touchStartX = e.changedTouches[0].pageX;
					touchStartY = e.changedTouches[0].pageY;
				}, false);
				
				this.element.addEventListener("touchmove", function (e) {
					
					touchEndX = e.changedTouches[0].pageX;
					touchEndY = e.changedTouches[0].pageY;
					
					if(Math.abs(touchEndX - touchStartX) > Math.abs(touchEndY - touchStartY)) {
						e.preventDefault();	
					}
					
				},false);
				
				this.element.addEventListener("touchend", function (e) {
					
					if(Math.abs(touchStartX - touchEndX) > Math.abs(touchStartY - touchEndY)) {
																			
						if((touchStartX - touchEndX) > 0) {
							plugin.currentPosition = plugin.movePanel(plugin.element, plugin.options, 1, true, -1);
						} else {
							plugin.currentPosition = plugin.movePanel(plugin.element, plugin.options, -1, true, -1);
						}
						
					}
	
				}, false);
				
			}
			
			// Setting up timers	
			if(this.options.autoScroll) {
						
				this.timerval = setInterval(function() { 
					plugin.currentPosition = plugin.movePanel(plugin.element, plugin.options, 1, false, -1);
				}, this.options.wait);
				
			}
			
			//Completed setup, call the complete funciton..
			this.options.onSetupComplete(this,$(this.element).find(this.options.panel + ":eq(" + this.currentPosition + ")"));
			
        },

        movePanel: function(el, options, direction, userClick, setNextSlide) {
            			
			// Set the slide to be displayed
			var nextSlide = this.currentPosition;
			
			if((userClick) || ((!$(el).children(options.panel + ":eq(" + nextSlide + ")").is(":animated")) && (options.animation == "fade")) || ((!$(el).find(".scroller").is(":animated")) && (options.animation == "slide"))) {
			
				if(userClick) {
					clearInterval(this.timerval);	
				}
																							
				if(options.autoScroll || userClick) {
					
					nextSlide += (direction * this.options.panelsToMove);
					var panelsToMoveThisTime = this.options.panelsToMove;
									
					if(setNextSlide > -1) {
						nextSlide = setNextSlide;
						panelsToMoveThisTime = Math.abs(nextSlide - this.currentPosition);
					}
										
					// Check to make sure the next panel isnt out of range..
					if(nextSlide < 0) {
						nextSlide = nextSlide % this.moveElements;
						nextSlide = this.moveElements + nextSlide;
					}
					
					if(nextSlide >= this.moveElements) {
						nextSlide = nextSlide % this.moveElements;
					}
					
										
					//Only show some animation if trying to access a different slide
					if(nextSlide != this.currentPosition) {
																	
						//Switch through the animation types and do the necessary animation
						switch(options.animation)
						{
							case "slide":
								
								
								//If Infinite scroll, handle the move function completely differently..
								if(options.infinite) {
							
									if(direction == 1) {
																				
										//Add the number of nodes we are moving after the current slide
										
										for(var s = 0; s < panelsToMoveThisTime; s++) {
											
											var sc = this.currentPosition + this.options.panelsPerScreen + s;
																															
											if(sc >= this.elements) {
												sc = sc % this.elements;	
											}
																					
											$(this.element).find(".scroller").children(this.options.panel + ":not(.infinite)").eq(sc).clone().removeClass("hidden").show().appendTo($(this.element).find(".infinite"));
											
										}
																				
										//$(el).find(options.panel + ".hidden:eq(" + nextSlide + ")").clone().insertAfter($(el).find(options.panel + ".infinite")).removeClass("hidden").show();	
										
										if(options.vertical) {
											$(el).find(".scroller").animate({
												top: (this.panelHeight  * panelsToMoveThisTime) * -1
											}, function() {
												$(el).find(options.panel + ".infinite").children(options.panel + ":lt(" + panelsToMoveThisTime + ")").remove();
												$(this).css({top:0});
											});
										} else {
											$(el).find(".scroller").animate({
												left: (this.panelWidth * panelsToMoveThisTime) * -1
											},function() {
												$(el).find(options.panel + ".infinite").children(options.panel + ":lt(" + panelsToMoveThisTime + ")").remove();
												$(this).css({left:0});
											});
										}
																
									} else {
										
										//Add a node before the current slide
										
										//Add the number of nodes we are moving after the current slide
										
										var sc = this.currentPosition
										
										for(var s = 0; s < panelsToMoveThisTime; s++) {
											
											sc--;
																				
											if(sc < 0) {
												sc = this.elements-1;	
											}
																					
											$(this.element).find(".scroller").children(this.options.panel + ":not(.infinite)").eq(sc).clone().removeClass("hidden").show().prependTo($(this.element).find(".infinite"));
											
										}
										
																				
										//$(el).find(options.panel + ".hidden:eq(" + nextSlide + ")").clone().insertBefore($(el).find(options.panel + ".infinite")).removeClass("hidden").show();	
										
										if(options.vertical) {
											
											$(el).find(".scroller").css({top:(this.panelHeight  * panelsToMoveThisTime) * -1}).animate({
												top: 0
											}, function() {
												var sl = $(el).find(options.panel + ".infinite").children().size();
												$(el).find(options.panel + ".infinite").children(options.panel + ":gt(" + (sl-panelsToMoveThisTime -1)  + ")").remove();
											});
											
										} else {
											
											$(el).find(".scroller").css({left:(this.panelWidth  * panelsToMoveThisTime) * -1}).animate({
												left: 0
											}, function() {
												var sl = $(el).find(options.panel + ".infinite").children().size();
												$(el).find(options.panel + ".infinite").children(options.panel + ":gt(" + (sl-panelsToMoveThisTime -1)  + ")").remove();
											});
											
											
											
										}
										
									}
																						
								} else {
								
									//Normal Scroll..
									var scrollToSlide = nextSlide;
									if(((scrollToSlide * this.options.panelsToMove) + this.options.panelsPerScreen) >= (this.elements)) {
																				
										if(options.vertical) {
											$(el).find(".scroller").animate({
												top: ((this.elements - this.options.panelsPerScreen) * this.panelHeight) * -1
											});
										} else {
											$(el).find(".scroller").animate({
												left: ((this.elements - this.options.panelsPerScreen) * this.panelWidth) * -1
											});
										}
										 
									} else {
										if(options.vertical) {
											$(el).find(".scroller").animate({
												top: (scrollToSlide * (this.panelHeight * this.options.panelsToMove)) * -1
											});
										} else {
											$(el).find(".scroller").animate({
												left: (scrollToSlide * (this.panelWidth * this.options.panelsToMove)) * -1
											});
										}
									}
									
								}
								
								
								break;
							
							default:
								
								// Fade by default
								$(el).children(options.panel + ":eq(" + this.currentPosition + ")").fadeOut(options.speed);
								$(el).children(options.panel + ":eq(" + nextSlide + ")").fadeIn(options.speed);	
							
						}
						
						
						//UPDATE THE CURRENT POSITION TO BE THE NEW POSITION
						this.currentPosition = nextSlide;
						
						if((options.showArrows) && (options.hideArrowsAtEnd)) {
																									
							//Hide the arrow if at the start
							if(this.currentPosition == 0) {
								$(this.element).children(".pnl-arrow-left").hide();
							} else {
								$(this.element).children(".pnl-arrow-left").show();
							}
							
							//Hide the arrow if at the end
							if(this.currentPosition == (this.moveElements -1)) {
								$(this.element).children(".pnl-arrow-right").hide();
							} else {
								$(this.element).children(".pnl-arrow-right").show();
							}
							
						}
							
						
												
						// Update the active marker if markers are shown.
						if(options.showMarkers) {
							$(el).children(".pnl-markers").children("li").removeClass("active");
							$(el).children(".pnl-markers").children("li:eq(" + nextSlide + ")").addClass("active");					
						}
												
					}
					
					//Setup timers again if permission to do so
					if(userClick && options.resumeOnClick) {
						
						this.options.autoScroll = true;
						var plugin = this;
						
						this.timerval = setInterval(function() { 
							plugin.currentPosition = plugin.movePanel(el, options, 1, false, -1);
						}, options.wait);
					}
					
				}
				
				
				if(options.infinite) 
				{
					if(direction == 1) {
						options.onSlideChange(this, $(el).find(options.panel + ".infinite").children(options.panel + ":eq(" + options.panelsToMove + ")"));	
					} else {
						options.onSlideChange(this, $(el).find(options.panel + ".infinite").children(options.panel + ":eq(0)"));	
					}
				} 
				else 
				{
					options.onSlideChange(this, $(el).find(options.panel + ":eq(" + this.currentPosition + ")"));
				}
				
			}
			

			return nextSlide;
			
        },
		
		resize: function() {
			
			this.panelWidth = $(this.element).width();
			this.panelHeight = this.panelWidth * this.sizeRatio;
			$(this.element).find(this.options.panel).width(this.panelWidth).height(this.panelHeight);
			
			$(this.element).find(".mask").width(this.panelWidth).height(this.panelHeight);		
			$(this.element).find(".scroller").width((this.panelWidth*this.elements)+20).height(this.panelHeight);	
			
		},
		
		pause: function() {
		
			this.options.autoScroll = false;
		
		},
		
		play: function() {
			
			var plugin = this;
			
			this.options.autoScroll = true;
			
			if(this.timerval == null) {

				this.timerval = setInterval(function() { 
					plugin.currentPosition = plugin.movePanel(plugin.element, plugin.options, 1, false, -1);
				}, plugin.options.wait);
			}
				
		},
		
		next: function() {
		
			var plugin = this;
		
			plugin.currentPosition = plugin.movePanel(plugin.element, plugin.options, 1, true, -1);
			
		},
		
		previous: function() {
			
			var plugin = this;
			
			plugin.currentPosition = plugin.movePanel(plugin.element, plugin.options, -1, true, -1);
						
		},
		
		destroy: function() {
			
			var plugin = this;
			clearInterval(plugin.timerval);
			this.options = null;
			plugin = null;
						
		},
		
		gotoSlide: function(slideNumber) {
		
			var plugin = this;
			
			var moveDirection = 1;
							
			if(slideNumber < plugin.currentPosition) 
			{
				moveDirection = -1;
			}
								
			plugin.currentPosition = plugin.movePanel(plugin.element, plugin.options, moveDirection, true, parseInt(slideNumber));
									
		}
		
    };
			

    //Plugin wrapper
    $.fn.panels = function ( options ) {
		var args = Array.prototype.slice.call(arguments, 1);
        return this.each(function () {
            var item = $(this), instance = item.data('Panels');
            if(!instance) {
                item.data('Panels', new Panels(this, options));
            } else {
                if(typeof options === 'string') {
                    instance[options].apply(instance, args);
                }
            }
        });
    };
	
	
})( jQuery, window, document );