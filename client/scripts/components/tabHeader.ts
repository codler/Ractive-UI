module up.component {
	'use strict';
	
	// http://jsfiddle.net/8kDPU/
	
	export class TabHeader implements RactiveExtendOptions {
		// App specific
		public app: infor.idm.client.App;
		public translation: infor.idm.Translation;
		
		// Internal events
		private static EVENT_INNER_CLOSE: string = 'innerClose';
		private static EVENT_INNER_FOCUS_IN: string = 'innerFocusIn';
		private static EVENT_INNER_FOCUS_OUT: string = 'innerFocusOut';
		private static EVENT_INNER_SELECT: string = 'innerSelect';
		
		// Public events
		public static EVENT_CLOSE: string = 'close';
		public static EVENT_FOCUS: string = 'focus';
		public static EVENT_SELECT: string = 'select';
		public static EVENT_TEXT_CHANGE: string = 'textChange';
		
		// Public properties
		public static PROPERTY_TEXT: string = 'text';
		
		beforeInit(options: any): void {
			// Load necessary resources
			this.app = <any>app;
			this.translation = options.data.Translation = this.app.translation;
		}
		
		init(options: any): void {
			var _ractive: Ractive = <any>this;
			
			// Observe
			
			_ractive.observe(TabHeader.PROPERTY_TEXT, (newValue: string, oldValue: string) => {
				_ractive.fire(TabHeader.EVENT_TEXT_CHANGE, newValue);
			}, {
				defer: true
			});
			
			// Events
		
			// Trigger on-close
			_ractive.on(TabHeader.EVENT_INNER_CLOSE, (event: RactiveEvent) => {
				_ractive.fire(TabHeader.EVENT_CLOSE, event, this);
			});
			
			// Trigger on-focus
			_ractive.on(TabHeader.EVENT_INNER_FOCUS_IN, (event: RactiveEvent) => {
				_ractive.set(TabHeader.EVENT_FOCUS, 'tabHeaderFocus');
			});
			
			// Trigger on-focus
			_ractive.on(TabHeader.EVENT_INNER_FOCUS_OUT, (event: RactiveEvent) => {
				_ractive.set(TabHeader.EVENT_FOCUS, null);
			});
			
			// Trigger on-select
			_ractive.on(TabHeader.EVENT_INNER_SELECT, (event: RactiveEvent) => {
				_ractive.fire(TabHeader.EVENT_SELECT, event, this);
			});

		}
	}
	
	export interface ITabHeader extends TabHeader, Ractive {
	}
}

// Register global component to Ractive
interface RactiveComponentPlugins {
	tabHeader: RactiveStatic;
}
Ractive.components.tabHeader = ractiveExtendTypeScriptClass(up.component.TabHeader);