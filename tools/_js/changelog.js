Changelog = {
    template : "<div class='accordion' id='{0}' data-bind='foreach: updates'> \
        <div class='accordion-group'> \
        <div class='accordion-heading'> \
            <a class='accordion-toggle' data-toggle='collapse' data-parent='#{0}' data-bind=\"attr: { 'data-target' : href }, html : heading\"> </a> \
        </div> \
        <div data-bind='attr : { id : id }' class='accordion-body collapse'> \
        <div class='accordion-inner'> \
            <ul data-bind='foreach: notes' class='changelog'> \
                <li data-bind='text: $data'></li> \
            </ul> \
        </div> \
        </div> \
    </div> \
    </div>",

    defineStringFormat : function() {
        if (!String.prototype.format) {
            String.prototype.format = function() {
                var args = arguments;
                return this.replace(/{(\d+)}/g, function(match, number) {
                    return typeof args[number] != 'undefined'
                        ? args[number]
                        : match
                        ;
                });
            };
        }
    },
    
    create : function(id, $container, data) {
        // Knockout VMs
        function UpdateVM(args) { var s = this;
            s.id = 'update'+args.id;
            s.href = '#'+s.id;
            s.heading = "Version "+args.version+"<a class='pull-right'>"+args.date+"</a>";
            s.notes = args.notes;
        }
        function UpdatelogVM(args) { var s = this;
            s.updates = $.map(args.updates, function(item) {
                return new UpdateVM(item);
            });
        }

        $container.append( this.template.format(id) );

        ko.applyBindings( new UpdatelogVM( { updates : data} ), $('#'+id)[0] );
    }
};