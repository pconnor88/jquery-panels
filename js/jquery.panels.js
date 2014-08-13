;(function ( $, window, document, undefined ) {

    // Default settings
    var pluginName = "panels",
        defaults = {
			
			//General Options
			
			panel: null,
			animation: 'fade',
			easing: 'linear',
            speed: 2000,
			wait: 6000,
			startSlide: 0,
			resumeOnClick: true,
			pauseOnHover: true,
			autoScroll: true,
			responsive: false,	
			touchSwipe: true,
			
			//Slider Options
			
			infinite: false,
			panelsPerScreen: 1,
			panelsToMove: 1,
			vertical: false,
			
			//Arrow Options
			
			showArrows: false,
			hideArrowsAtEnd: false,
			leftArrowClass: 'arrowLeft',
			leftArrowImage: '',
			rightArrowClass: 'arrowRight',
			rightArrowImage: '',
			
			//Marker Options
			
			showMarkers: true,
			markerHolderClass: '',
			markerClass: '',
			markerPosition: 'sw',
			showMarkerNumbers: false,
			
			//Event Callbacks
			
			onSetupComplete: function(element, index) { },
			onSlideBegin: function(element, index) { },
			onSlideComplete: function(element, index) { }
			
        };

    // Constructor
    function Panels( element, options ) {
        
		this.element = element;
        this.settings = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
		
	    this.init();
			
    }

    Panels.prototype = {

        init: function() {
				
			var plugin = this;
			var element = $(plugin.element);
					
			element.addClass("pnl-holder");
			
			plugin.slides = 	((plugin.settings.panel !== undefined) && (plugin.settings.panel !== '')) ? element.children(plugin.settings.panel) : element.children();
			plugin.slideCount = plugin.slides.size();
					
			plugin.panelWidth = $(plugin.slides[0]).outerWidth(true);
			plugin.panelHeight = $(plugin.slides[0]).outerHeight(true);
			
			// If the current position is out of range, keep looping round the count till that number is reached. 
			// NB: Javascript negative modulus is broken, had to apply fix ((this%n)+n)%n.			
			plugin.currentPosition = ((plugin.settings.startSlide >= plugin.slideCount) || (plugin.settings.startSlide < 0)) ? (((plugin.settings.startSlide%plugin.slideCount)+plugin.slideCount)%plugin.slideCount) : plugin.settings.startSlide;
			
			plugin.timer = null;
			
			//Slider Animation Setup
			switch(plugin.settings.animation)
			{
				case "slide":	
					
					//inject the mask and scroller element
					plugin.slides.wrapAll("<div class=\"pnl-mask\"><div class=\"pnl-scroller\"></div></div>");
					plugin.slider = element.find(".pnl-scroller");		
					
					if(plugin.settings.vertical) {
						
						plugin.slides.css({
							position: 'relative'
						});
						
						plugin.slider.css({
							height: (plugin.panelHeight*plugin.slideCount)+20,
							top: (plugin.slides.eq(plugin.currentPosition).position().top) * -1
						});
						
						element.css({
							width: plugin.panelWidth,
							height: plugin.panelHeight
						});
					
					} else {
												
						plugin.slides.css({
							position: 'relative',
							float: 'left'
						});
												
						element.css({
							width: plugin.panelWidth,
							height: plugin.panelHeight
						});
												
						plugin.slider.css({
							width: (plugin.panelWidth*plugin.slideCount)+20
						}).css({
							left: (plugin.slides.eq(plugin.currentPosition).position().left) * -1
						});
						
					}
					
					//Infinite mode setup
					if(plugin.settings.infinite) {
						
						element.append("<div class=\"pnl-hidden-slides\"></div>");
						
						plugin.slides.appendTo(element.find(".pnl-hidden-slides").hide());
						
						//Populate the slider with all the elements on show.
						for(var s = 0; s < plugin.settings.panelsPerScreen; s++) {
						
							var sc = plugin.settings.startSlide + s;
						
							if(sc >= plugin.slideCount) {
								sc = sc % plugin.slideCount;	
							}
													
							plugin.slides.eq(sc).clone().appendTo(plugin.slider);
							
						}

						plugin.slider.css({
							left: 0
						});
						
					}
									
					
					break;
				
				default:
					
					element.css({
						"width": plugin.panelWidth,
						"height": plugin.panelHeight
					});
					
					plugin.slides.css({
						"position": "absolute",
						"top": "0px",
						"left": "0px"
					}).not(":eq(" + plugin.currentPosition + ")").hide();	
					
			}
			
			//Markers Setup
			if(plugin.settings.showMarkers) {
				
				// Only add markers if there is more than 1 slide
				if (plugin.slideCount > 1) {
				
					var buttonTemplate = "";
					buttonTemplate += "<ul class=\"pnl-markers " + plugin.settings.markerPosition + " " + plugin.settings.markerHolderClass + "\">";
					
					for(i=0; i<plugin.slideCount; i++) {
						
						buttonTemplate += "<li class=\"" + plugin.settings.markerClass + "\">";
						buttonTemplate += (plugin.settings.showMarkerNumbers) ? (i+1) : "";
						buttonTemplate += "</li>";
						
					}
					
					buttonTemplate += "</ul>";
													
					element.append(buttonTemplate);
					
					plugin.markers = element.children(".pnl-markers");
					plugin.marker = plugin.markers.children("li");
					
					var bulletWidth = plugin.marker.outerWidth(true);
					var bulletHeight = plugin.marker.outerHeight(true);
										
					switch(plugin.settings.markerPosition)
					{
						case "n":
							plugin.markers.css({
								"marginLeft": ((bulletWidth * plugin.slideCount)/2) * -1
							});
							break;
						
						case "e":
							plugin.markers.css({
								"marginTop": (bulletHeight/2) * -1
							});
							break;
							
						case "s":
							plugin.markers.css({
								"marginLeft": ((bulletWidth * plugin.slideCount)/2) * -1
							});
							break;
							
						case "w":
							plugin.markers.css({
								"marginTop": (bulletHeight/2) * -1
							});
							break;
							
					} 
					
					plugin.marker.click(function(e) {
						
						var newIndex = plugin.marker.index(this);
						var moveDirection = (newIndex < plugin.currentPosition) ? -1 : 1;
																				
						plugin.currentPosition = plugin.move(moveDirection,newIndex,true);
						e.preventDefault();
						
					}).eq(plugin.currentPosition).addClass("active");
				}
			}
			
			//Arrows Setup
			if(plugin.settings.showArrows) {
				
				// Only add arrows if there is more than 1 slide
				if (plugin.slideCount > 1) {
			
					var arrowTemplate = "";
					
					arrowTemplate += "<a class=\"pnl-arrow-left " + plugin.settings.leftArrowClass + "\" href=\"#\">";
					arrowTemplate += (plugin.settings.leftArrowImage.length) ? "<img src=\"" + plugin.settings.leftArrowImage + "\" alt=\"Previous slide\" />" : "";
					arrowTemplate += "</a>";
					arrowTemplate += "<a class=\"pnl-arrow-right " + plugin.settings.rightArrowImage + "\" href=\"#\">";
					arrowTemplate += (plugin.settings.rightArrowImage.length) ? "<img src=\"" + plugin.settings.rightArrowImage + "\" alt=\"Next slide\" />" : "";
					arrowTemplate += "</a>";
					
					element.append(arrowTemplate);
					
					plugin.leftArrow = element.children(".pnl-arrow-left");
					plugin.rightArrow = element.children(".pnl-arrow-right");
					
					//Setup listeners
					plugin.leftArrow.click(function(e) {
						plugin.currentPosition = plugin.move(-1, false, true);
						e.preventDefault();
					});
					
					plugin.rightArrow.click(function(e) {
						plugin.currentPosition = plugin.move(1, false, true);
						e.preventDefault();
					});
					
					//PROBABLY WANT TO MOVE THIS INTO A FUNCTION TO REFACTOR
					//Check to see if any of the arrows should be hidden at the start
					if((plugin.settings.hideArrowsAtEnd) && (!plugin.settings.infinite)) {
																										
						//Hide the left arrow if at the start
						if(plugin.currentPosition == 0) {
							plugin.leftArrow.hide();
						} else {
							plugin.leftArrow.show();
						}
						
						//Hide the right arrow if at the end
						if(plugin.currentPosition >= (plugin.slideCount -1)) {
							plugin.rightArrow.hide();
						} else {
							plugin.rightArrow.show();
						}
						
					}
					
				}
			}
			
			//Timers Setup	
			if(plugin.settings.autoScroll) {
						
				plugin.timer = setTimeout(function() { 
					plugin.currentPosition = plugin.move(1, false, false);
				}, plugin.settings.wait);
				
			}
			
			//Touch Event Setup
			if(plugin.settings.touchSwipe) {
				
 				var touchStartX;
 				var touchStartY;
				var swipeThreshold = 150;
				var swipeRestraint = 100;
 
 				plugin.element.addEventListener('touchstart', function(e){
					
					touchStartX = e.changedTouches[0].pageX;
					touchStartY = e.changedTouches[0].pageY;
  					e.preventDefault();
 
 				}, false);
 
				plugin.element.addEventListener('touchmove', function(e){
					
					e.preventDefault();
					
				}, false);
 
				plugin.element.addEventListener('touchend', function(e){
					
					var touchDistX = e.changedTouches[0].pageX - touchStartX;
					var touchDistY = e.changedTouches[0].pageY - touchStartY;
					
					if ((Math.abs(touchDistX) >= swipeThreshold) && (Math.abs(touchDistY) <= swipeRestraint) && (!plugin.settings.vertical)){
						plugin.currentPosition = (touchDistX < 0) ? plugin.move(1,false,true) : plugin.move(-1,false,true)
					}
					else if ((Math.abs(touchDistY) >= swipeThreshold) && (Math.abs(touchDistX) <= swipeRestraint) && (plugin.settings.vertical)){
						plugin.currentPosition = (touchDistY < 0) ? plugin.move(1,false,true) : plugin.move(-1,false,true)
					}
					
					e.preventDefault();
					
				}, false);
			}
			
			//Completed setup, call the complete funciton..
			plugin.settings.onSetupComplete(element, plugin.currentPosition);
		
        },

        move: function(direction, setNextSlide, userClick) {
			
			var plugin = this;
			var element = $(this.element);
			
			// Set the slide to be displayed
			var nextSlide = plugin.currentPosition;
			
			// Only move the feature panel on if it is not currently animated or a user click			
			if((!plugin.slides.is(":animated"))  && ((!plugin.slider) || (!plugin.slider.is(":animated")))) {
			
			
				if(plugin.timer !== null) {
					clearTimeout(plugin.timer);	
				}
				
							
				//If override is set, set nextslide to that, else add on the direction
				(setNextSlide !== false) ? (nextSlide = setNextSlide) : (nextSlide += direction)
				
				// make sure the next slide is in range..
				nextSlide = ((nextSlide >= plugin.slideCount) || (nextSlide < 0)) ? (((nextSlide%plugin.slideCount)+plugin.slideCount)%plugin.slideCount) : nextSlide;
	
				//Only animate if trying to move to a different slide
				if(nextSlide != plugin.currentPosition) {
					
					//Setup callbacks for slideBefore and slideAfter
					plugin.settings.onSlideBegin(element,nextSlide);
					
					switch(plugin.settings.animation)
					{
						
						case "slide":
						
							//Slide animation is split into two parts, infinite and regular
						
							if(plugin.settings.infinite) {
								
								//Use the direction to determine where to put the next slide
								if(direction == 1) {
									
									plugin.slides.eq(nextSlide).clone().appendTo(plugin.slider);
									plugin.slider.animate({
										left: '-100%'
									},plugin.settings.speed,plugin.settings.easing,function() {
										
										//remove the old code and reset
										for(var s = 0; s < plugin.settings.panelsPerScreen; s++) {
											plugin.slider.children().eq(s).remove();
										}
										
										plugin.slider.css({
											left: 0
										});
										
										SlideComplete(plugin,element,nextSlide);
									});
									
								} else {
									
									plugin.slides.eq(nextSlide).clone().prependTo(plugin.slider);
									
									plugin.slider.css({
											left: '-100%'
										});
									
									plugin.slider.animate({
										left: 0
									},plugin.settings.speed,plugin.settings.easing,function() {
										
										//remove the old code and reset
										for(var s = 0; s < plugin.settings.panelsPerScreen; s++) {
											plugin.slider.children().eq((-1 - s)).remove();
										}
										
										SlideComplete(plugin,element,nextSlide);
										
									});
									
								}
								
							} else {
						
								//If vertical, set the top property else set the left one
								var animateSettings = (plugin.settings.vertical) ? {top: (plugin.slides.eq(nextSlide).position().top) * -1} : {left: (plugin.slides.eq(nextSlide).position().left) * -1};
																
								plugin.slider.animate(animateSettings,plugin.settings.speed,plugin.settings.easing,function() {
									SlideComplete(plugin,element,nextSlide);
								});
								
							}
							
							break;
						
						default:
							
							plugin.slides.eq(plugin.currentPosition).fadeOut(plugin.settings.speed,plugin.settings.easing);
							plugin.slides.eq(nextSlide).fadeIn(plugin.settings.speed,plugin.settings.easing,function() {
								SlideComplete(plugin,element,nextSlide);
							});
							break;	
					}
					
				}
				
				
				
				//Set the next animation up if needed
				//Time has to be animation time + wait time so doesn't fire too early
				if((userClick && plugin.settings.resumeOnClick) || (plugin.settings.autoScroll)) {
					
					plugin.settings.autoScroll = true;
					
					plugin.timer = setTimeout(function() { 
						plugin.currentPosition = plugin.move(1, false, false);
					}, (plugin.settings.wait + plugin.settings.speed));
					
				}
				
			}
				
				
			return nextSlide;
			

//						
//						
//						//UPDATE THE CURRENT POSITION TO BE THE NEW POSITION
//						this.currentPosition = nextSlide;
//						
//						if((options.showArrows) && (options.hideArrowsAtEnd)) {
//																									
//							//Hide the arrow if at the start
//							if(this.currentPosition == 0) {
//								$(this.element).children(".pnl-arrow-left").hide();
//							} else {
//								$(this.element).children(".pnl-arrow-left").show();
//							}
//							
//							//Hide the arrow if at the end
//							if(this.currentPosition == (this.moveElements -1)) {
//								$(this.element).children(".pnl-arrow-right").hide();
//							} else {
//								$(this.element).children(".pnl-arrow-right").show();
//							}
//							
//						}
//							
//						
//												
//						// Update the active marker if markers are shown.
//						if(options.showMarkers) {
//							$(el).children(".pnl-markers").children("li").removeClass("active");
//							$(el).children(".pnl-markers").children("li:eq(" + nextSlide + ")").addClass("active");					
//						}
//					}
//				}
//			}
//			
//
//			return nextSlide;
//			
        },
//		
		pause: function() {
		
			var plugin = this;
			
			if(plugin.timer != null) {
				clearTimeout(plugin.timer);
			}
			
			plugin.settings.autoScroll = false;
		
		},
		
		play: function() {
			
			var plugin = this;
			
			plugin.settings.autoScroll = true;
			plugin.currentPosition = plugin.move(1,false,false);
				
		},
		
		next: function() {
		
			var plugin = this;
			
			plugin.currentPosition = plugin.move(1,false,false);
			
		},
		
		previous: function() {
			
			var plugin = this;
			
			plugin.currentPosition = plugin.move(-1,false,false);
						
		},
		
		gotoSlide: function(newIndex) {
			
			var plugin = this;
			var moveDirection = (newIndex < plugin.currentPosition) ? -1 : 1;
								
			plugin.currentPosition = plugin.move(moveDirection,newIndex,false);
									
		},
		
		destroy: function() {
			
			var plugin = this;
			var element = $(plugin.element);
			
			//Remove any styles the plugin has added						
			element.removeAttr("style").removeClass("pnl-holder");
			
			//Stop all possible animation
			plugin.slides.stop(true,true);
			
			if((plugin.slider) && (!plugin.slider.is(":animated"))) {
				plugin.slider.stop(true,true);	
			}

			//Remove arrows and markers
			plugin.markers.remove();
			
			//Remove inline styles
			plugin.slides.css({
				position: '',
				height: '',
				top: '',
				float: '',
				left: '',
				display: ''
			});
			
			//Remove timers
			if(plugin.timer != null) {
				clearTimeout(plugin.timer);
			}
			
			
			//Remove animation specific html
			switch(plugin.settings.animation)
			{
				
				case "slide":
				
					if(plugin.settings.infinite) {
						plugin.slider.parent().remove();
						plugin.slides.unwrap();
					} else {
						plugin.slides.unwrap().unwrap();
					}
					
					break;
				
				default:
					
					
					
					
					break;	
			}
						
						
		}
		
		
    };
	
	function SlideComplete(p,e,ns) {
		
		if(p.settings.showMarkers) {
			p.marker.removeClass("active");
			p.marker.eq(ns).addClass("active");					
		}
		
		p.settings.onSlideComplete(e,ns);
		
	}
			

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
					
					if(options === 'destroy') {
						item.data('Panels', null);	
					}
                }
            }
        });
    };
	
	
})( jQuery, window, document );