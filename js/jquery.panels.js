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
			easing: 'swing',
			
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
			onSlideBefore: function(element, index) { },
			onSlideAfter: function(element, index) { }
			
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
			
			
			
					/////Recalculate number of elements based on perScreen and step settings
//		
//		
//		var elementsTemp = 0;
//		for(var i=0; i<this.elements; i+= this.options.panelsToMove) {
//			if((i + this.options.panelsPerScreen) < this.elements) {
//				elementsTemp++;
//			}
//		}
//		
//		//if((this.elements % this.options.panelsPerScreen) != 0) {
//			elementsTemp++;
//		//}
//		
//		this.moveElements = elementsTemp;
//		
//		if(this.options.infinite) {
//			this.moveElements = this.elements;	
//		}
//		

//		
//		this.sizeRatio = this.panelHeight/this.panelWidth;
//		
//		//Add event listener to resize on window resize
//		if(this.options.responsive) {
//			$(this.element).width("100%");
//			this.resize();
//			var panel = this;
//			
//			$(window).resize(function(e) {
//				panel.resize();
//            });
//		}
//		
		
        },
//
        move: function(direction, setNextSlide, userClick) {
			
			var plugin = this;
			var element = $(this.element);
			
			if(plugin.timer !== null) {
				clearTimeout(plugin.timer);	
			}
			
			// Set the slide to be displayed
			var nextSlide = plugin.currentPosition;
						
			//If override is set, set nextslide to that, else add on the direction
			(setNextSlide !== false) ? (nextSlide = setNextSlide) : (nextSlide += direction)
			
			// make sure the next slide is in range..
			nextSlide = ((nextSlide >= plugin.slideCount) || (nextSlide < 0)) ? (((nextSlide%plugin.slideCount)+plugin.slideCount)%plugin.slideCount) : nextSlide;

			//Only animate if trying to move to a different slide
			if(nextSlide != plugin.currentPosition) {
				
				//Setup callbacks for slideBefore and slideAfter
				plugin.settings.onSlideBefore(element,nextSlide);
				
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
									plugin.settings.onSlideAfter(element,nextSlide)	
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
									
									
									plugin.settings.onSlideAfter(element,nextSlide)	
								});
								
							}
							
						} else {
					
							//If vertical, set the top property else set the left one
							var animateSettings = (plugin.settings.vertical) ? {top: (plugin.slides.eq(nextSlide).position().top) * -1} : {left: (plugin.slides.eq(nextSlide).position().left) * -1};
															
							plugin.slider.animate(animateSettings,plugin.settings.speed,plugin.settings.easing,function() {
								plugin.settings.onSlideAfter(element,nextSlide)	
							});
							
						}
						
						break;
					
					default:
						plugin.slides.eq(plugin.currentPosition).fadeOut(plugin.settings.speed);
						plugin.slides.eq(nextSlide).fadeIn(plugin.settings.speed);
						break;	
				}
				
			}
			
			if(plugin.settings.showMarkers) {
				plugin.marker.removeClass("active");
				plugin.marker.eq(nextSlide).addClass("active");					
			}
			
			//Set the next animation up if needed
			//Time has to be animation time + wait time so doesn't fire too early
			if((userClick && plugin.settings.resumeOnClick) || (plugin.settings.autoScroll)) {
				
				plugin.settings.autoScroll = true;
				
				plugin.timer = setTimeout(function() { 
					plugin.currentPosition = plugin.move(1, false, false);
				}, (plugin.settings.wait + plugin.settings.speed));
				
			}
			
			
			return nextSlide;
			
//			if((userClick) || ((!$(el).children(options.panel + ":eq(" + nextSlide + ")").is(":animated")) && (options.animation == "fade")) || ((!$(el).find(".scroller").is(":animated")) && (options.animation == "slide"))) {
//			
				
//																							
//				if(options.autoScroll || userClick) {
//					
//					nextSlide += (direction * this.options.panelsToMove);
//					var panelsToMoveThisTime = this.options.panelsToMove;
//									
//					
//										
//					
//					
//										
//					
//					
//																	
//						//Switch through the animation types and do the necessary animation
//						
//							case "slide":
//								
//								
//								//If Infinite scroll, handle the move function completely differently..
//								if(options.infinite) {
//							
//									if(direction == 1) {
//																				
//										//Add the number of nodes we are moving after the current slide
//										
//										for(var s = 0; s < panelsToMoveThisTime; s++) {
//											
//											var sc = this.currentPosition + this.options.panelsPerScreen + s;
//																															
//											if(sc >= this.elements) {
//												sc = sc % this.elements;	
//											}
//																					
//											$(this.element).find(".scroller").children(this.options.panel + ":not(.infinite)").eq(sc).clone().removeClass("hidden").show().appendTo($(this.element).find(".infinite"));
//											
//										}
//																				
//										//$(el).find(options.panel + ".hidden:eq(" + nextSlide + ")").clone().insertAfter($(el).find(options.panel + ".infinite")).removeClass("hidden").show();	
//										
//										if(options.vertical) {
//											$(el).find(".scroller").animate({
//												top: (this.panelHeight  * panelsToMoveThisTime) * -1
//											}, function() {
//												$(el).find(options.panel + ".infinite").children(options.panel + ":lt(" + panelsToMoveThisTime + ")").remove();
//												$(this).css({top:0});
//											});
//										} else {
//											$(el).find(".scroller").animate({
//												left: (this.panelWidth * panelsToMoveThisTime) * -1
//											},function() {
//												$(el).find(options.panel + ".infinite").children(options.panel + ":lt(" + panelsToMoveThisTime + ")").remove();
//												$(this).css({left:0});
//											});
//										}
//																
//									} else {
//										
//										//Add a node before the current slide
//										
//										//Add the number of nodes we are moving after the current slide
//										
//										var sc = this.currentPosition
//										
//										for(var s = 0; s < panelsToMoveThisTime; s++) {
//											
//											sc--;
//																				
//											if(sc < 0) {
//												sc = this.elements-1;	
//											}
//																					
//											$(this.element).find(".scroller").children(this.options.panel + ":not(.infinite)").eq(sc).clone().removeClass("hidden").show().prependTo($(this.element).find(".infinite"));
//											
//										}
//										
//																				
//										//$(el).find(options.panel + ".hidden:eq(" + nextSlide + ")").clone().insertBefore($(el).find(options.panel + ".infinite")).removeClass("hidden").show();	
//										
//										if(options.vertical) {
//											
//											$(el).find(".scroller").css({top:(this.panelHeight  * panelsToMoveThisTime) * -1}).animate({
//												top: 0
//											}, function() {
//												var sl = $(el).find(options.panel + ".infinite").children().size();
//												$(el).find(options.panel + ".infinite").children(options.panel + ":gt(" + (sl-panelsToMoveThisTime -1)  + ")").remove();
//											});
//											
//										} else {
//											
//											$(el).find(".scroller").css({left:(this.panelWidth  * panelsToMoveThisTime) * -1}).animate({
//												left: 0
//											}, function() {
//												var sl = $(el).find(options.panel + ".infinite").children().size();
//												$(el).find(options.panel + ".infinite").children(options.panel + ":gt(" + (sl-panelsToMoveThisTime -1)  + ")").remove();
//											});
//											
//											
//											
//										}
//										
//									}
//																						
//								} else {
//								
//									//Normal Scroll..
//									var scrollToSlide = nextSlide;
//									if(((scrollToSlide * this.options.panelsToMove) + this.options.panelsPerScreen) >= (this.elements)) {
//																				
//										if(options.vertical) {
//											$(el).find(".scroller").animate({
//												top: ((this.elements - this.options.panelsPerScreen) * this.panelHeight) * -1
//											});
//										} else {
//											$(el).find(".scroller").animate({
//												left: ((this.elements - this.options.panelsPerScreen) * this.panelWidth) * -1
//											});
//										}
//										 
//									} else {
//										if(options.vertical) {
//											$(el).find(".scroller").animate({
//												top: (scrollToSlide * (this.panelHeight * this.options.panelsToMove)) * -1
//											});
//										} else {
//											$(el).find(".scroller").animate({
//												left: (scrollToSlide * (this.panelWidth * this.options.panelsToMove)) * -1
//											});
//										}
//									}
//									
//								}
//								
//								
//								break;
//							
//							default:
//								
//								// Fade by default
//								
//							
//						}
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
//												
//					}
//					
//					//Setup timers again if permission to do so
//					if(userClick && options.resumeOnClick) {
//						
//						this.options.autoScroll = true;
//						var plugin = this;
//						
//						this.timerval = setInterval(function() { 
//							plugin.currentPosition = plugin.movePanel(el, options, 1, false, -1);
//						}, options.wait);
//					}
//					
//				}
//				
//				
//				if(options.infinite) 
//				{
//					if(direction == 1) {
//						options.onSlideChange(this, $(el).find(options.panel + ".infinite").children(options.panel + ":eq(" + options.panelsToMove + ")"));	
//					} else {
//						options.onSlideChange(this, $(el).find(options.panel + ".infinite").children(options.panel + ":eq(0)"));	
//					}
//				} 
//				else 
//				{
//					options.onSlideChange(this, $(el).find(options.panel + ":eq(" + this.currentPosition + ")"));
//				}
//				
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
			plugin = null;
						
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