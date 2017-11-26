export function Controller () {
    return function(target: any) {
        target.prototype.getRoutes = function() {
            return {
                '/': () => {
                    
                }
            }
        }
    }
}