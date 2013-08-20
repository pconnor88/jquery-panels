;(function ( $, window, document, undefined ) {

    // Create the defaults once
    var pluginName = "panels",
        defaults = {
			panel: '',
            speed: 1000,
			wait: 3000,
			resumeOnClick: true,
			autoScroll: true,
			infinite: false,
			responsive: false,
			start: 0,
			showArrows: false,
			showMarkers: false,
			animation: 'fade',
			arrowLeftClass: 'arrowLeft',
			arrowRightClass: 'arrowRight',
			leftArrow: '',
			rightArrow: '',
			markerHolderClass: '',
			markerClass: '',
			markerActiveClass: '',
			showMarkerNumbers: false,
			panelsPerScreen: 1,
			panelsToMove: 1,
			vertical: false,
			onSetupComplete: function(element, slide) { },
			onSlideChange: function(element, slide) { }
        };

    // The actual plugin constructor
    function Panels( element, options ) {
        this.element = element;

        this.options = $.extend( {}, defaults, options );
			
        this._defaults = defaults;
        this._name = pluginName;
		
		//Dimension Calculations			
		this.elements = $(this.element).find(this.options.panel).size();
		this.panelWidth = $(this.element).find(this.options.panel).outerWidth(true);
		this.panelHeight = $(this.element).find(this.options.panel).outerHeight(true);
		
		this.sizeRatio = this.panelHeight/this.panelWidth;
		
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
			
			$(this.element).css("position", "relative");
			
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
					} else {
						$(this.element).children(this.options.panel).wrapAll("<div class=\"mask\" style=\"position:relative; overflow:hidden; width: " + (this.panelWidth * this.options.panelsPerScreen) + "px; height: " + this.panelHeight + "px;\"><div class=\"scroller\" style=\"position:absolute; zoom:1; width: " + ((this.panelWidth*this.elements)+20) + "px; height: " + this.panelHeight + "px;\"></div></div>");
						$(this.element).find(".scroller").css("left", (this.panelWidth*this.currentPosition*-1) + "px");
						$(this.element).find(this.options.panel).css({
							position: 'relative',
							float: 'left'
						});
					}
					
					//If infinite then we need to make a custom slider..
					if(this.options.infinite) {
						$(this.element).find(this.options.panel).addClass("hidden").hide();
						$(this.element).find(this.options.panel).eq(this.currentPosition).clone().insertBefore($(this.element).find(this.options.panel + ":first")).removeClass("hidden").addClass("infinite").show();
					}
									
					
					break;
				
				default:
					
					//Hide all the slides that aren't the first one.
					$(this.element).children(this.options.panel + ":not(:eq(" + this.currentPosition + "))").hide();	
					
			}
			
			if(this.options.showArrows) {
				
				// Only add arrows if there is more than 1 slide
				if(this.elements > 1) {
			
					// Inject the arrows
					var arrowHTMLImageLeft = "";
					var arrowHTMLImageRight = "";
					
					if (this.options.leftArrow.length > 0) { arrowHTMLImageLeft = "<img src=\"" + this.options.leftArrow + "\" />" }
					if (this.options.rightArrow.length > 0) { arrowHTMLImageRight = "<img src=\"" + this.options.rightArrow + "\" />" }
					
					var arrowHTML = "<a class=\"" + this.options.arrowLeftClass + "\" href=\"#\">" + arrowHTMLImageLeft + "</a><a class=\"" + this.options.arrowRightClass + "\" href=\"#\">" + arrowHTMLImageRight + "</a>";
					$(this.element).append(arrowHTML);
					
					this.options.arrowLeftClass = "." + this.options.arrowLeftClass;
					this.options.arrowRightClass = "." + this.options.arrowRightClass;
					
					//Setup listeners
					$(this.element).children(this.options.arrowLeftClass).click(function() {
						plugin.currentPosition = plugin.movePanel(plugin.element, plugin.options, -1, true, -1);
						
						if(plugin.options.infinite) 
						{
							plugin.options.onSlideChange(plugin, $(plugin.element).find(plugin.options.panel + ":eq(0)"));	
						} 
						else 
						{
							plugin.options.onSlideChange(plugin, $(plugin.element).find(plugin.options.panel + ":eq(" + plugin.currentPosition + ")"));
						}
						
						return false;
					});
					
					$(this.element).children(this.options.arrowRightClass).click(function() {
						plugin.currentPosition = plugin.movePanel(plugin.element, plugin.options, 1, true, -1);
						
						if(plugin.options.infinite) 
						{
							plugin.options.onSlideChange(plugin, $(plugin.element).find(plugin.options.panel + ":eq(1)"));	
						} 
						else 
						{
							plugin.options.onSlideChange(plugin, $(plugin.element).find(plugin.options.panel + ":eq(" + plugin.currentPosition + ")"));
						}
						
						return false;
						
					});
					
				}
			}
			
			if(this.options.showMarkers) {
					
					if (this.elements > 1) {
		
						var ButtonHTML = "<ul class=\"" + this.options.markerHolderClass + "\">";
						
						for(i = 0; i < this.elements; i++) {
							ButtonHTML += "<li><a href=\"#\" class=\"" + this.options.markerClass + "\">";
							
							if(this.options.showMarkerNumbers) {
								ButtonHTML += (i+1);
							}
							
							ButtonHTML += "</a></li>";
						}
						
						ButtonHTML += "</ul>";
														
						$(this.element).append(ButtonHTML);
						
						this.options.markerHolderClass = "." + this.options.markerHolderClass;
						
						$(this.element).children(this.options.markerHolderClass).children("li:eq(" + this.currentPosition + ")").children("a").addClass(this.options.markerActiveClass);
						
						//Setup listeners
						$(this.element).children(this.options.markerHolderClass).children("li").children("a").click(function() {
							
							var listing = $(this).parent("li");	
							var newIndex = $(plugin.element).children(plugin.options.markerHolderClass).children("li").index(listing);
							
							plugin.currentPosition = plugin.movePanel(plugin.element, plugin.options, 0, true, newIndex);
							
							if(plugin.options.infinite) 
							{
								plugin.options.onSlideChange(plugin, $(plugin.element).find(plugin.options.panel + ":eq(1)"));	
							} 
							else 
							{
								plugin.options.onSlideChange(plugin, $(plugin.element).find(plugin.options.panel + ":eq(" + plugin.currentPosition + ")"));
							}

							return false;
							
						});
					}
			}
			
						
			//Touchscreen setup
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
								
							if(plugin.options.infinite) 
							{
								plugin.options.onSlideChange(plugin, $(plugin.element).find(plugin.options.panel + ":eq(0)"));	
							} 
							else 
							{
								plugin.options.onSlideChange(plugin, $(plugin.element).find(plugin.options.panel + ":eq(" + plugin.currentPosition + ")"));
							}
						
						} else {
					
							plugin.currentPosition = plugin.movePanel(plugin.element, plugin.options, -1, true, -1);
								
							if(plugin.options.infinite) 
							{
								plugin.options.onSlideChange(plugin, $(plugin.element).find(plugin.options.panel + ":eq(0)"));	
							} 
							else 
							{
								plugin.options.onSlideChange(plugin, $(plugin.element).find(plugin.options.panel + ":eq(" + plugin.currentPosition + ")"));
							}
							
						}
						
					}
					
					
		
				}, false);
				
			}
			
			
			
			//Completed setup call the complete funciton..
			this.options.onSetupComplete(this,$(this.element).find(this.options.panel + ":eq(" + this.currentPosition + ")"));
			
			
				
			// Setting up timers	
			if(this.options.autoScroll) {
						
				this.timerval = setInterval(function() { 
					plugin.currentPosition = plugin.movePanel(plugin.element, plugin.options, 1, false, -1);

					if(plugin.options.infinite) 
					{
						plugin.options.onSlideChange(plugin, $(plugin.element).find(plugin.options.panel + ":eq(1)"));	
					} 
					else 
					{
						plugin.options.onSlideChange(plugin, $(plugin.element).find(plugin.options.panel + ":eq(" + plugin.currentPosition + ")"));
					}

				}, this.options.wait);
				
			}
			
        },

        movePanel: function(el, options, direction, userClick, setNextSlide) {
            
			
			if(userClick) {
				clearInterval(this.timerval);	
			}
																		
			// Set the slide to be displayed
			var nextSlide = 0;
			
			
			//Update the next slide based on direction
			nextSlide = this.currentPosition;
			
			if(options.autoScroll || userClick) {
				
				nextSlide += direction;
								
				if(setNextSlide > -1) {
					nextSlide = setNextSlide;
				}
				
				// Check to make sure the next panel isnt out of range..
				if(nextSlide < 0) {
					nextSlide = this.elements-1;	
				}
				
				if(nextSlide >= this.elements) {
					nextSlide = 0;	
				}
				
				//Only show some animation if trying to access a different slide
				if(nextSlide != this.currentPosition) {
					
					//If Infinite scroll, handle the move function completely differently..
					if(options.infinite) {
				
						if(direction == 1) {
							//Add a node after the current slide
							$(el).find(options.panel + ".hidden:eq(" + nextSlide + ")").clone().insertAfter($(el).find(options.panel + ".infinite")).removeClass("hidden").show();	
							
							if(options.vertical) {
								$(el).find(".scroller").animate({
									top: (this.panelHeight * -1)
								}, function() {
									$(el).find(options.panel + ".infinite").next(options.panel).addClass("infinite").prev(options.panel).remove();
									$(this).css({top:0});
								});
							} else {
								$(el).find(".scroller").animate({
									left: (this.panelWidth * -1)
								},function() {
									$(el).find(options.panel + ".infinite").next(options.panel).addClass("infinite").prev(options.panel).remove();
									$(this).css({left:0});
								});
							}
													
						} else {
							//Add a node before the current slide
							$(el).find(options.panel + ".hidden:eq(" + nextSlide + ")").clone().insertBefore($(el).find(options.panel + ".infinite")).removeClass("hidden").show();	
							
							if(options.vertical) {
								$(el).find(".scroller").css({
									top: (this.panelHeight * -1)
								});
								$(el).find(".scroller").animate({
									top: 0
								}, function() {
									$(el).find(options.panel + ".infinite").prev(options.panel).addClass("infinite").next(options.panel).remove();
								});
							} else {
								$(el).find(".scroller").css({
									left: (this.panelWidth * -1)
								});
								$(el).find(".scroller").animate({
									left: 0
								}, function() {
									$(el).find(options.panel + ".infinite").prev(options.panel).addClass("infinite").next(options.panel).remove();
								});
							}
							
						}
						
						
												
					} else {
					
									
						//Switch through the animation types and do the necessary animation
						switch(options.animation)
						{
							case "slide":
								
								var scrollToSlide = nextSlide;

								if(options.panelsPerScreen > 1) {
									if((nextSlide + (options.panelsPerScreen-1)) >= this.elements) {
										scrollToSlide = this.elements - options.panelsPerScreen;
									}
								}
								
								if(options.vertical) {
									
									$(el).find(".scroller").animate({
										top: (scrollToSlide * this.panelHeight) * -1
									});
								} else {
									$(el).find(".scroller").animate({
										left: (scrollToSlide * this.panelWidth) * -1
									});
								}
								
								break;
							
							default:
								
								// Fade by default
								$(el).children(options.panel + ":eq(" + this.currentPosition + ")").fadeOut(options.speed);
								$(el).children(options.panel + ":eq(" + nextSlide + ")").fadeIn(options.speed);	
							
						}
						
					}
					
					// Update the active marker if markers are shown.
					if(options.showMarkers) {
						$(el).children(options.markerHolderClass).children("li").children("a").removeClass(options.markerActiveClass);
						$(el).children(options.markerHolderClass).children("li:eq(" + nextSlide + ")").children("a").addClass(options.markerActiveClass);					
					}
					
				}
				
								
				//Setup timers again if permission to do so
				if(userClick && options.resumeOnClick) {
					
					this.options.autoScroll = true;
					
					var plugin = this;
					
					this.timerval = setInterval(function() { 
						plugin.currentPosition = plugin.movePanel(el, options, 1, false, -1);
						
						if(plugin.options.infinite) 
						{
							plugin.options.onSlideChange(plugin, $(plugin.element).find(plugin.options.panel + ":eq(0)"));	
						} 
						else 
						{
							plugin.options.onSlideChange(plugin, $(plugin.element).find(plugin.options.panel + ":eq(" + plugin.currentPosition + ")"));
						}

					}, options.wait);
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
					
					if(plugin.options.infinite) 
					{
						plugin.options.onSlideChange(plugin, $(plugin.element).find(plugin.options.panel + ":eq(0)"));	
					} 
					else 
					{
						plugin.options.onSlideChange(plugin, $(plugin.element).find(plugin.options.panel + ":eq(" + plugin.currentPosition + ")"));
					}
					
				}, plugin.options.wait);
				
			}

				
		},
		
		next: function() {
			plugin.currentPosition = plugin.movePanel(plugin.element, plugin.options, 1, false, -1);
			
			if(plugin.options.infinite) 
			{
				plugin.options.onSlideChange(plugin, $(plugin.element).find(plugin.options.panel + ":eq(1)"));	
			} 
			else 
			{
				plugin.options.onSlideChange(plugin, $(plugin.element).find(plugin.options.panel + ":eq(" + plugin.currentPosition + ")"));
			}
			
		},
		
		previous: function() {
			plugin.currentPosition = plugin.movePanel(plugin.element, plugin.options, -1, true, -1);
			
			if(plugin.options.infinite) 
			{
				plugin.options.onSlideChange(plugin, $(plugin.element).find(plugin.options.panel + ":eq(0)"));	
			} 
			else 
			{
				plugin.options.onSlideChange(plugin, $(plugin.element).find(plugin.options.panel + ":eq(" + plugin.currentPosition + ")"));
			}
						
		},
		
		gotoSlide: function(slideNumber) {
									
			if((slideNumber >= this.elements) || (slideNumber < 0)) {
				slideNumber = 0;	
			}
						
			this.currentPosition = slideNumber;
			
			switch(this.options.animation)
			{
				case "slide":				
					
					if(this.options.infinite) {
						
						$(this.element).find(this.options.panel + ".infinite").remove();
						$(this.element).find(this.options.panel).eq(this.currentPosition).clone().insertBefore($(this.element).find(this.options.panel + ":first")).removeClass("hidden").addClass("infinite").show();
						this.options.onSlideChange(this, $(this.element).find(this.options.panel + ".infinite"));	
						
					} else {
					
						var scrollToSlide = slideNumber;

						if(this.options.panelsPerScreen > 1) {
							if((slideNumber + (this.options.panelsPerScreen-1)) >= this.elements) {
								scrollToSlide = this.elements - this.options.panelsPerScreen;
							}
						}
											
						if(this.options.vertical) {
							$(this.element).find(".scroller").css("top", (this.panelHeight*scrollToSlide-1) + "px");
						} else {
							$(this.element).find(".scroller").css("left", (this.panelWidth*scrollToSlide*-1) + "px");					
						}
						
						this.options.onSlideChange(this, $(this.element).find(this.options.panel + ":eq(" + this.currentPosition + ")"));

						
					}
					break;
				
				default:
					
					$(this.element).children(this.options.panel + ":not(:eq(" + this.currentPosition + "))").hide();	
					
			}
			
			
		}
		
	
    };
			

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn.panels = function ( options ) {
		var args = Array.prototype.slice.call(arguments, 1);
        return this.each(function () {
            var item = $(this), instance = item.data('Panels');
            if(!instance) {
                // create plugin instance and save it in data
                item.data('Panels', new Panels(this, options));
            } else {
                // if instance already created call method
                if(typeof options === 'string') {
                    instance[options].apply(instance, args);
                }
            }
        });
    };
	
	
})( jQuery, window, document );