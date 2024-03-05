package backendapp.myPizza.controllers;

import backendapp.myPizza.Models.entities.User;
import backendapp.myPizza.Models.reqDTO.LoginDTO;
import backendapp.myPizza.Models.reqDTO.UserDTO;
import backendapp.myPizza.Models.resDTO.TokenPair;
import backendapp.myPizza.exceptions.UnauthorizedException;
import backendapp.myPizza.services.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private AuthService authSvc;

    @PostMapping("/register")
    public User register(@RequestBody UserDTO userDTO) {
        return authSvc.register(userDTO);
    }



    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginDTO loginDTO, HttpServletResponse res) throws UnauthorizedException, NoSuchAlgorithmException, InvalidKeySpecException, IOException {
        TokenPair tokens = authSvc.login(loginDTO.email(), loginDTO.password());
        Cookie accessToken = new Cookie("__access_tkn", tokens.getAccessToken());
        accessToken.setHttpOnly(true);
        accessToken.setDomain("localhost");
        accessToken.setPath("/");
        Cookie refreshToken = new Cookie("__refresh_tkn", tokens.getRefreshToken());
        refreshToken.setHttpOnly(true);
        refreshToken.setDomain("localhost");
        refreshToken.setPath("/");
        res.addCookie(accessToken);
        res.addCookie(refreshToken);
        return new ResponseEntity<>("Authentication OK",
                HttpStatus.OK);
    }

    @GetMapping("/logout")
    public void logout(HttpServletResponse res) {
        Cookie accessToken = new Cookie("__access_tkn", null);
        Cookie refreshToken = new Cookie("__refresh_tkn", null);
        accessToken.setMaxAge(0);
        refreshToken.setMaxAge(0);
        accessToken.setPath("/");
        refreshToken.setPath("/");
        res.addCookie(accessToken);
        res.addCookie(refreshToken);
        System.out.println(res.getHeader("Set-Cookie"));
    }

}



