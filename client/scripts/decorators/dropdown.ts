interface RactiveDecoratorPlugins {
    dropdown: RactiveDecoratorPlugin;
}
'use strict';
Ractive.decorators.dropdown = function( node: RactiveNode ) {
    var ractive = node._ractive.root;
    var $node = $(node);
    
    // Bootstrap dropdown
    $node.dropdown().on('change', () => {
        ractive.updateModel();
    });
    
    return {
        teardown: function () {
            $node.remove();
        }
    };
};