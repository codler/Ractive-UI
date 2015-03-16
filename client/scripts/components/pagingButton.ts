module up.component {
	'use strict';
	export class PagingButton extends IconButton {
		// Extending IconButton
	}
	
	export interface IPagingButton extends PagingButton, Ractive {
	}
}

// Register global component to Ractive
interface RactiveComponentPlugins {
	pagingButton: RactiveStatic;
}
Ractive.components.pagingButton = ractiveExtendTypeScriptClass(up.component.PagingButton);