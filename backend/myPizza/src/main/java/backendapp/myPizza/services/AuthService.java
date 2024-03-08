package backendapp.myPizza.services;

import backendapp.myPizza.Models.entities.User;
import backendapp.myPizza.Models.enums.TokenPairType;
import backendapp.myPizza.Models.enums.TokenType;
import backendapp.myPizza.Models.reqDTO.UserDTO;
import backendapp.myPizza.Models.resDTO.TokenPair;
import backendapp.myPizza.exceptions.UnauthorizedException;
import backendapp.myPizza.repositories.UserRepository;
import backendapp.myPizza.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.*;

@Service
public class AuthService {

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserRepository userRp;

    public User register(UserDTO userDTO) {
        User u = new User(userDTO.firstName(), userDTO.lastName(), userDTO.email(),
                encoder.encode(userDTO.password()), userDTO.phoneNumber());
        return userRp.save(u);
    }

    public Map<TokenPairType, TokenPair> login(String email, String password) throws UnauthorizedException, NoSuchAlgorithmException, InvalidKeySpecException, IOException {
        User u = userRp.findByEmail(email).orElseThrow(
                () -> new UnauthorizedException("Email and/or password are incorrect")
        );
        if (!encoder.matches(password, u.getHashPassword()))
            throw new UnauthorizedException("Email and/or password are incorrect");
        Map<TokenPairType, TokenPair> tokenMap = new HashMap<>();
        TokenPair httpTokenPair = new TokenPair(jwtUtils.generateToken(u, TokenType.ACCESS),
                jwtUtils.generateToken(u, TokenType.REFRESH), TokenPairType.HTTP);
        tokenMap.put(TokenPairType.HTTP, httpTokenPair);
        TokenPair wsTokenPair = new TokenPair(jwtUtils.generateToken(u, TokenType.WS_ACCESS),
                jwtUtils.generateToken(u, TokenType.WS_REFRESH), TokenPairType.WS);
        tokenMap.put(TokenPairType.WS, wsTokenPair);
        return tokenMap;
    }


    public User findByUserId(UUID userId) throws UnauthorizedException {
        return userRp.findById(userId).orElseThrow(
                () -> new UnauthorizedException("Invalid access token")
        );
    }
}
