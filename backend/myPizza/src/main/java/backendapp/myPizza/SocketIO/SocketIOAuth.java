package backendapp.myPizza.SocketIO;

import backendapp.myPizza.exceptions.UnauthorizedException;
import backendapp.myPizza.security.JwtUtils;
import com.corundumstudio.socketio.AuthorizationListener;
import com.corundumstudio.socketio.HandshakeData;
import jakarta.servlet.http.Cookie;
import org.apache.http.impl.cookie.BasicClientCookie;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import java.net.HttpCookie;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@Component
public class SocketIOAuth implements AuthorizationListener {

    @Autowired
    private JwtUtils jwtUtils;

    public static List<Cookie> cookieParser(String reqCookieHeader) {
        String[] cookies = reqCookieHeader.split(";");
        List<Cookie> parsedCookies = new ArrayList<>();
        for (String c: cookies) {
            String[] keyAndValue = c.trim().split("=");
            parsedCookies.add(new Cookie(keyAndValue[0].trim(), keyAndValue[1].trim()));
        }
        return parsedCookies;
    }

    @Override
    public boolean isAuthorized(HandshakeData data) {
        String cookies = data.getHttpHeaders().get("Cookie");
        if (cookies == null) return false;
        if (cookies.isBlank()) return false;
        List<Cookie> parsedCookies = cookieParser(cookies);
        Cookie accessToken = null;

        try {
            accessToken = parsedCookies.stream().filter(c -> c.getName().equals("__access_tkn")).findFirst().get();
            System.out.println(accessToken.getValue());
        } catch (Exception e) {
            return false;
        }
        try {
            jwtUtils.verifyAccessToken(accessToken.getValue());
        } catch (UnauthorizedException e) {
            return false;
        }
        return true;

    }

    private String extractToken(HandshakeData data) {
        // Extract JWT from HandshakeData
        // Example: data.getHttpHeaders().get("Authorization");
        return null;
    }
}