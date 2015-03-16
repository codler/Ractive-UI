module up.component {
	'use strict';
	
	// ************************************
	// This component modal took inspiration from http://docs.ractivejs.org/latest/ractive-extend
	// and wrap around bootstrap modal
	//
//Usage: 
//new Modal({
//    partials: {
//        headerContent: '',
//        bodyContent: '',
//        footerContent: ''
//    },
//    ... bootstrap modal options ...
//})
	//
	// ************************************
	export class Modal {
		// Ractive options
		// it should append to it rather than overwriting its contents
		public append: boolean = true;
			
		// Ractive events
		private static EVENT_TEARDOWN: string = 'teardown';
		
		// Bootstrap events
		private static EVENT_HIDDEN_BS_MODAL: string = 'hidden.bs.modal';
	
		beforeInit(options: any): void {
			// by default, the modal should sit atop the <body>
			options.el = document.body;
		}
		
		init(options: any): void {
			var _ractive: Ractive = <any>this;
			var $node: JQuery = $(_ractive.find('*'));
	
			// Init Bootstrap Modal
			$node.modal(options)
				// Teardown when closing modal
				.on(Modal.EVENT_HIDDEN_BS_MODAL, (event: JQueryEventObject) => {
					
					// Teardown Ractive
					_ractive.teardown();
				});
			
			_ractive.on(Modal.EVENT_TEARDOWN, () => {
				// Unbinding any Bootstrap events
				$node.remove();
			});
		}
	}
	
	export interface IModal extends Modal, Ractive {
	}
}

// Register global component to Ractive
interface RactiveComponentPlugins {
	modal: RactiveStatic;
}
Ractive.components.modal = ractiveExtendTypeScriptClass(up.component.Modal);