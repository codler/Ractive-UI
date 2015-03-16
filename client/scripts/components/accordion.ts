module up.component {
	'use strict';
	export class Accordion implements RactiveExtendOptions {
		// Internal events
		private static EVENT_INNERCLICK: string = 'innerclick';
		
		// Public events
		public static EVENT_COLLAPSE: string = 'collapse';
		public static EVENT_EXPAND: string = 'expand';
		
		// Public properties
		public static PROPERTY_STATE: string = 'state';
		
		// Enum
		public static States = {
			OPENED: 'opened',
			CLOSED: 'closed'
		};
		
		// Default Values
		public data = {
			'state' : 'closed'
		};

		init(options: any): void {
			var _ractive: Ractive = <any>this;
			var $node: JQuery = $(_ractive.find('*'));
			
			// Get state
			var opened: boolean = (_ractive.get(Accordion.PROPERTY_STATE) == Accordion.States.OPENED);
			
			// UI init state
			// TODO: Dont hard code 'block' in case someone wants to use other than 'display:block'
			$node.next().css('display', (opened) ? 'block' : 'none');
			
			// Observe
			
			_ractive.observe(Accordion.PROPERTY_STATE, (newValue: string, oldValue: string) => {
				// Get state
				var shouldOpen: boolean = (newValue == Accordion.States.OPENED);
				
				// Hide/show content under header
				if (shouldOpen) {
					// Animate
					$node.next().slideDown('fast', () => {
						// Fire expand event
						_ractive.fire(Accordion.EVENT_EXPAND);
					});
				} else {
					// Animate
					$node.next().slideUp('fast', () => {
						// Fire collapse event
						_ractive.fire(Accordion.EVENT_COLLAPSE);
					});
				}
			});
			
			// Events
			
			_ractive.on(Accordion.EVENT_INNERCLICK, (event: RactiveEvent) => {
				// Get state
				var opened: boolean = (_ractive.get(Accordion.PROPERTY_STATE) == Accordion.States.OPENED);
				
				// Invert state
				opened = !opened;
				
				// Toggle accordion class
				_ractive.set(Accordion.PROPERTY_STATE, (opened) ? Accordion.States.OPENED : Accordion.States.CLOSED);
			});
		}
	}
	
	export interface IAccordion extends Accordion, Ractive {
	}
}

// Register global component to Ractive
interface RactiveComponentPlugins {
	accordion: RactiveStatic;
}
Ractive.components.accordion = ractiveExtendTypeScriptClass(up.component.Accordion);