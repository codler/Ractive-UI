module up.component {
	'use strict';
	export class BusyIndicator implements RactiveExtendOptions {
		// App specific
		public app: infor.idm.client.App;
		public translation: infor.idm.Translation;
	
		// Ractive events
		private static EVENT_TEARDOWN: string = 'teardown';	
	
		// Public properties
		public static PROPERTY_SHOW: string = 'show';
		
		beforeInit(options: any): void {
			// Load necessary resources
			this.app = <any>app;
			this.translation = options.data.Translation = this.app.translation;
		}

		init(options: any): void {
			var _ractive: Ractive = <any>this;
			var $node: JQuery = $(_ractive.find('*'));
			
			// Observe
			
			_ractive.observe(BusyIndicator.PROPERTY_SHOW, (newValue: boolean, oldValue: boolean) => {
				if (newValue) {
					this.enableOverlay($node);
					this.centerPosition($node);
				} else {
					this.disableOverlay($node);
				}
			}, {
				defer: true
			});
			
			// JQuery window resize
			var onCenterPositionResize = () => {
				if (_ractive.get(BusyIndicator.PROPERTY_SHOW)) {
					this.enableOverlay($node);
					this.centerPosition($node);
				}
			};
			
			// Register resize event
			$(window).on('resize', onCenterPositionResize);
			
			// Events
			
			_ractive.on(BusyIndicator.EVENT_TEARDOWN, () => {
				// Unregister resize event
				$(window).off('resize', onCenterPositionResize);
			});
		}
		
		enableOverlay($node: JQuery): void {
			var $parent: JQuery = $node.parent();
			var offset: JQueryCoordinates = $parent.offset();
			var parentWidth: number = $parent.outerWidth(true);
			var parentHeight: number = $parent.outerHeight(true);
			var $overlay: JQuery = $node.prev('.overlay');
			
			// Create overlay if it doesnt exist
			if (!$overlay.length) {
				$overlay = $('<div class="overlay"></div>');
				$node.before($overlay);
			}
			
			// Set position and size
			$overlay.offset(offset)
				.width(parentWidth)
				.height(parentHeight);
		}
		
		disableOverlay($node: JQuery): void {
			// Remove overlay
			$node.prev('.overlay').remove();
		}
		
		centerPosition($node: JQuery): void {
			var $parent: JQuery = $node.parent();
			var offset: JQueryCoordinates = $parent.offset();
			var parentWidth: number = $parent.outerWidth(true);
			var parentHeight: number = $parent.outerHeight(true);
			var width: number = $node.outerWidth(true);
			var height: number = $node.outerHeight(true);
			
			offset.left += (parentWidth - width) / 2;
			offset.top += (parentHeight - height) / 2;
			
			$node.offset(offset);
		}
	}
	
	export interface IBusyIndicator extends BusyIndicator, Ractive {
	}
}

// Register global component to Ractive
interface RactiveComponentPlugins {
	busyIndicator: RactiveStatic;
}
Ractive.components.busyIndicator = ractiveExtendTypeScriptClass(up.component.BusyIndicator);