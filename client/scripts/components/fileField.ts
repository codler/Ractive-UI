module up.component {
	'use strict';
	export class FileField {
		// Internal events
		private static EVENT_INNERCHANGE: string = 'innerChange';
		
		// Public events
		public static EVENT_CHANGE: string = 'change';
		public static EVENT_CHANGE_PARAMETER: string = 'change-param';
		
		// Public properties
		public static PROPERTY_VALUE: string = 'value';
		
		init(options: any): void {
			var _ractive: Ractive = <any>this;
			var $node: JQuery = $(_ractive.find('*'));
			
			// Events
			
			_ractive.on(FileField.EVENT_INNERCHANGE, (event: RactiveEvent) => {
				var node: HTMLInputElement = <HTMLInputElement>event.node;
				
				// Only trigger this function when the file is changed, not when the page is initialized or cancelled
				if (// If event wasnt a original ractive event
					!node ||
					// event.node.value is '' when user cancel dialog in some browser 
					(node && node.value == '') ||
					 // files are empty when user cancel dialog
					(node.files && !node.files[0]) ) {
					return;
				}
				
				// Store filename
				_ractive.set(FileField.PROPERTY_VALUE, node.value);
				
				// Fire change event
				_ractive.fire(FileField.EVENT_CHANGE, event, _ractive.get(FileField.EVENT_CHANGE_PARAMETER));
			});
		}
	}
	
	export interface IFileField extends FileField, Ractive {
	}
}

// Register global component to Ractive
interface RactiveComponentPlugins {
	fileField: RactiveStatic;
}
Ractive.components.fileField = ractiveExtendTypeScriptClass(up.component.FileField);