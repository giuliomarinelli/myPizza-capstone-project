package backendapp.myPizza.security;

import backendapp.myPizza.Models.entities.User;
import backendapp.myPizza.Models.enums.TokenPairType;
import backendapp.myPizza.Models.enums.TokenType;
import backendapp.myPizza.Models.resDTO.TokenPair;
import backendapp.myPizza.exceptions.UnauthorizedException;
import backendapp.myPizza.services.AuthUserService;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import net.iharder.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Date;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@PropertySource("application.properties")
public class JwtUtils {

    @Autowired
    private AuthUserService authUserSvc;

    @Value("${access_token.secret}")
    private String accessSecret;


    @Value("${refresh_token.secret}")
    private String refreshSecret;

    @Value("${ws_access_token.secret}")
    private String wsAccessSecret;

    @Value("${ws_refresh_token.secret}")
    private String wsRefreshSecret;


    @Value("${access_token.expiresIn}")
    private String accessExp;
    @Value("${refresh_token.expiresIn}")
    private String refreshExp;
    @Value("${ws_access_token.expiresIn}")
    private String wsAccessExp;



    public TokenPair generateTokenPair(String refreshToken, TokenPairType type) throws UnauthorizedException {
        try {
            String secret = "";
            switch (type) {
                case TokenPairType.HTTP -> secret = refreshSecret;
                case TokenPairType.WS -> secret = wsRefreshSecret;
                default -> throw new Exception();
            }
            UUID userId = UUID.fromString(
                    Jwts.parser().
                            verifyWith(Keys.hmacShaKeyFor(refreshSecret.getBytes())).
                            build()
                            .parseSignedClaims(refreshToken).
                            getPayload().
                            getSubject());
            User u = authUserSvc.findUserById(userId);
            System.out.println("Refresh");
            switch (type) {
                case TokenPairType.HTTP -> {
                    return new TokenPair(generateToken(u, TokenType.ACCESS), generateToken(u, TokenType.REFRESH), type);
                }
                case TokenPairType.WS -> {
                    return new TokenPair(generateToken(u, TokenType.WS_ACCESS), generateToken(u, TokenType.WS_REFRESH), type);
                }
                default -> throw new Exception();
            }

        } catch (Exception exception) {
            throw new UnauthorizedException("Invalid refresh token");
        }

    }


    public void verifyAccessToken(String accessToken) throws UnauthorizedException {

        try {
            Jwts.parser().verifyWith(Keys.hmacShaKeyFor(accessSecret.getBytes())).build()
                    .parseSignedClaims(accessToken).getPayload();
        } catch (MalformedJwtException | SignatureException | UnsupportedJwtException | IllegalArgumentException e) {
            throw new UnauthorizedException("Invalid access token");
        } catch (ExpiredJwtException e) {
            throw e;
        } catch (Exception e) {
            throw new UnauthorizedException("Invalid access token");
        }

    }

    public boolean verifyWsAccessToken(String wsAccessToken) {
        try {
            Jwts.parser().verifyWith(Keys.hmacShaKeyFor(wsAccessSecret.getBytes())).build()
                    .parseSignedClaims(wsAccessToken).getPayload();
            return true;
        }
        catch (Exception e) {
            return false;
        }
    }

    public String generateToken(User u, TokenType type) {
        long exp = 1;
        String secret = accessSecret;
        boolean restore = false;
        switch (type) {
            case TokenType.ACCESS -> {
                exp = Long.parseLong(accessExp);
                secret = accessSecret;
            }
            case TokenType.REFRESH -> {
                exp = Long.parseLong(refreshExp);
                secret = refreshSecret;
            }
            case TokenType.WS_ACCESS -> {
                exp = Long.parseLong(wsAccessExp);
                secret = wsAccessSecret;
            }
            case TokenType.WS_REFRESH -> {
                exp = Long.parseLong(refreshExp);
                secret = wsRefreshSecret;
            }
        }


        return Jwts.builder()
                .issuer("MyPizza")
                .claim("typ", "JWT " + type.name() + " TOKEN")
                .subject(u.getId().toString())
                .claim("scope", u.getScope().stream().map(Enum::name)
                        .collect(Collectors.joining(" ")))
                .claim("restore", false)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + exp))
                .signWith(Keys.hmacShaKeyFor(secret.getBytes()))
                .compact();
    }

    public UUID extractUserIdFromAccessToken(String accessToken) throws NoSuchAlgorithmException, InvalidKeySpecException, IOException, UnauthorizedException {

        try {
            return UUID.fromString(Jwts.parser()
                    .verifyWith(Keys.hmacShaKeyFor(accessSecret.getBytes()))
                    .build()
                    .parseSignedClaims(accessToken)
                    .getPayload()
                    .getSubject());
        } catch (Exception e) {
            throw new UnauthorizedException("Invalid access token");
        }

    }

    public UUID extractUserIdFromWsAccessToken(String wsAccessToken) throws UnauthorizedException {
        try {
            return UUID.fromString(Jwts.parser()
                    .verifyWith(Keys.hmacShaKeyFor(wsAccessSecret.getBytes()))
                    .build()
                    .parseSignedClaims(wsAccessToken)
                    .getPayload()
                    .getSubject());
        } catch (Exception e) {
            throw new UnauthorizedException("Invalid ws_access token");
        }
    }

}