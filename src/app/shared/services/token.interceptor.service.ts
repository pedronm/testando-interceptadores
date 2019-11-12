import { Injectable } from '@angular/core';
import { map, startWith } from 'rxjs/operators';
import { LoginService } from './login.service';
import { Observable } from 'rxjs';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';

@Injectable()
export class TokenInterceptorService implements HttpInterceptor{
	
	// Injetando o serviço de Login
	constructor(private loginService: LoginService){}
	
	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
		
		console.log('INTERCEPTOR');
		// Recupera o Token, se houver algum
		const token = this.loginService.getAuthToken();
		let newHeaders = req.headers;
		if(token) {
			//Se tiver um token, nós o adicionamos ao header
			newHeaders = newHeaders.append('authtoken',token);
		}
		// Finalmente nós temos que clonar a requisição com o cabeçalho
		// Isso é necessário porque o HttpRequests é imutável.
		const authReq = req.clone({headers: newHeaders});
		
		//então retornamos um observador que ira rodar a requisição
		// ou passar ela para o proximo interceptor se tiver algum
		return next.handle(authReq).pipe(
			// Nós usamos o operador map
			// para mudar a data da resposta
			map(resp => {
				// Alguns eventos HTTP passam por esse observador
				// então nos vamos nos certificar que é uma resposta http
				if( resp instanceof HttpResponse){
					// Como o requet, nos vamos criar um clone da resposta
					// e vamos fazer mudanças nele, então retornar esse clone
					return resp.clone({body: [{title: 'Replaced data in interceptor'}]});
				}
			})	
				
			
		);
		
	}
}
	