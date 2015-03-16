interface RactiveDecoratorPlugins {
    dropdown: RactiveDecoratorPlugin;
}
'use strict';
Ractive.decorators.dropdown = function( node: RactiveNode ) {
    var ractive: Ractive = node._ractive.root;
    var binding = node._ractive.binding;
    var $node = $(node);
    var observer: RactiveObserve;
    
    // Push changes from ractive to dropdown
    if (binding) {
        observer = ractive.observe(binding.keypath, function(newValue: number, oldValue: number) {
            $node.trigger('updated');
        }, {
            defer: true
        });
    }
    
    // Push changes from <option> ractive sections to dropdown
    node._ractive.proxy.fragment.items.forEach((item: any) => {
        if (item.keypath) {
            ractive.observe(item.keypath, function(newValue: number, oldValue: number) {
                $node.trigger('updated');
            });
        }
    });
    
    // Bootstrap dropdown
    $node.dropdown().on('change', (event: JQueryEventObject) => {
        ractive.updateModel();
        if (node._ractive.events.select) {
            node._ractive.events.select.fire('select')
        }
    });
    
    return {
        teardown: function () {
            // TODO: should it be this instead? $node.dropdown('destroy')
            
            $node.remove();
            
            if (observer) {
                observer.cancel();
            }
        }
    };
};