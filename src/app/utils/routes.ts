/** Función para verificar si dos rutas son iguales. no tiene en cuenta los parametros de la url */
export const isRoute = (route, targetRoute) => {
    if (!targetRoute?.startsWith('/')) {
        targetRoute = '/' + targetRoute;
    }
    const cleanRoute = route.replace(/\?.*/, '');
    return cleanRoute.startsWith(targetRoute);
};
