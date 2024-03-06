package backendapp.myPizza.security;

import backendapp.myPizza.Models.entities.User;
import backendapp.myPizza.Models.enums.TokenType;
import backendapp.myPizza.Models.resDTO.TokenPair;
import backendapp.myPizza.Models.resDTO.WsTokenPair;
import backendapp.myPizza.exceptions.UnauthorizedException;
import backendapp.myPizza.services.AuthUserService;
import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.DecodedJWT;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import net.iharder.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.security.Key;
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

    @Value("${access_token.publicKey}")
    private String accessPublicKey;

    @Value("${access_token.privateKey}")
    private String accessPrivateKey;

    @Value("${refresh_token.publicKey}")
    private String refreshPublicKey;

    @Value("${refresh_token.privateKey}")
    private String refreshPrivateKey;


    @Value("${access_token.expiresIn}")
    private String accessExp;
    @Value("${refresh_token.expiresIn}")
    private String refreshExp;
    @Value("${websocket_token.expiresIn}")
    private String websocketExp;


    private RSAPublicKey generatePublicKey(String key) throws NoSuchAlgorithmException, InvalidKeySpecException, IOException {
        KeyFactory kFactory = KeyFactory.getInstance("RSA");
        // decode base64 of your key
        byte[] buffer = Base64.decode(key, 0);
        // generate the public key
        X509EncodedKeySpec spec = new X509EncodedKeySpec(buffer);
        return (RSAPublicKey) kFactory.generatePublic(spec);
    }

    private RSAPrivateKey generatePrivateKey(String key) throws NoSuchAlgorithmException, IOException, InvalidKeySpecException {
        KeyFactory kFactory = KeyFactory.getInstance("RSA");
        byte[] buffer = Base64.decode(key, 0);
        PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(buffer);
        return (RSAPrivateKey) kFactory.generatePrivate(spec);
    }

    public TokenPair generateTokenPair(String refreshToken) throws UnauthorizedException {
        try {
            UUID userId = UUID.fromString(
                    Jwts.parser().
                            verifyWith(Keys.hmacShaKeyFor(refreshPrivateKey.getBytes())).
                            build()
                            .parseSignedClaims(refreshToken).
                            getPayload().
                            getSubject());
            User u = authUserSvc.findUserById(userId);
            System.out.println("Refresh");
            return new TokenPair(generateToken(u, TokenType.ACCESS), generateToken(u, TokenType.REFRESH));

        } catch (Exception exception) {
            throw new UnauthorizedException("Invalid refresh token");
        }


    }

    public WsTokenPair generateWsTokenPair(String refreshToken) throws UnauthorizedException {
        try {
            UUID userId = UUID.fromString(
                    Jwts.parser().
                            verifyWith(Keys.hmacShaKeyFor(refreshPrivateKey.getBytes())).
                            build()
                            .parseSignedClaims(refreshToken).
                            getPayload().
                            getSubject());
            User u = authUserSvc.findUserById(userId);
            return new WsTokenPair(generateToken(u, TokenType.WEBSOCKET), generateToken(u, TokenType.REFRESH));

        } catch (Exception exception) {
            throw new UnauthorizedException("Invalid refresh token");
        }


    }


    public void verifyAccessToken(String accessToken) throws UnauthorizedException {

        try {
            Jwts.parser().verifyWith(Keys.hmacShaKeyFor(accessPrivateKey.getBytes())).build()
                    .parseSignedClaims(accessToken).getPayload();
            System.out.println("authorized");
        } catch (ExpiredJwtException e) {
            throw e;
        } catch (Exception e) {
            throw new UnauthorizedException("Invalid access token");
        }

    }

    public String generateToken(User u, TokenType type) throws
            NoSuchAlgorithmException, InvalidKeySpecException, IOException {
        long exp = 1;
        String privateKey = accessPrivateKey;
        String publicKey = accessPublicKey;
        boolean restore = false;
        switch (type) {
            case TokenType.ACCESS -> {
                exp = Long.parseLong(accessExp);
                privateKey = accessPrivateKey;
                publicKey = accessPublicKey;
            }
            case TokenType.REFRESH -> {
                exp = Long.parseLong(refreshExp);
                privateKey = refreshPrivateKey;
                publicKey = refreshPublicKey;
            }
            case TokenType.WEBSOCKET -> {
                exp = Long.parseLong(websocketExp);
                privateKey = accessPrivateKey;
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
                .signWith(Keys.hmacShaKeyFor(privateKey.getBytes()))
                .compact();
    }

    public UUID extractUserIdFromAccessToken(String accessToken) throws NoSuchAlgorithmException, InvalidKeySpecException, IOException, UnauthorizedException {

        try {
            return UUID.fromString(Jwts.parser()
                    .verifyWith(Keys.hmacShaKeyFor(accessPrivateKey.getBytes()))
                    .build()
                    .parseSignedClaims(accessToken)
                    .getPayload()
                    .getSubject());
        } catch (Exception e) {
            throw new UnauthorizedException("Invalid access token");
        }

    }

}