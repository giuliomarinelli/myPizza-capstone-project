import { Injectable } from '@nestjs/common';

@Injectable()
export class CookieParserService {

    public parse(cookieHeader: string): Map<string, string> {

        const cookies: Map<string, string> = new Map()
        if (!cookieHeader) return cookies
        if (cookieHeader && cookieHeader.trim() === '') return cookies
        const rawCookies: string[] = cookieHeader.split(';')
        rawCookies.forEach(rawCookie => {
            const keyAndValue: string[] = rawCookie.trim().split('=')
            cookies.set(keyAndValue[0].trim(), keyAndValue[1].trim())
        })
        return cookies


    }

   


}
