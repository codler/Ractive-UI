interface RactiveDecoratorPlugins {
    tooltip: RactiveDecoratorPlugin;
}
'use strict';
Ractive.decorators.tooltip = function( node: Node, placement: String) {
    var $node = $(node);
    
    // Bootstrap tooltip
    $node.tooltip({
        placement: placement == null ? 'auto bottom': placement, //Use bottom auto if no placement is specified
        container: 'body',
        delay: 150
    });
    
    return {
        teardown: function () {
            $node.tooltip('destroy');
        }
    };
};