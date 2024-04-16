import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { ResponseApi } from "../Interfaces/responseApiInterface";

@Injectable({
    providedIn:"root"
})

export class ProductService {

    private urlApi:string = `${environment.endpoint}products/`; 

    constructor(private http:HttpClient) {        
    }

    list():Observable<ResponseApi>{
        return this.http.get<ResponseApi>(`${this.urlApi}`)
    }
}