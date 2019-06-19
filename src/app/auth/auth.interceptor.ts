import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';

import { Observable } from 'rxjs';

import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(public authService: AuthService) { }


    // the whole point of this interceptor is to intercept the outgoing HTTP request
    // and add a query param to it so that it can add the auth Token to the end of the URL
    // whenever it communicates with Firebase's DB. In other words, it turns
    // "https://quickpass-4ed21.firebaseio.com/WHATEVER_NODE(e.g. folder).json" into
    // "https://quickpass-4ed21.firebaseio.com/WHATEVER_NODE.json?auth=INSERT_TOKEN_HERE"
    // instead of having to constantly have to authenticate every HTTP request
    // by writing " '?auth=' + TOKEN " everytime you create a request somewhere in the application
    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // console.log('intercepted!', req);
        const copiedReq = req.clone(
            { params: req.params.set('auth', this.authService.getToken()) }
        );
        return next.handle(copiedReq);
    }
}
