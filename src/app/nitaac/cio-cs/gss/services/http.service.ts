import { Injectable } from '@angular/core';
import { Http, Response, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../../../environments/environment'
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()

export class HttpService {
    parameters: RequestOptionsArgs;
    constructor(private _http: Http) { }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }

    get(url, params) {
        //this.parameters = params;
        return this._http.get(this.getUrl(url), { search: params }).map(this.extractData).catch(this.handleError);
    }

    post(url, params) {
        return this._http.post(this.getUrl(url), params).map(this.extractData).catch(this.handleError);
    }

    getUrl(url) {
        return environment.backendBaseUrl + url;
    }



    //To Do: need to remove after service call
    getFromJson(url, params) {
        return this._http.get(url, { search: params }).map(this.extractData).catch(this.handleError);
    }
}