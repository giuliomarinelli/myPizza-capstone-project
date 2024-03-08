package backendapp.myPizza.security;


import backendapp.myPizza.Models.entities.User;
import backendapp.myPizza.Models.enums.TokenPairType;
import backendapp.myPizza.Models.resDTO.ErrorRes;
import backendapp.myPizza.Models.resDTO.TokenPair;
import backendapp.myPizza.exceptions.UnauthorizedException;
import backendapp.myPizza.services.AuthService;
import backendapp.myPizza.services.AuthUserService;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.jsonwebtoken.ExpiredJwtException;
import io.micrometer.common.lang.NonNull;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.Arrays;
import java.util.UUID;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private AuthUserService authUserSvc;

    private static int count = 0;

    @Override
    protected void doFilterInternal(HttpServletRequest req, @NonNull HttpServletResponse res, FilterChain filterChain) throws ServletException, IOException {
        try {

            if (req.getCookies() == null) {
                throw new UnauthorizedException("No provided access and refresh tokens");
            }
            Cookie[] cookies = req.getCookies();

            Arrays.stream(cookies).forEach(c -> System.out.println(c.getValue()));
            TokenPair tokens = new TokenPair();
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("__access_tkn")) tokens.setAccessToken(cookie.getValue());
                if (cookie.getName().equals("__refresh_tkn")) tokens.setRefreshToken(cookie.getValue());
            }
            if (tokens.getAccessToken() == null) throw new UnauthorizedException("No provided access token");
            if (tokens.getRefreshToken() == null) throw new UnauthorizedException("No provided refresh token");
            System.out.println(tokens);
            try {
                jwtUtils.verifyAccessToken(tokens.getAccessToken());
                UUID userId = jwtUtils.extractUserIdFromAccessToken(tokens.getAccessToken());
                User u = authUserSvc.findUserById(userId);
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(u, cookies, u.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);
                filterChain.doFilter(req, res);
            } catch (ExpiredJwtException e) {
                System.out.println(e.getMessage() + " N." + count);
                count++;
                TokenPair newTokens = jwtUtils.generateTokenPair(tokens.getRefreshToken(), TokenPairType.HTTP);
                Cookie accessToken = new Cookie("__access_tkn", newTokens.getAccessToken());
                accessToken.setHttpOnly(true);
                accessToken.setDomain("localhost");
                accessToken.setPath("/");
                Cookie refreshToken = new Cookie("__refresh_tkn", newTokens.getRefreshToken());
                refreshToken.setHttpOnly(true);
                refreshToken.setDomain("localhost");
                refreshToken.setPath("/");
                res.addCookie(accessToken);
                res.addCookie(refreshToken);
                System.out.println(newTokens);
                UUID userId = jwtUtils.extractUserIdFromAccessToken(newTokens.getAccessToken());
                User u = authUserSvc.findUserById(userId);
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(u, cookies, u.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);
                filterChain.doFilter(req, res);
            }


        } catch (Exception e) {
            ObjectMapper mapper = new ObjectMapper();
            res.setStatus(HttpStatus.UNAUTHORIZED.value());
            res.setContentType("application/json;charset=UTF-8");
            res.getWriter().write(mapper.writeValueAsString(
                    new ErrorRes("Unauthorized", e.getMessage(), HttpStatus.UNAUTHORIZED))
            );
        }
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest req) throws ServletException {
        return new AntPathMatcher().match("/auth/**", req.getServletPath());
    }


}
