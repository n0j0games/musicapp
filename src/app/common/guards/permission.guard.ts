import {CanActivateFn, Router} from "@angular/router";
import {inject} from "@angular/core";
import {PermissionService} from "../services/permission.service";
import {catchError, map, of, switchMap} from "rxjs";
import {HttpService} from "../services/http.service";

export const permissionGuard: CanActivateFn = () => {
    const router = inject(Router);
    const loginDialog = inject(PermissionService);
    const httpService  = inject(HttpService);

    return loginDialog.open().pipe(
        switchMap(credentials => {
            if (!credentials) {
                return of(router.createUrlTree(['/error/404']));
            }
            return httpService.auth(credentials).pipe(
                map(success => success ? true : router.createUrlTree(['/error/404']))
            );
        }),
        catchError(() => of(router.createUrlTree(['/error/404'])))
    );
};