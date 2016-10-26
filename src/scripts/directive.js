app.directive('filelist', function () {
    return function (scope, elm, attrs) {
        elm.bind('change', function (evt) {
            scope.$apply(function () {
                scope[attrs.name] = evt.target;
                var reader = new FileReader();
                reader.onload = function () {
                    var data = reader.result;
                    console.log(data);
                    scope.processData(data);
                };
                reader.readAsText(scope[attrs.name].files[0]);
            });
        });
    };
});


