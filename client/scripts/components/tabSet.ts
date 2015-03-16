interface RactiveComponentPlugins {
    tabSet: RactiveStatic;
}
((Ractive: RactiveStatic) => {
    'use strict';
    
    // http://jsfiddle.net/8kDPU/
    
    Ractive.components.tabSet = Ractive.extend({
    
        // This must be false when we use Content directive in Ractive template
        isolated: false,
        
    	init: function( options: any ) {
            var $node: JQuery = $(this.find('*')),
            	self = this;
			
			// Used to store hidden tabs
			this.set('hiddenTabs', []);
			
			// Call when rezising window, to show/hide "More" tab 
			var debounce = _.debounce(() => {
				self.__calculateTabsWidth();
			}, 100);
			$(window).resize(debounce);
			
            // Events
            
            this.on('change', (changedValues: any) => {
                // Show tab that have tabHeader with attribute "selected"
                var index: number = this.selectedTab();
                
                if (typeof index !== 'undefined') {
                    // This is needed for hiding new added tabs
                    //this.showTab(index);
                }
            });
    		
    		
    		this.on('bindSelect', (event: RactiveEvent, context: Ractive) => {
                event.original.preventDefault();
                
                var index: number = this.findAllComponents('tabHeader').indexOf(context);
                // Event select are triggered in showTab
                this.showTab(index);
            });
            
            this.on('bindClose', (event: RactiveEvent, context: Ractive) => {
                event.original.preventDefault();
                
                var index: number = this.findAllComponents('tabHeader').indexOf(context);
                
                this.fire('close', event, index);
				
				this.setCurrentTab(index - 1);
            });
            
            this.on('bindTextChange', (event: RactiveEvent, value: string) => {
                // event is null
				this.fire('textChange', event, value);
            });
            
            // Update "More"-dropdownlist content
            this.on('updateList', (event: RactiveEvent, index: Ractive) => {
                this.set('tabs', $node.find('.tabHeader:not(.tabHeaderMore) a').map(function() {
                    return {
                        text: $(this).text(),
                        //lock icon
                        accessoryType: $(this).children().first().attr('class')
                    } 
                }).get());
            });
            
            this.on('innerSelect', (event: RactiveEvent, index: Ractive) => {
                event.original.preventDefault();
                
                this.showTab(index);
            });
            
            this.showTab(this.selectedTab());
        },
        
        // Custom
        
        // Return index of selectedTab
        selectedTab: function() {
        	var tabHeaders: Ractive[] = this.findAllComponents('tabHeader');
            for (var i: number = 0, len: number = tabHeaders.length; i < len; i++) {
                if (tabHeaders[i].get("selected")) {
                    return i;
                }
            }
            return 0;
        },
        
        showTab: function(index: number) {
            var $id: JQuery = $('#' + this.get('for'));
            
            index = Math.min(index, this.findAllComponents("tabHeader").length - 1);
            
            // Show correct tab header
            this.findAllComponents("tabHeader").forEach((tabHeader: Ractive) => {
                tabHeader.set("selected", null);
            });
            this.findAllComponents("tabHeader")[index].set("selected", "selected");
            
            // Show correct tab content
            $id.children()
                .hide()
                .eq(index)
                .show();
            
            this.fire('select', null, index);
            
            this.setCurrentTab(index);
		},
        
        showLastTab: function() {
             this.showTab(this.findAllComponents("tabHeader").length - 1);
        },
        
        // Calculate total tabs width
        getTotalTabsWidth: function() {
        	var tabsWidth = 0;
        	$(this.find('*')).find('li.tabHeader:not(.tabHeaderMore)').each(function(index) {
        		tabsWidth += $(this).outerWidth(true);
        	});
        	return tabsWidth;
        },
        
        // Collapse/expand/shift tabs
        collapseTabs: function(index) {
        	var $node: JQuery = $(this.find('*')),
	    		hiddenTabs = this.get('hiddenTabs'),
	    		toShow = [], toHide = [], hiddenTab, shown;
	    	
        	var windowMoreLeftEdge = $node.find('li.tabHeader.tabHeaderMore').offset().left;
        	var lastTabRightEdge = (function() {
        		return this.offset().left + this.outerWidth(true);
        	}).apply($node.find('li.tabHeader:not(.tabHeaderMore):last'));
        	
        	// Active tab
        	var activeTab = $node.find('li.tabHeader:nth-child(' + (index + 1) + ')');
        	var activeTabLeftEdge = activeTab.offset().left;
        	var activeTabVisible = activeTab.is(':visible');
        	
        	// Show hidden tabs that fit the window
            // While there are hidden files AND ( active tab is still hidden OR a there's enough space for a hidden tab => last tab's right edge fits the screen)
            while (hiddenTabs.length && (!activeTabVisible || lastTabRightEdge < $(window).width() || activeTabLeftEdge <= 11)) {
            	hiddenTab = hiddenTabs.pop(); // last hidden at the end
            	if(hiddenTab.is(".selected")) {
            		activeTabVisible = true;
            		activeTabLeftEdge = 0;
            	} else {
            		activeTabLeftEdge += hiddenTab.outerWidth(true); // Shifts active tab
            	}
            	lastTabRightEdge += hiddenTab.outerWidth(true); // Shifts last tab
				toShow.push(hiddenTab); // Show this tab
			}
			var activeTabRightEdge = activeTabLeftEdge + activeTab.outerWidth(true);
			
            // Revert tabs stored into toShow list if the active tab overflows the screen
			while ((activeTabRightEdge > windowMoreLeftEdge) && toShow.length) {
				shown = toShow.pop();
				activeTabRightEdge -= shown.outerWidth(true);
				hiddenTabs.push(shown);
			}
			toShow.forEach(function(tab) {
				tab.show(100);
			});
			
			// Hide tabs so that the active tab is fully visible
			while (activeTabRightEdge > windowMoreLeftEdge && hiddenTabs.length < index) {
				var tab = $node.find('li.tabHeader:nth-child(' + (hiddenTabs.length + 1) + ')'); 
				activeTabRightEdge -= tab.outerWidth(true); // Update offset
				hiddenTabs.push(tab);
				tab.hide(100);
			}
        },
        
        currentTab: 0,
        setCurrentTab: function(idx) {
        	if(idx !== this.currentTab) {
        		this.currentTab = idx;
        		this.__calculateTabsWidth(idx);
        	}
        },
        
        // Update displayed tabs
        __calculateTabsWidth: function() {
        	if (this.get('tabType') == 'moduleTabSet') {
        		
            	// Total width of tabs narrower than window width - show all hidden tabs
				if (this.getTotalTabsWidth() <= $(window).width()){
					this.set('showMore', false);
					var hiddenTabs = this.get('hiddenTabs'), tab;
					while(hiddenTabs.length) {
						hiddenTabs.pop().show(100);
					}
				}
				
				// Total width of tabs wider than window width
				else {
					this.set('showMore', true);
					this.collapseTabs(this.currentTab);
				}
			}
         }
    });
})(Ractive);